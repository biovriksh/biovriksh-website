export type UserRole = "admin" | "student";

export type NoteType = "paid" | "free" | "short" | "chapter";
export type ClassLevel = "Class 11" | "Class 12" | "NEET Special";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Chapter {
  id: string;
  name: string;
  subject: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface PDFNote {
  id: string;
  chapter_id: string | null;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  file_path: string;
  is_free: boolean;
  price: number;
  is_active: boolean;
  is_recent: boolean; // Owner toggle to feature ANY note in Recents section
  note_type: NoteType;
  class_level: ClassLevel;
  page_count: number;
  created_at: string;
  updated_at: string;
  // Joined table data
  chapter?: Chapter | null;
}

export interface Purchase {
  id: string;
  student_id: string;
  pdf_id: string;
  amount_paid: number;
  payment_status: "success" | "failed" | "pending";
  payment_gateway_id: string | null;
  purchased_at: string;
  // Joined relation data
  student?: Profile | null;
  pdf?: PDFNote | null;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activePDFs: number;
  totalStudents: number;
  recentPurchases: Purchase[];
}
