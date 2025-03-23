export enum UserRole {
  Employee = 'employee',
  Manager = 'manager'
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export type LeaveType = 'Parental' | 'Sick' | 'Paid' | 'Casual' | 'Earned';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Leave {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  isActive: boolean;
}
