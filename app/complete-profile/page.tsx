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

      // Create user record in FundiGuard backend
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
        throw new Error(data.error || "Failed to create user profile");
      }

      // Redirect to dashboard or onboarding
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
            <label className="block text-sm font-semibold mb-3">I want to:</label>
            <div className="flex gap-3">
              <button
                onClick={() => setRole("client")}
                disabled={loading}
                className={`flex-1 py-4 px-4 rounded-lg border-2 transition font-semibold ${
                  role === "client"
                    ? "border-green-600 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50"
                }`}
              >
                <div className="text-lg">👤</div>
                <div>Hire Fundis</div>
              </button>
              <button
                onClick={() => setRole("pro")}
                disabled={loading}
                className={`flex-1 py-4 px-4 rounded-lg border-2 transition font-semibold ${
                  role === "pro"
                    ? "border-green-600 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50"
                }`}
              >
                <div className="text-lg">🔧</div>
                <div>Offer Services</div>
              </button>
            </div>
          </div>

          {/* User Info Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-sm">
            <p>
              <span className="font-semibold">Name:</span> {user.fullName || "Not set"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.emailAddresses?.[0]?.emailAddress || "Not set"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {user.phoneNumbers?.[0]?.phoneNumber || "Not set"}
            </p>
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
