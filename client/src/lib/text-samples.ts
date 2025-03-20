import { type TextSample, type TypingResult } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function getRandomTextSample(theme?: string): Promise<TextSample> {
  const url = theme ? `/api/text-samples/random?theme=${theme}` : "/api/text-samples/random";
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function saveTypingResult(wpm: number, accuracy: number, textSampleId: number) {
  return apiRequest("POST", "/api/typing-results", {
    wpm,
    accuracy,
    textSampleId,
  });
}

export async function getTopResults(limit: number = 10): Promise<TypingResult[]> {
  const response = await apiRequest("GET", `/api/typing-results/top?limit=${limit}`);
  return response.json();
}

export async function getThemes(): Promise<string[]> {
  const response = await apiRequest("GET", "/api/themes");
  return response.json();
}