import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const textSamples = pgTable("text_samples", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  difficulty: text("difficulty").notNull(),
  theme: text("theme").notNull().default('general'),
});

export const typingResults = pgTable("typing_results", {
  id: serial("id").primaryKey(),
  wpm: integer("wpm").notNull(),
  accuracy: integer("accuracy").notNull(),
  textSampleId: integer("text_sample_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTextSampleSchema = createInsertSchema(textSamples).pick({
  content: true,
  difficulty: true,
  theme: true,
});

export const insertTypingResultSchema = createInsertSchema(typingResults).pick({
  wpm: true,
  accuracy: true,
  textSampleId: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TextSample = typeof textSamples.$inferSelect;
export type InsertTypingResult = z.infer<typeof insertTypingResultSchema>;
export type TypingResult = typeof typingResults.$inferSelect;