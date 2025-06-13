export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface DailyEntry {
  id: string;
  userId: string;
  date: string;
  tobaccoFree: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  value: number;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface UserStats {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalTobaccoFreeDays: number;
  moneySaved: string;
  startDate: string;
}

export class LocalStorage {
  private getStorageKey(key: string): string {
    return `tobaccofree_${key}`;
  }

  // Users
  getUsers(): User[] {
    const users = localStorage.getItem(this.getStorageKey('users'));
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));
  }

  getUserByUsername(username: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  }

  createUser(username: string, password: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password,
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    this.saveUsers(users);

    // Initialize user stats
    this.createUserStats(newUser.id);
    
    return newUser;
  }

  // Daily Entries
  getDailyEntries(userId: string): DailyEntry[] {
    const entries = localStorage.getItem(this.getStorageKey(`entries_${userId}`));
    return entries ? JSON.parse(entries) : [];
  }

  saveDailyEntries(userId: string, entries: DailyEntry[]): void {
    localStorage.setItem(this.getStorageKey(`entries_${userId}`), JSON.stringify(entries));
  }

  getDailyEntry(userId: string, date: string): DailyEntry | undefined {
    const entries = this.getDailyEntries(userId);
    return entries.find(entry => entry.date === date);
  }

  createOrUpdateDailyEntry(userId: string, date: string, tobaccoFree: boolean): DailyEntry {
    const entries = this.getDailyEntries(userId);
    const existingIndex = entries.findIndex(entry => entry.date === date);
    
    if (existingIndex >= 0) {
      entries[existingIndex].tobaccoFree = tobaccoFree;
      this.saveDailyEntries(userId, entries);
      return entries[existingIndex];
    } else {
      const newEntry: DailyEntry = {
        id: crypto.randomUUID(),
        userId,
        date,
        tobaccoFree,
        createdAt: new Date().toISOString().split('T')[0]
      };
      entries.push(newEntry);
      this.saveDailyEntries(userId, entries);
      return newEntry;
    }
  }

  // User Stats
  getUserStats(userId: string): UserStats | undefined {
    const stats = localStorage.getItem(this.getStorageKey(`stats_${userId}`));
    return stats ? JSON.parse(stats) : undefined;
  }

  saveUserStats(stats: UserStats): void {
    localStorage.setItem(this.getStorageKey(`stats_${stats.userId}`), JSON.stringify(stats));
  }

  createUserStats(userId: string): UserStats {
    const stats: UserStats = {
      id: crypto.randomUUID(),
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalTobaccoFreeDays: 0,
      moneySaved: "0.00",
      startDate: new Date().toISOString().split('T')[0]
    };
    this.saveUserStats(stats);
    return stats;
  }

  updateUserStats(userId: string): UserStats {
    const entries = this.getDailyEntries(userId);
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

    const existingStats = this.getUserStats(userId);
    const moneySaved = (tobaccoFreeEntries.length * 10).toFixed(2);

    const updatedStats: UserStats = {
      id: existingStats?.id || crypto.randomUUID(),
      userId,
      currentStreak,
      longestStreak,
      totalTobaccoFreeDays: tobaccoFreeEntries.length,
      moneySaved,
      startDate: existingStats?.startDate || new Date().toISOString().split('T')[0]
    };

    this.saveUserStats(updatedStats);
    return updatedStats;
  }

  // Achievements
  getUserAchievements(userId: string): Achievement[] {
    const achievements = localStorage.getItem(this.getStorageKey(`achievements_${userId}`));
    return achievements ? JSON.parse(achievements) : [];
  }

  saveUserAchievements(userId: string, achievements: Achievement[]): void {
    localStorage.setItem(this.getStorageKey(`achievements_${userId}`), JSON.stringify(achievements));
  }

  createAchievement(userId: string, type: string, value: number, title: string, description: string): Achievement {
    const achievements = this.getUserAchievements(userId);
    const newAchievement: Achievement = {
      id: crypto.randomUUID(),
      userId,
      type,
      value,
      title,
      description,
      unlockedAt: new Date().toISOString().split('T')[0]
    };
    achievements.push(newAchievement);
    this.saveUserAchievements(userId, achievements);
    return newAchievement;
  }

  hasAchievement(userId: string, type: string, value: number): boolean {
    const achievements = this.getUserAchievements(userId);
    return achievements.some(achievement => 
      achievement.type === type && achievement.value === value
    );
  }

  checkAndAwardAchievements(userId: string): Achievement[] {
    const stats = this.getUserStats(userId);
    if (!stats) return [];

    const newAchievements: Achievement[] = [];
    const achievementTypes = [
      { type: "streak_milestone", values: [1, 3, 7, 14, 30, 60, 90, 365] },
      { type: "money_milestone", values: [50, 100, 250, 500, 1000] }
    ];

    // Check streak milestones
    for (const value of achievementTypes[0].values) {
      if (stats.currentStreak >= value && !this.hasAchievement(userId, "streak_milestone", value)) {
        const achievement = this.createAchievement(
          userId,
          "streak_milestone",
          value,
          `${value} Day${value > 1 ? 's' : ''} Strong!`,
          `Completed ${value} tobacco-free day${value > 1 ? 's' : ''} in a row`
        );
        newAchievements.push(achievement);
      }
    }

    // Check money milestones
    const moneySavedNum = parseFloat(stats.moneySaved);
    for (const value of achievementTypes[1].values) {
      if (moneySavedNum >= value && !this.hasAchievement(userId, "money_milestone", value)) {
        const achievement = this.createAchievement(
          userId,
          "money_milestone",
          value,
          `$${value} Saved!`,
          `You've saved $${value} by staying tobacco-free`
        );
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  // Current User Session
  getCurrentUser(): User | null {
    const currentUserId = localStorage.getItem(this.getStorageKey('currentUser'));
    if (!currentUserId) return null;
    
    const users = this.getUsers();
    return users.find(user => user.id === currentUserId) || null;
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem(this.getStorageKey('currentUser'), userId);
  }

  logout(): void {
    localStorage.removeItem(this.getStorageKey('currentUser'));
  }
}

export const storage = new LocalStorage();