export interface AdminProfile {
  name: string;
  email: string;
  role: "Super Admin";
  avatar: string;
  bio: string;
}

export interface AdminPreferences {
  defaultView: "grid" | "table";
  itemsPerPage: 10 | 20 | 50;
  showToasts: {
    onAdd: boolean;
    onEdit: boolean;
    onDelete: boolean;
  };
}

export interface ActivityLog {
  id: string;
  action:
    | "ADD_PRODUCT"
    | "EDIT_PRODUCT"
    | "DELETE_PRODUCT"
    | "LOGIN"
    | "LOGOUT";
  label: string;
  productId?: number;
  productName?: string;
  stockCount?: number;
  timestamp: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  profile: AdminProfile;
  preferences: AdminPreferences;
  activityLog: ActivityLog[];
}
