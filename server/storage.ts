import { users, questions, submissions, type User, type InsertUser, type Question, type InsertQuestion, type Submission, type InsertSubmission } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private submissions: Map<number, Submission>;
  private currentUserId: number;
  private currentQuestionId: number;
  private currentSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.submissions = new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentSubmissionId = 1;
    
    // Initialize with sample questions
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const sampleQuestions: InsertQuestion[] = [
      {
        text: "What is my eye colour?",
        options: ["Brown", "Green", "Blue", "Hazel"],
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
      const fullQuestion: Question = { ...question, id };
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
    const question: Question = { ...insertQuestion, id };
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
}

export const storage = new MemStorage();
