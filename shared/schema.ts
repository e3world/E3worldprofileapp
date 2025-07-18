import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  options: json("options").$type<string[]>().notNull(),
  weekStart: text("week_start").notNull(), // Format: YYYY-MM-DD
  isActive: boolean("is_active").default(true),
});

// Profile data schema (moved up to resolve forward reference)
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  // Phase 1: Personal Details
  eNumber: text("e_number").notNull().default(""),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  profileImage: text("profile_image").notNull(),
  relationshipStatus: text("relationship_status").notNull(),
  jobTitle: text("job_title").notNull(),
  area: text("area").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  
  // Privacy Settings
  hidePersonalInfo: boolean("hide_personal_info").default(false),
  
  // Phase 2: Links
  links: json("links").$type<Array<{name: string, url: string, icon: string}>>().notNull(),
  
  // Phase 3: Terms
  acceptedTerms: boolean("accepted_terms").default(false),
  
  // NFT Serial Code Association
  serialCode: text("serial_code").notNull(),
  dynamicLink: text("dynamic_link").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  email: text("email").notNull(),
  selectedAnswer: text("selected_answer").notNull(),
  profileId: integer("profile_id").references(() => profiles.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Profile schema moved up above submissions to resolve forward reference

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Keep existing user schema for auth (if needed later)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
