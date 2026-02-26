"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";

export default function CompleteProfilePage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<"client" | "pro">("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/auth");
    }

    // Check if role already set in metadata
    if (user?.unsafeMetadata?.role) {
      setRole(user.unsafeMetadata.role as "client" | "pro");
    }
  }, [isLoaded, user, router]);

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate phone number first
      if (!user?.phoneNumbers?.[0]?.phoneNumber) {
        setError("Phone number is required. Please add it to your Clerk profile.");
        setLoading(false);
        return;
      }

      // Update Clerk user metadata with role
      if (user && role !== user.unsafeMetadata?.role) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            role: role,
          },
        });
      }

      // Get Clerk token
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication failed. Please try signing in again.");
      }

      // Sync with FundiGuard backend (Supabase)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/sync-clerk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: role,
            phone_number: user?.phoneNumbers?.[0]?.phoneNumber,
            full_name: user?.fullName,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user profile in database");
      }

      const result = await response.json();
      console.log("Profile sync successful:", result);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Profile completion error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-6">Choose your role on FundiGuard</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Choose Your Role:</label>
            <div className="space-y-3">
              <button
                onClick={() => setRole("client")}
                disabled={loading}
                className={`w-full py-4 px-4 rounded-lg border-2 transition font-semibold text-left flex items-center gap-4 ${
                  role === "client"
                    ? "border-green-600 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50"
                }`}
              >
                <div className="text-2xl">👤</div>
                <div>
                  <div className="font-bold">I want to hire fundis</div>
                  <div className="text-sm font-normal opacity-75">Post jobs and hire verified professionals</div>
                </div>
              </button>
              <button
                onClick={() => setRole("pro")}
                disabled={loading}
                className={`w-full py-4 px-4 rounded-lg border-2 transition font-semibold text-left flex items-center gap-4 ${
                  role === "pro"
                    ? "border-green-600 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50"
                }`}
              >
                <div className="text-2xl">🔧</div>
                <div>
                  <div className="font-bold">I'm a fundi offering services</div>
                  <div className="text-sm font-normal opacity-75">Browse jobs and earn money</div>
                </div>
              </button>
            </div>
          </div>

          {/* User Info Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm">
            <p className="font-semibold text-blue-900 mb-3">Your Information</p>
            <div className="space-y-2 text-blue-900">
              <p>
                <span className="font-semibold">Name:</span> {user.fullName || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.emailAddresses?.[0]?.emailAddress || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {user.phoneNumbers?.[0]?.phoneNumber || <span className="text-red-600">Not verified</span>}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleCompleteProfile}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Setting up your profile..." : "Continue to Dashboard"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
