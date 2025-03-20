export function calculateWPM(typedText: string, elapsedTimeInSeconds: number): number {
  const words = typedText.trim().split(/\s+/).length;
  const minutes = elapsedTimeInSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(originalText: string, typedText: string): number {
  if (!typedText) return 100;
  
  const original = originalText.slice(0, typedText.length);
  let correctChars = 0;
  
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === original[i]) {
      correctChars++;
    }
  }
  
  return Math.round((correctChars / typedText.length) * 100);
}

export function getCharacterClass(originalChar: string, typedChar: string | undefined): string {
  if (!typedChar) return "text-muted-foreground";
  if (originalChar === typedChar) return "text-green-500";
  return "text-red-500";
}
