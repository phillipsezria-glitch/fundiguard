import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

/**
 * Hook to protect routes that require authentication
 * Redirects to /auth if not signed in
 * Returns user and auth info
 */
export function useAuthProtected() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth");
    }
  }, [isLoaded, isSignedIn, router]);

  return { isSignedIn, isLoaded, user };
}

/**
 * Hook to get user's role from Clerk metadata
 */
export function useUserRole() {
  const { user } = useUser();
  return (user?.unsafeMetadata?.role as "client" | "pro") || "client";
}

/**
 * Hook to check if user is a professional
 */
export function useIsProfessional() {
  const role = useUserRole();
  return role === "pro";
}

/**
 * Hook to check if user is a client
 */
export function useIsClient() {
  const role = useUserRole();
  return role === "client";
}
