"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = createClient();

  const handleSignUp = async () => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up:", error);
      return;
    }

    if (user) {
      // Create a new company
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert([{ name: companyName }])
        .select()
        .single();

      if (companyError) {
        console.error("Error creating company:", companyError);
        return;
      }

      if (company) {
        // Update the user's role and company_id
        const { error: userError } = await supabase
          .from("users")
          .update({ role: "owner", company_id: company.id })
          .eq("id", user.id);

        if (userError) {
          console.error("Error updating user:", userError);
        }
      }
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignUp ? "Sign Up" : "Login"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Create a new account and company."
              : "Enter your email below to login to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                type="text"
                placeholder="Acme Inc."
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="w-full"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}