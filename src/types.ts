export enum ShiftType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  STAFF = 'STAFF',
  CUSTOM = 'CUSTOM'
}

export type Permission = 
  | 'can_view_dashboard'
  | 'can_view_schedule'
  | 'can_manage_schedule'
  | 'can_view_reports'
  | 'can_manage_reports'
  | 'can_view_employees'
  | 'can_manage_employees'
  | 'can_view_ambulances'
  | 'can_manage_ambulances'
  | 'can_view_hospitals'
  | 'can_manage_hospitals'
  | 'can_view_users'
  | 'can_manage_users'
  | 'can_manage_roles';

export interface CustomRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Employee {
  id: string;
  nameAr: string;
  nameEn: string;
  position: string;
  allowedShifts: ShiftType[];
  classificationCard?: {
    number: string;
    expiryDate: string;
  };
  notes?: string;
}

export interface ScheduleEntry {
  date: string;
  shift: ShiftType;
  employeeId: string;
}

export interface Ambulance {
  id: string;
  plateNumber: string;
  model: string;
  status: VehicleStatus;
  issues: string[];
}

export interface AppUser {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  customRoleId?: string;
  isActive: boolean;
}

export interface Report {
  id: string;
  reportNumber: string;
  hospitalName: string;
  date: string;
  time: string;
  status: 'completed' | 'pending';
  notes?: string;
  ambulanceId?: string;
  employeeId?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  lastLeaveStartDate?: string;
  lastLeaveDuration?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const HOSPITALS = [
  'مستشفى الملك فهد',
  'مستشفى الملك فيصل',
  'مستشفى الملك خالد',
  'مستشفى القوات المسلحة',
  'مستشفى الحرس الوطني'
];
