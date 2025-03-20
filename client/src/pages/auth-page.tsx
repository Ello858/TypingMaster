import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { InsertUser, insertUserSchema } from "@shared/schema";
import { useState } from "react";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: InsertUser) => {
    if (isRegistering) {
      registerMutation.mutate(data);
    } else {
      loginMutation.mutate(data);
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Typing Speed Test</h1>
            <p className="text-muted-foreground">
              Challenge yourself, track your progress, and compete with others
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                1
              </span>
              <span>Practice typing with various themes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                2
              </span>
              <span>Track your progress over time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                3
              </span>
              <span>Compete on the global leaderboard</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRegistering ? "Create Account" : "Login"}</CardTitle>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="Enter your username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter your password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {isRegistering ? "Register" : "Login"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering
                  ? "Already have an account? Login"
                  : "Need an account? Register"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
