import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { calculateWPM, calculateAccuracy, getCharacterClass } from "@/lib/typing-utils";
import { saveTypingResult } from "@/lib/text-samples";
import { type TextSample } from "@shared/schema";

interface TypingTestProps {
  textSample: TextSample;
  onComplete: () => void;
}

export function TypingTest({ textSample, onComplete }: TypingTestProps) {
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(40); 
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTestComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setTypedText("");
    setTimeLeft(40); 
    inputRef.current?.focus();
  };

  const handleTestComplete = async () => {
    setIsActive(false);
    setIsComplete(true);
    const wpm = calculateWPM(typedText, 40 - timeLeft); 
    const accuracy = calculateAccuracy(textSample.content, typedText);

    try {
      await saveTypingResult(wpm, accuracy, textSample.id);
      toast({
        title: "Test Complete!",
        description: `WPM: ${wpm}, Accuracy: ${accuracy}%`,
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save results",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">Typing Test</h3>
            <p className="text-sm text-muted-foreground">
              Type the text below as fast and accurately as you can
            </p>
          </div>
          <div className="text-3xl font-mono">{timeLeft}s</div>
        </div>

        <div className="relative bg-muted p-4 rounded-md">
          {textSample.content.split("").map((char, idx) => (
            <span
              key={idx}
              className={getCharacterClass(char, typedText[idx])}
            >
              {char}
            </span>
          ))}
        </div>

        <textarea
          ref={inputRef}
          className="w-full p-4 border rounded-md bg-background"
          value={typedText}
          onChange={(e) => {
            if (isActive && !isComplete) {
              setTypedText(e.target.value);
            }
          }}
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          disabled={!isActive || isComplete}
          placeholder={isActive ? "Start typing..." : "Click Start to begin"}
          style={{ resize: 'none' }}
        />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>WPM: {calculateWPM(typedText, 40 - timeLeft)}</span> 
            <span>
              Accuracy: {calculateAccuracy(textSample.content, typedText)}%
            </span>
          </div>
          <Progress
            value={(typedText.length / textSample.content.length) * 100}
          />
        </div>

        <Button
          className="w-full"
          onClick={isComplete ? onComplete : handleStart}
        >
          {isComplete ? "Try Again" : "Start Test"}
        </Button>
      </CardContent>
    </Card>
  );
}