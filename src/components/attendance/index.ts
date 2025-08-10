// Modern Attendance System Components
export { default as ModernAddAttendanceModal } from "./ModernAddAttendanceModal";
export { default as ModernStudentAttendanceCard } from "./ModernStudentAttendanceCard";
export { default as ModernStudentAttendanceListItem } from "./ModernStudentAttendanceListItem";
export { default as AttendanceEditModal } from "./AttendanceEditModal";
export { default as CompactAttendanceChart } from "./CompactAttendanceChart";
export { default as BulkAttendanceActions } from "./BulkAttendanceActions";

// Legacy Components (for backward compatibility)
export { default as AddAttendanceModal } from "./AddAttendanceModal";
export { default as AttendanceChart } from "./AttendanceChart";
export { default as StudentAttendanceDetailsModal } from "./StudentAttendanceDetailsModal";

// Types and interfaces
export interface ModernStudent {
  id: number;
  name: string;
  full_name: string;
  admission_number: string;
  profile_image?: string;
  attachment?: any;
  attachments?: any[];
  student_attachment_list?: any[];
  grade: string;
  class: string;
  house?: string;
  attendance: "present" | "absent" | "late";
  grade_level_id?: number;
  grade_level?: any;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  total: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}
