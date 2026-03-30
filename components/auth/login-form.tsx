"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Icons } from "./auth-form";

export default function LoginForm({ returnUrl }: { returnUrl: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Implement Google sign-in logic here
    try {
      signIn("google", { callbackUrl: returnUrl });
    } catch (error) {
      console.error("Google sign-in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGithubSignIn = async () => {
  //   setIsLoading(true);
  //   // Implement GitHub sign-in logic here
  //   try {
  //     signIn("github", { callbackUrl: returnUrl });
  //   } catch (error) {
  //     console.error("GitHub sign-in failed", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="grid  gap-3">
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        type="button"
        variant="outline"
      >
        <Icons.google />
        <span>Google</span>
      </Button>
      {/* <Button
        onClick={handleGithubSignIn}
        disabled={isLoading}
        type="button"
        variant="outline"
      >
        <Icons.gitHub />
        <span>Github</span>
      </Button> */}
    </div>
  );
}
