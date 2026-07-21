import type { Department } from "@/types/staff";

export interface User {
  id: string;
  name: string;
  /** Job title, in Hebrew. */
  role: string;
  department: Department;
  email: string;
  homeLocationId: string;
  /** Two Hebrew letters, for the avatar fallback. */
  initials: string;
}
