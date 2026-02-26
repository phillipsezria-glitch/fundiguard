"use client";

import { SignIn } from "@clerk/nextjs";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-green-600 hover:bg-green-700",
                card: "shadow-lg",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
