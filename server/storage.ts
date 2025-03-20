import { type TextSample, type TypingResult, type InsertTypingResult, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { textSamples, typingResults, users } from "@shared/schema";

export interface IStorage {
  getTextSamples(theme?: string): Promise<TextSample[]>;
  getRandomTextSample(theme?: string): Promise<TextSample>;
  saveTypingResult(result: InsertTypingResult): Promise<TypingResult>;
  getTopResults(limit?: number): Promise<(TypingResult & { username: string })[]>;
  getThemes(): Promise<string[]>;
  // User-related operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(data: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getTextSamples(theme?: string): Promise<TextSample[]> {
    if (theme) {
      return db.select().from(textSamples).where(eq(textSamples.theme, theme));
    }
    return db.select().from(textSamples);
  }

  async getRandomTextSample(theme?: string): Promise<TextSample> {
    const samples = await this.getTextSamples(theme);
    if (samples.length === 0) {
      throw new Error("No text samples found for the specified theme");
    }
    const randomIndex = Math.floor(Math.random() * samples.length);
    return samples[randomIndex];
  }

  async saveTypingResult(result: InsertTypingResult): Promise<TypingResult> {
    const [savedResult] = await db
      .insert(typingResults)
      .values(result)
      .returning();
    return savedResult;
  }

  async getTopResults(limit: number = 10): Promise<(TypingResult & { username: string })[]> {
    return db
      .select({
        id: typingResults.id,
        wpm: typingResults.wpm,
        accuracy: typingResults.accuracy,
        createdAt: typingResults.createdAt,
        username: users.username
      })
      .from(typingResults)
      .innerJoin(users, eq(users.id, typingResults.userId))
      .orderBy(desc(typingResults.wpm))
      .limit(limit);
  }

  async getThemes(): Promise<string[]> {
    const results = await db
      .select({ theme: textSamples.theme })
      .from(textSamples)
      .groupBy(textSamples.theme);
    return results.map(r => r.theme);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(data: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();