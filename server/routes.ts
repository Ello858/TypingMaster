import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);

  app.get("/api/text-samples/random", async (req, res) => {
    try {
      const theme = req.query.theme as string | undefined;
      const sample = await storage.getRandomTextSample(theme);
      res.json(sample);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random text sample" });
    }
  });

  app.get("/api/themes", async (req, res) => {
    try {
      const themes = await storage.getThemes();
      res.json(themes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch themes" });
    }
  });

  app.post("/api/typing-results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Must be logged in to save results" });
    }

    try {
      const result = await storage.saveTypingResult({
        ...req.body,
        userId: req.user!.id,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to save typing result" });
    }
  });

  app.get("/api/typing-results/top", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const results = await storage.getTopResults(limit);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}