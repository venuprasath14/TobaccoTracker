import { pgTable, text, boolean, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Daily entries table
export const dailyEntries = pgTable('daily_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD format
  tobaccoFree: boolean('tobacco_free').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User stats table
export const userStats = pgTable('user_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  totalTobaccoFreeDays: integer('total_tobacco_free_days').default(0).notNull(),
  moneySaved: text('money_saved').default('0').notNull(),
  startDate: text('start_date').notNull(), // YYYY-MM-DD format
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'streak', 'days', 'money', etc.
  value: integer('value').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDailyEntrySchema = createInsertSchema(dailyEntries).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDailyEntry = z.infer<typeof insertDailyEntrySchema>;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type User = typeof users.$inferSelect;
export type DailyEntry = typeof dailyEntries.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;