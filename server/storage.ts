import { users, questions, submissions, profiles, type User, type InsertUser, type Question, type InsertQuestion, type Submission, type InsertSubmission, type Profile, type InsertProfile } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question management
  getCurrentQuestion(): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getAllQuestions(): Promise<Question[]>;
  
  // Submission management
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByQuestion(questionId: number): Promise<Submission[]>;
  
  // Profile management
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileBySerialCode(serialCode: string): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private submissions: Map<number, Submission>;
  private profiles: Map<number, Profile>;
  private currentUserId: number;
  private currentQuestionId: number;
  private currentSubmissionId: number;
  private currentProfileId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.submissions = new Map();
    this.profiles = new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentSubmissionId = 1;
    this.currentProfileId = 1;
    
    // Initialize with sample questions
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const sampleQuestions: InsertQuestion[] = [
      {
        text: "What is this users natural role",
        options: ["Leader", "Supporter", "Entertainer", "Organiser"],
        weekStart: this.getCurrentWeekStart(),
        isActive: true,
      },
      {
        text: "What's my favorite workout?",
        options: ["Running", "Swimming", "Weightlifting", "Yoga"],
        weekStart: this.getNextWeekStart(),
        isActive: false,
      },
      {
        text: "Where was I born?",
        options: ["London", "New York", "Los Angeles", "Miami"],
        weekStart: this.getWeekStart(2),
        isActive: false,
      },
    ];

    sampleQuestions.forEach(question => {
      const id = this.currentQuestionId++;
      const fullQuestion: Question = { 
        ...question, 
        id,
        options: question.options as string[],
        isActive: question.isActive ?? false
      };
      this.questions.set(id, fullQuestion);
    });
  }

  private getCurrentWeekStart(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    return startOfWeek.toISOString().split('T')[0];
  }

  private getNextWeekStart(): string {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() - now.getDay() + 7); // Start of next week
    return nextWeek.toISOString().split('T')[0];
  }

  private getWeekStart(weeksFromNow: number): string {
    const now = new Date();
    const futureWeek = new Date(now);
    futureWeek.setDate(now.getDate() - now.getDay() + (weeksFromNow * 7));
    return futureWeek.toISOString().split('T')[0];
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCurrentQuestion(): Promise<Question | undefined> {
    const currentWeek = this.getCurrentWeekStart();
    
    // Find question for current week
    const currentQuestion = Array.from(this.questions.values()).find(
      (question) => question.weekStart === currentWeek
    );
    
    // If no question for current week, return the first available question
    if (!currentQuestion) {
      return Array.from(this.questions.values())[0];
    }
    
    return currentQuestion;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { 
      ...insertQuestion, 
      id,
      options: insertQuestion.options as string[],
      isActive: insertQuestion.isActive ?? false
    };
    this.questions.set(id, question);
    return question;
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = { 
      ...insertSubmission, 
      id,
      submittedAt: new Date()
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissionsByQuestion(questionId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.questionId === questionId
    );
  }

  // Profile management methods
  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const profile: Profile = { 
      ...insertProfile, 
      id,
      phone: insertProfile.phone ?? null,
      hidePersonalInfo: insertProfile.hidePersonalInfo ?? false,
      links: insertProfile.links as Array<{name: string, url: string, icon: string}>,
      acceptedTerms: insertProfile.acceptedTerms ?? false,
      createdAt: new Date()
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileBySerialCode(serialCode: string): Promise<Profile | undefined> {
    console.log(`Storage: Looking for serial code: ${serialCode}`);
    console.log(`Storage: Available profiles:`, Array.from(this.profiles.values()).map(p => ({ id: p.id, name: p.name, serialCode: p.serialCode })));
    
    for (const profile of this.profiles.values()) {
      console.log(`Comparing: "${profile.serialCode}" === "${serialCode}"`);
      if (profile.serialCode === serialCode) {
        console.log(`Found matching profile: ${profile.name}`);
        return profile;
      }
    }
    console.log(`No profile found for serial code: ${serialCode}`);
    return undefined;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async updateProfile(id: number, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return undefined;
    }
    
    const updatedProfile: Profile = {
      ...existingProfile,
      ...profileData,
      phone: profileData.phone ?? existingProfile.phone,
      hidePersonalInfo: profileData.hidePersonalInfo ?? existingProfile.hidePersonalInfo,
      links: profileData.links ? profileData.links as Array<{name: string, url: string, icon: string}> : existingProfile.links,
      acceptedTerms: profileData.acceptedTerms ?? existingProfile.acceptedTerms,
    };
    
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }
}

import { DatabaseStorage } from "./db-storage";

// Use database storage if DATABASE_URL is available, otherwise use in-memory storage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
