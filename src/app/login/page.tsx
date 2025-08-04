"use client";

import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFoundError, setIsNotFoundError] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignUp = async () => {
    console.log("Attempting to sign up...");
    setIsLoading(true);
    setError(null);
    setIsNotFoundError(false);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      console.error("Sign up error:", error);
      setError(error.message);
    } else {
      console.log("Sign up successful, showing OTP input.", data);
      setShowOtpInput(true);
    }
  };

  const handleOtpVerification = async () => {
    console.log("Attempting to verify OTP...");
    setIsLoading(true);
    setError(null);
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    setIsLoading(false);

    if (error) {
      console.error("OTP verification error:", error);
      setError(error.message);
    } else if (session) {
      console.log("OTP verification successful, redirecting...", session);
      router.push("/create-company");
    }
  };

  const handleLogin = async () => {
    console.log("Attempting to log in...");
    setIsLoading(true);
    setError(null);
    setIsNotFoundError(false);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) {
      console.error("Login error:", error);
      if (error.message === "Invalid login credentials") {
        setError("Account not found. Please sign up.");
        setIsNotFoundError(true);
      } else {
        setError(error.message);
      }
    } else {
      console.log("Login successful, redirecting...", data);
      router.push("/dashboard");
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
              ? "Create a new account."
              : "Enter your email below to login to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isSignUp && !showOtpInput && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
            </>
          )}
          {showOtpInput && (
            <div className="grid gap-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isSignUp && (
            <>
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
            </>
          )}
          <Button
            onClick={
              isSignUp
                ? showOtpInput
                  ? handleOtpVerification
                  : handleSignUp
                : handleLogin
            }
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : isSignUp
              ? showOtpInput
                ? "Verify OTP"
                : "Sign Up"
              : "Sign In"}
          </Button>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setIsNotFoundError(false);
                setShowOtpInput(false);
              }}
              className={`underline cursor-pointer ${
                isNotFoundError && !isSignUp
                  ? "text-blue-500 font-bold animate-pulse"
                  : ""
              }`}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
