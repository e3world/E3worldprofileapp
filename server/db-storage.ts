import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, questions, submissions, profiles, type User, type InsertUser, type Question, type InsertQuestion, type Submission, type InsertSubmission, type Profile, type InsertProfile } from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getCurrentQuestion(): Promise<Question | undefined> {
    // Get current week start date
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysUntilMonday);
    const currentWeek = monday.toISOString().split('T')[0];
    
    const result = await db
      .select()
      .from(questions)
      .where(eq(questions.weekStart, currentWeek));
    
    if (result.length > 0) {
      return result[0];
    }
    
    // If no question for current week, return the first available question
    const firstQuestion = await db.select().from(questions).limit(1);
    return firstQuestion[0];
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const result = await db.insert(questions).values(insertQuestion).returning();
    return result[0];
  }

  async getAllQuestions(): Promise<Question[]> {
    return await db.select().from(questions);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const result = await db.insert(submissions).values(insertSubmission).returning();
    return result[0];
  }

  async getSubmissionsByQuestion(questionId: number): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.questionId, questionId));
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(insertProfile).returning();
    return result[0];
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id));
    return result[0];
  }

  async getProfileBySerialCode(serialCode: string): Promise<Profile | undefined> {
    console.log(`Database: Looking for serial code: ${serialCode}`);
    const result = await db.select().from(profiles).where(eq(profiles.serialCode, serialCode));
    console.log(`Database: Found ${result.length} profiles with serial code: ${serialCode}`);
    return result[0];
  }

  async getProfileByENumber(eNumber: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.eNumber, eNumber));
    return result[0];
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }

  async updateProfile(id: number, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db
      .update(profiles)
      .set(profileData)
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }
}