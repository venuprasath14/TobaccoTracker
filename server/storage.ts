import { 
  users, 
  dailyEntries, 
  achievements, 
  userStats,
  type User, 
  type InsertUser,
  type DailyEntry,
  type InsertDailyEntry,
  type Achievement,
  type InsertAchievement,
  type UserStats,
  type InsertUserStats
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Daily entries
  getDailyEntry(userId: number, date: string): Promise<DailyEntry | undefined>;
  createDailyEntry(entry: InsertDailyEntry): Promise<DailyEntry>;
  updateDailyEntry(userId: number, date: string, tobaccoFree: boolean): Promise<DailyEntry>;
  getDailyEntriesForUser(userId: number, days?: number): Promise<DailyEntry[]>;
  
  // User stats
  getUserStats(userId: number): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats>;
  
  // Achievements
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  hasAchievement(userId: number, type: string, value: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dailyEntries: Map<string, DailyEntry>;
  private achievements: Map<number, Achievement>;
  private userStats: Map<number, UserStats>;
  private currentUserId: number;
  private currentEntryId: number;
  private currentAchievementId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.dailyEntries = new Map();
    this.achievements = new Map();
    this.userStats = new Map();
    this.currentUserId = 1;
    this.currentEntryId = 1;
    this.currentAchievementId = 1;
    this.currentStatsId = 1;
    
    // Initialize with demo user and data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: "demo",
      password: "demo",
      createdAt: "2024-12-01"
    };
    this.users.set(1, demoUser);
    this.currentUserId = 2;

    // Create user stats
    const userStats: UserStats = {
      id: 1,
      userId: 1,
      currentStreak: 5,
      longestStreak: 7,
      totalTobaccoFreeDays: 12,
      moneySaved: "120.00",
      startDate: "2024-12-01"
    };
    this.userStats.set(1, userStats);
    this.currentStatsId = 2;

    // Create some daily entries
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry: DailyEntry = {
        id: this.currentEntryId++,
        userId: 1,
        date: dateStr,
        tobaccoFree: true,
        createdAt: dateStr
      };
      this.dailyEntries.set(`1-${dateStr}`, entry);
    }

    // Add some achievements
    const achievements = [
      {
        id: 1,
        userId: 1,
        type: "streak_milestone",
        value: 1,
        title: "First Day Strong!",
        description: "Completed 1 tobacco-free day in a row",
        unlockedAt: "2024-12-01"
      },
      {
        id: 2,
        userId: 1,
        type: "streak_milestone", 
        value: 3,
        title: "3 Days Strong!",
        description: "Completed 3 tobacco-free days in a row",
        unlockedAt: "2024-12-03"
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
    this.currentAchievementId = 3;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.users.set(id, user);
    
    // Create initial stats for the user
    await this.createUserStats({
      userId: id,
      currentStreak: 0,
      longestStreak: 0,
      totalTobaccoFreeDays: 0,
      moneySaved: "0.00",
      startDate: new Date().toISOString().split('T')[0]
    });
    
    return user;
  }

  async getDailyEntry(userId: number, date: string): Promise<DailyEntry | undefined> {
    const key = `${userId}-${date}`;
    return this.dailyEntries.get(key);
  }

  async createDailyEntry(entry: InsertDailyEntry): Promise<DailyEntry> {
    const id = this.currentEntryId++;
    const dailyEntry: DailyEntry = {
      ...entry,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const key = `${entry.userId}-${entry.date}`;
    this.dailyEntries.set(key, dailyEntry);
    return dailyEntry;
  }

  async updateDailyEntry(userId: number, date: string, tobaccoFree: boolean): Promise<DailyEntry> {
    const key = `${userId}-${date}`;
    const existing = this.dailyEntries.get(key);
    
    if (existing) {
      existing.tobaccoFree = tobaccoFree;
      this.dailyEntries.set(key, existing);
      return existing;
    } else {
      return this.createDailyEntry({ userId, date, tobaccoFree });
    }
  }

  async getDailyEntriesForUser(userId: number, days: number = 30): Promise<DailyEntry[]> {
    const entries = Array.from(this.dailyEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days);
    return entries;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find(stats => stats.userId === userId);
  }

  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    const id = this.currentStatsId++;
    const userStats: UserStats = { 
      id,
      userId: stats.userId,
      currentStreak: stats.currentStreak ?? 0,
      longestStreak: stats.longestStreak ?? 0,
      totalTobaccoFreeDays: stats.totalTobaccoFreeDays ?? 0,
      moneySaved: stats.moneySaved ?? "0.00",
      startDate: stats.startDate ?? new Date().toISOString().split('T')[0]
    };
    this.userStats.set(id, userStats);
    return userStats;
  }

  async updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats> {
    const existing = Array.from(this.userStats.values()).find(stats => stats.userId === userId);
    if (!existing) {
      throw new Error("User stats not found");
    }
    
    const updated: UserStats = { 
      ...existing, 
      ...updates,
      currentStreak: updates.currentStreak ?? existing.currentStreak,
      longestStreak: updates.longestStreak ?? existing.longestStreak,
      totalTobaccoFreeDays: updates.totalTobaccoFreeDays ?? existing.totalTobaccoFreeDays,
      moneySaved: updates.moneySaved ?? existing.moneySaved,
      startDate: updates.startDate ?? existing.startDate
    };
    this.userStats.set(existing.id, updated);
    return updated;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => new Date(b.unlockedAt || '').getTime() - new Date(a.unlockedAt || '').getTime());
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const newAchievement: Achievement = {
      ...achievement,
      id,
      unlockedAt: new Date().toISOString().split('T')[0]
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async hasAchievement(userId: number, type: string, value: number): Promise<boolean> {
    return Array.from(this.achievements.values()).some(
      achievement => achievement.userId === userId && 
                   achievement.type === type && 
                   achievement.value === value
    );
  }
}

export const storage = new MemStorage();
