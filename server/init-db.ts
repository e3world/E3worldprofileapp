import { db } from "./db";
import { questions } from "@shared/schema";

async function initializeDatabase() {
  console.log("Initializing database with sample questions...");
  
  // Get current week start date
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysUntilMonday);
  const currentWeek = monday.toISOString().split('T')[0];
  
  // Next week
  const nextWeek = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Week after next
  const weekAfterNext = new Date(monday.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const sampleQuestions = [
    {
      text: "What is my eye colour?",
      options: ["Brown", "Green", "Blue", "Hazel"],
      weekStart: currentWeek,
      isActive: true,
    },
    {
      text: "What's my favorite workout?",
      options: ["Running", "Swimming", "Weightlifting", "Yoga"],
      weekStart: nextWeek,
      isActive: false,
    },
    {
      text: "Where was I born?",
      options: ["London", "New York", "Los Angeles", "Miami"],
      weekStart: weekAfterNext,
      isActive: false,
    },
  ];

  try {
    for (const question of sampleQuestions) {
      await db.insert(questions).values(question).onConflictDoNothing();
    }
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Run initialization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };