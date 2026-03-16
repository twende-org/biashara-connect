import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadUserProfile } from "@/store/authSlice";
import { store } from "@/store";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [authReady, setAuthReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      // If a user exists and profile not loaded, fetch it
      if (fbUser && !store.getState().auth.user && !loadingRef.current) {
        loadingRef.current = true;
        try {
          await dispatch(loadUserProfile(fbUser.uid)).unwrap();
        } catch (error) {
          console.warn("Failed to load user profile:", error);
        }
        loadingRef.current = false;
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Loading screen while Firebase or store user is not ready
  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Inapakia...</p>
        </div>
      </div>
    );
  }

  // Wait for profile to finish loading if Firebase user exists
  if (firebaseUser && !user && loadingRef.current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Inapakia profaili...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated, otherwise fallback
  return user ? <>{children}</> : <>{fallback}</>;
}