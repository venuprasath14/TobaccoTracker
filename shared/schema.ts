import { pgTable, text, serial, integer, boolean, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: date("created_at").defaultNow(),
});

export const dailyEntries = pgTable("daily_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  tobaccoFree: boolean("tobacco_free").notNull(),
  createdAt: date("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // streak_milestone, health_milestone, money_saved, etc.
  value: integer("value").notNull(), // days, amount, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  unlockedAt: date("unlocked_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalTobaccoFreeDays: integer("total_tobacco_free_days").default(0),
  moneySaved: decimal("money_saved", { precision: 10, scale: 2 }).default("0.00"),
  startDate: date("start_date").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDailyEntrySchema = createInsertSchema(dailyEntries).pick({
  userId: true,
  date: true,
  tobaccoFree: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
  value: true,
  title: true,
  description: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).pick({
  userId: true,
  currentStreak: true,
  longestStreak: true,
  totalTobaccoFreeDays: true,
  moneySaved: true,
  startDate: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DailyEntry = typeof dailyEntries.$inferSelect;
export type InsertDailyEntry = z.infer<typeof insertDailyEntrySchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
