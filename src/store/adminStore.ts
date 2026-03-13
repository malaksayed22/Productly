import { create } from "zustand";
import type {
  AdminProfile,
  AdminPreferences,
  ActivityLog,
} from "../types/admin";

const DEFAULT_PASSWORD = "admin123";

const readPassword = (): string => {
  try {
    return localStorage.getItem("admin_password") ?? DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
};

const readBool = (key: string): boolean => {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readPreferences = (): AdminPreferences => {
  const defaultPrefs: AdminPreferences = {
    defaultView: "grid",
    itemsPerPage: 10,
    showToasts: { onAdd: true, onEdit: true, onDelete: true },
  };
  return readJSON<AdminPreferences>("admin_prefs", defaultPrefs);
};

const readProfile = (): AdminProfile => {
  const defaultProfile: AdminProfile = {
    name: "Admin User",
    email: "admin@productly.com",
    role: "Super Admin",
    avatar: "",
    bio: "Managing the Productly dashboard.",
  };
  return readJSON<AdminProfile>("admin_profile", defaultProfile);
};

interface AdminStore {
  isAuthenticated: boolean;
  profile: AdminProfile;
  preferences: AdminPreferences;
  activityLog: ActivityLog[];

  login: (email: string, password: string) => boolean;
  verifyPassword: (password: string) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<AdminProfile>) => void;
  updatePreferences: (data: Partial<AdminPreferences>) => void;
  logActivity: (entry: Omit<ActivityLog, "id" | "timestamp">) => void;
  clearActivityLog: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: readBool("admin_auth"),

  profile: readProfile(),

  preferences: readPreferences(),

  activityLog: readJSON<ActivityLog[]>("admin_activity", []),

  // ── Actions ────────────────────────────────────────────

  login(email, password) {
    const storedEmail = get().profile.email;
    if (email.trim().toLowerCase() !== storedEmail.trim().toLowerCase())
      return false;
    if (password !== readPassword()) return false;
    localStorage.setItem("admin_auth", "true");
    set({ isAuthenticated: true });
    get().logActivity({ action: "LOGIN", label: "Logged in" });
    return true;
  },

  verifyPassword(password) {
    return password === readPassword();
  },

  changePassword(currentPassword, newPassword) {
    if (currentPassword !== readPassword()) return false;
    try {
      localStorage.setItem("admin_password", newPassword);
    } catch {
      // storage unavailable
    }
    return true;
  },

  logout() {
    localStorage.removeItem("admin_auth");
    set({ isAuthenticated: false });
    get().logActivity({ action: "LOGOUT", label: "Logged out" });
  },

  updateProfile(data) {
    set((state) => {
      const next: AdminProfile = { ...state.profile, ...data };
      try {
        localStorage.setItem("admin_profile", JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return { profile: next };
    });
  },

  updatePreferences(data) {
    set((state) => {
      const next: AdminPreferences = { ...state.preferences, ...data };
      try {
        localStorage.setItem("admin_prefs", JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return { preferences: next };
    });
  },

  logActivity(entry) {
    const full: ActivityLog = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    set((state) => {
      const next = [full, ...state.activityLog].slice(0, 50);
      try {
        localStorage.setItem("admin_activity", JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return { activityLog: next };
    });
  },

  clearActivityLog() {
    localStorage.removeItem("admin_activity");
    set({ activityLog: [] });
  },
}));
