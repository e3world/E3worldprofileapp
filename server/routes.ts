import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertProfileSchema } from "@shared/schema";
import { z } from "zod";
import { sendEmail, formatAnswerEmail, sendWelcomeEmail } from "./email";
import { isValidSerialCode } from "@shared/serialCodes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate E serial code
  app.post("/api/validate-eserial", async (req, res) => {
    try {
      const { eNumber } = req.body;
      
      if (!eNumber || typeof eNumber !== 'string') {
        return res.status(400).json({ 
          valid: false, 
          message: "E serial is required" 
        });
      }

      // Check if E serial is in valid list
      if (!isValidSerialCode(eNumber)) {
        return res.status(400).json({ 
          valid: false, 
          message: "Invalid E serial code" 
        });
      }

      // Check if E serial is already used
      const existingProfile = await storage.getProfileByENumber(eNumber);
      if (existingProfile) {
        return res.status(400).json({ 
          valid: false, 
          message: "This E serial has already been registered" 
        });
      }

      res.json({ 
        valid: true, 
        message: "E serial is valid and available" 
      });
    } catch (error) {
      console.error("Error validating E serial:", error);
      res.status(500).json({ 
        valid: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get current question
  app.get("/api/questions/current", async (req, res) => {
    try {
      const question = await storage.getCurrentQuestion();
      if (!question) {
        return res.status(404).json({ message: "No active question found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error fetching current question:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Submit answer
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      // Send welcome email to the user and notification to hello@e3world.co.uk
      try {
        if (validatedData.profileId) {
          const profile = await storage.getProfile(validatedData.profileId);
          const question = await storage.getCurrentQuestion();
          
          if (profile && question) {
            // Send welcome email to the user
            await sendWelcomeEmail(validatedData.email);
            
            // Send notification email to hello@e3world.co.uk
            const emailData = formatAnswerEmail(
              profile.serialCode,
              validatedData.email,
              question.text,
              validatedData.selectedAnswer
            );
            
            await sendEmail(emailData);
          }
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Continue with response even if email fails
      }
      
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      console.error("Error creating submission:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all questions (for admin purposes)
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile management routes
  app.post("/api/profiles", async (req, res) => {
    try {
      console.log("Received profile data:", {
        ...req.body,
        profileImage: req.body.profileImage ? `[Base64 Image - ${req.body.profileImage.length} chars]` : 'No image'
      });
      
      const validatedData = insertProfileSchema.parse(req.body);
      console.log("Validated profile data successfully");
      
      // Additional server-side E serial validation
      if (!isValidSerialCode(validatedData.eNumber)) {
        return res.status(400).json({ 
          message: "Invalid E serial code" 
        });
      }

      // Check if E serial is already used
      const existingProfile = await storage.getProfileByENumber(validatedData.eNumber);
      if (existingProfile) {
        return res.status(400).json({ 
          message: "This E serial has already been registered" 
        });
      }
      
      const profile = await storage.createProfile(validatedData);
      console.log("Profile created successfully:", profile.id);
      
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ 
          message: "Invalid profile data", 
          errors: error.errors,
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      console.error("Error creating profile:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get profile by serial code
  app.get("/api/profiles/serial/:serialCode", async (req, res) => {
    try {
      const serialCode = req.params.serialCode;
      console.log(`Searching for profile with serial code: ${serialCode}`);
      
      const profile = await storage.getProfileBySerialCode(serialCode);
      if (!profile) {
        console.log(`No profile found for serial code: ${serialCode}`);
        return res.status(404).json({ message: "Profile not found for this serial code" });
      }
      
      console.log(`Found profile for serial code: ${serialCode}`, profile.name);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile by serial code:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
