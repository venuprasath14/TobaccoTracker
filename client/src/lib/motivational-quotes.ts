export interface MotivationalQuote {
  text: string;
  author: string;
}

export const motivationalQuotes: MotivationalQuote[] = [
  {
    text: "Every moment is a fresh beginning. You have the strength to choose freedom.",
    author: "Daily Motivation"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Your body is your temple. Keep it pure and clean for the soul to reside in.",
    author: "B.K.S. Iyengar"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "You are stronger than you think and more resilient than you know.",
    author: "Daily Wisdom"
  },
  {
    text: "Every day you stay tobacco-free, your body thanks you in ways you can't even see.",
    author: "Health Reminder"
  },
  {
    text: "Freedom is not worth having if it does not include the freedom to make mistakes.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "Your future self will thank you for the choice you make today.",
    author: "Motivation"
  },
  {
    text: "Healing is a matter of time, but it is sometimes also a matter of opportunity.",
    author: "Hippocrates"
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil"
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown"
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Fitness Wisdom"
  }
];

export function getRandomQuote(): MotivationalQuote {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

export function getDailyQuote(): MotivationalQuote {
  // Use date as seed for consistent daily quote
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const quoteIndex = dayOfYear % motivationalQuotes.length;
  return motivationalQuotes[quoteIndex];
}
