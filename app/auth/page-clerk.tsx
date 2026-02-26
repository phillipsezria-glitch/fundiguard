"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AuthPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"client" | "pro">("client");
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Tab Selection */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setTab("signin")}
              className={`pb-4 px-2 font-semibold transition ${
                tab === "signin"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`pb-4 px-2 font-semibold transition ${
                tab === "signup"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Role Selection for Sign Up */}
          {tab === "signup" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">I am a:</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setRole("client")}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition font-semibold ${
                    role === "client"
                      ? "border-green-600 bg-green-50 text-green-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Client
                </button>
                <button
                  onClick={() => setRole("pro")}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition font-semibold ${
                    role === "pro"
                      ? "border-green-600 bg-green-50 text-green-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Professional
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {role === "client"
                  ? "Looking for a fundi? Start as a client."
                  : "Ready to offer services? Sign up as a professional."}
              </p>
            </div>
          )}

          {/* Clerk Sign In */}
          {tab === "signin" && (
            <div className="bg-white rounded-lg">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-green-600 hover:bg-green-700",
                    card: "shadow-none border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  },
                }}
                redirectUrl="/dashboard"
              />
            </div>
          )}

          {/* Clerk Sign Up */}
          {tab === "signup" && (
            <div className="bg-white rounded-lg">
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-green-600 hover:bg-green-700",
                    card: "shadow-none border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  },
                }}
                redirectUrl="/complete-profile"
                unsafeMetadata={{
                  role: role,
                }}
              />
            </div>
          )}

          {/* Support Text */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Having issues? Contact{" "}
            <a href="mailto:support@fundiguard.ke" className="text-green-600 hover:underline">
              support@fundiguard.ke
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
