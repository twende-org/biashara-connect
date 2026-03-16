import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile, getUserProfile, getUserRoles } from "@/lib/firestore";
import type { UserProfile, UserRole } from "@/types";

interface AuthState {
  user: UserProfile | null;
  roles: UserRole[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  roles: [],
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
    if (!auth) throw new Error("Firebase haijasanidiwa");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(cred.user.uid, { email, displayName });
    const profile = { id: cred.user.uid, email, displayName } as UserProfile;
    return { user: profile, roles: [] as UserRole[] };
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    if (!auth) throw new Error("Firebase haijasanidiwa");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(cred.user.uid);
    let roles: UserRole[] = [];
    try {
      roles = (await getUserRoles(cred.user.uid)) as UserRole[];
    } catch (e) {
      console.warn("Could not load roles:", e);
    }
    return { user: profile as UserProfile, roles };
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  if (!auth) throw new Error("Firebase haijasanidiwa");
  await signOut(auth);
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (email: string) => {
  if (!auth) throw new Error("Firebase haijasanidiwa");
  await sendPasswordResetEmail(auth, email);
});

export const loadUserProfile = createAsyncThunk("auth/loadProfile", async (uid: string) => {
  const profile = await getUserProfile(uid);
  if (!profile) {
    throw new Error("Profile not found");
  }
  let roles: UserRole[] = [];
  try {
    roles = (await getUserRoles(uid)) as UserRole[];
  } catch (e) {
    console.warn("Could not load roles:", e);
  }
  return { user: profile as UserProfile, roles };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.roles = action.payload.roles; });
    builder.addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Imeshindikana kusajili"; });
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.roles = action.payload.roles; });
    builder.addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Imeshindikana kuingia"; });
    builder.addCase(logoutUser.fulfilled, (state) => { state.user = null; state.roles = []; });
    builder.addCase(loadUserProfile.fulfilled, (state, action) => { state.user = action.payload.user; state.roles = action.payload.roles; state.loading = false; });
    builder.addCase(loadUserProfile.pending, (state) => { state.loading = true; });
    builder.addCase(loadUserProfile.rejected, (state) => { state.loading = false; state.user = null; });
    builder.addCase(resetPassword.rejected, (state, action) => { state.error = action.error.message || "Imeshindikana"; });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
