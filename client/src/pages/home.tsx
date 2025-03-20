import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TypingTest } from "@/components/typing-test";
import { Leaderboard } from "@/components/leaderboard";
import { ThemeSelector } from "@/components/theme-selector";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [key, setKey] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState("all");

  const { data: textSample, isLoading, error } = useQuery({
    queryKey: ["/api/text-samples/random", selectedTheme === "all" ? undefined : selectedTheme, key],
  });

  const handleTestComplete = () => {
    setKey((prev) => prev + 1);
  };

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load text sample</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Test Your Typing Speed
        </h1>
        <p className="text-muted-foreground mt-2">
          Challenge yourself and improve your typing skills
        </p>
        <div className="mt-4">
          <ThemeSelector value={selectedTheme} onValueChange={setSelectedTheme} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TypingTest textSample={textSample} onComplete={handleTestComplete} />
        </div>
        <div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}