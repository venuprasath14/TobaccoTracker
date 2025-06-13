import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDailyEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user stats and recent entries
  app.get("/api/user/:userId/dashboard", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      const recentEntries = await storage.getDailyEntriesForUser(userId, 30);
      const achievements = await storage.getUserAchievements(userId);
      
      if (!stats) {
        return res.status(404).json({ message: "User stats not found" });
      }

      res.json({
        stats,
        recentEntries,
        achievements: achievements.slice(0, 5) // Recent 5 achievements
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Create or update daily entry
  app.post("/api/daily-entry", async (req, res) => {
    try {
      const validatedData = insertDailyEntrySchema.parse(req.body);
      const entry = await storage.updateDailyEntry(
        validatedData.userId,
        validatedData.date,
        validatedData.tobaccoFree
      );

      // Update user stats
      await updateUserStats(validatedData.userId);
      
      // Check for new achievements
      await checkAchievements(validatedData.userId);

      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create daily entry" });
      }
    }
  });

  // Get daily entries for calendar view
  app.get("/api/user/:userId/entries", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const entries = await storage.getDailyEntriesForUser(userId, days);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Get achievements
  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Helper function to update user stats
  async function updateUserStats(userId: number) {
    const entries = await storage.getDailyEntriesForUser(userId, 365); // Get full year
    const tobaccoFreeEntries = entries.filter(entry => entry.tobaccoFree);
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const entry of sortedEntries) {
      if (entry.tobaccoFree) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (const entry of entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())) {
      if (entry.tobaccoFree) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate money saved (assuming $10 per day)
    const moneySaved = (tobaccoFreeEntries.length * 10).toFixed(2);

    await storage.updateUserStats(userId, {
      currentStreak,
      longestStreak,
      totalTobaccoFreeDays: tobaccoFreeEntries.length,
      moneySaved
    });
  }

  // Helper function to check and award achievements
  async function checkAchievements(userId: number) {
    const stats = await storage.getUserStats(userId);
    if (!stats) return;

    const achievementTypes = [
      { type: "streak_milestone", values: [1, 3, 7, 14, 30, 60, 90, 365] },
      { type: "money_milestone", values: [50, 100, 250, 500, 1000] }
    ];

    // Check streak milestones
    for (const value of achievementTypes[0].values) {
      if ((stats.currentStreak || 0) >= value && !await storage.hasAchievement(userId, "streak_milestone", value)) {
        await storage.createAchievement({
          userId,
          type: "streak_milestone",
          value,
          title: `${value} Day${value > 1 ? 's' : ''} Strong!`,
          description: `Completed ${value} tobacco-free day${value > 1 ? 's' : ''} in a row`
        });
      }
    }

    // Check money milestones
    const moneySavedNum = parseFloat(stats.moneySaved || "0");
    for (const value of achievementTypes[1].values) {
      if (moneySavedNum >= value && !await storage.hasAchievement(userId, "money_milestone", value)) {
        await storage.createAchievement({
          userId,
          type: "money_milestone",
          value,
          title: `$${value} Saved!`,
          description: `You've saved $${value} by staying tobacco-free`
        });
      }
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
