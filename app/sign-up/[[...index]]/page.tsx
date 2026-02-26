"use client";

import { SignUp } from "@clerk/nextjs";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join FundiGuard</h1>
            <p className="text-gray-600">Create your account and find verified fundis today</p>
          </div>
          
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-green-600 hover:bg-green-700",
                card: "shadow-lg",
              },
            }}
            redirectUrl="/complete-profile"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
