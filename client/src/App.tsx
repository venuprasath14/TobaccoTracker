import { useState, useEffect } from "react";
import "./App.css";

interface DailyEntry {
  id: string;
  date: string;
  tobaccoFree: boolean;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalTobaccoFreeDays: number;
  moneySaved: number;
}

// Simple localStorage management
const getStorageKey = (key: string) => `tobaccofree_${key}`;

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getEntries = (): DailyEntry[] => {
  const stored = localStorage.getItem(getStorageKey('entries'));
  return stored ? JSON.parse(stored) : [];
};

const saveEntries = (entries: DailyEntry[]) => {
  localStorage.setItem(getStorageKey('entries'), JSON.stringify(entries));
};

const calculateStats = (entries: DailyEntry[]): UserStats => {
  const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const totalTobaccoFreeDays = entries.filter(e => e.tobaccoFree).length;
  
  // Calculate current streak from today backwards
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const entry = entries.find(e => e.date === dateStr);
    if (entry?.tobaccoFree) {
      if (i === 0 || currentStreak > 0) currentStreak++;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  for (const entry of sortedEntries) {
    if (entry.tobaccoFree) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    totalTobaccoFreeDays,
    moneySaved: totalTobaccoFreeDays * 8.5 // Approximate daily cost
  };
};

function App() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [stats, setStats] = useState<UserStats>({ currentStreak: 0, longestStreak: 0, totalTobaccoFreeDays: 0, moneySaved: 0 });
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);

  useEffect(() => {
    const storedEntries = getEntries();
    setEntries(storedEntries);
    setStats(calculateStats(storedEntries));
    
    const today = getTodayDate();
    const todayRecord = storedEntries.find(e => e.date === today);
    setTodayEntry(todayRecord || null);
  }, []);

  const markTobaccoFree = (isFree: boolean) => {
    const today = getTodayDate();
    const newEntries = entries.filter(e => e.date !== today);
    
    const newEntry: DailyEntry = {
      id: `${today}_${Date.now()}`,
      date: today,
      tobaccoFree: isFree
    };
    
    newEntries.push(newEntry);
    setEntries(newEntries);
    setTodayEntry(newEntry);
    setStats(calculateStats(newEntries));
    saveEntries(newEntries);
  };

  const renderCalendar = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dateStr);
      const isToday = i === 0;
      
      days.push(
        <div
          key={dateStr}
          className={`calendar-day ${
            entry?.tobaccoFree ? 'success' : 
            entry ? 'failed' : 'empty'
          } ${isToday ? 'today' : ''}`}
          title={`${date.toLocaleDateString()}: ${
            entry?.tobaccoFree ? 'Tobacco-Free' : 
            entry ? 'Used Tobacco' : 'No Data'
          }`}
        >
          {date.getDate()}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>TobaccoFree</h1>
        <p>Track Your Tobacco-Free Journey</p>
      </header>

      <main className="main">
        {/* Today's Check-in */}
        <section className="card">
          <h2>Today's Check-in</h2>
          <p className="date">{new Date().toLocaleDateString()}</p>
          
          {todayEntry ? (
            <div className={`status ${todayEntry.tobaccoFree ? 'success' : 'failed'}`}>
              {todayEntry.tobaccoFree ? 'Tobacco-Free Today!' : 'Used Tobacco Today'}
              <p className="small">You can update this anytime today</p>
            </div>
          ) : (
            <p className="prompt">How did today go?</p>
          )}
          
          <div className="buttons">
            <button 
              onClick={() => markTobaccoFree(true)}
              className="btn btn-success"
            >
              Tobacco-Free
            </button>
            <button 
              onClick={() => markTobaccoFree(false)}
              className="btn btn-danger"
            >
              Used Tobacco
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="card">
          <h2>Your Progress</h2>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">{stats.currentStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>
            <div className="stat">
              <div className="stat-number">{stats.longestStreak}</div>
              <div className="stat-label">Best Streak</div>
            </div>
            <div className="stat">
              <div className="stat-number">{stats.totalTobaccoFreeDays}</div>
              <div className="stat-label">Total Days</div>
            </div>
            <div className="stat">
              <div className="stat-number">${stats.moneySaved.toFixed(0)}</div>
              <div className="stat-label">Money Saved</div>
            </div>
          </div>
        </section>

        {/* 30-Day Calendar */}
        <section className="card">
          <h2>30-Day Progress</h2>
          <div className="calendar">
            {renderCalendar()}
          </div>
          <div className="legend">
            <span className="legend-item">
              <div className="legend-color success"></div>
              Tobacco-Free
            </span>
            <span className="legend-item">
              <div className="legend-color failed"></div>
              Used Tobacco
            </span>
            <span className="legend-item">
              <div className="legend-color empty"></div>
              No Data
            </span>
          </div>
        </section>

        {/* Motivational Section */}
        <section className="card motivation">
          <h2>Keep Going!</h2>
          <p>Every tobacco-free day is a victory for your health and wallet!</p>
          {stats.currentStreak > 0 && (
            <p className="achievement">
              You're on a {stats.currentStreak}-day streak! Amazing!
            </p>
          )}
          {stats.totalTobaccoFreeDays >= 7 && (
            <p className="health-benefit">
              Your sense of taste and smell are improving!
            </p>
          )}
          {stats.totalTobaccoFreeDays >= 30 && (
            <p className="health-benefit">
              Your circulation is getting better!
            </p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Stay strong! Every day counts.</p>
      </footer>
    </div>
  );
}

export default App;