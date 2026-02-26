"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-green-600 hover:bg-green-700",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
