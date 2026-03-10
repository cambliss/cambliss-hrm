import axiosInstance from "../services/axiosInstance";

export const submitLeave = (leave) =>
  axiosInstance.post("/api/hrm/leaves/submit", leave);

export const getLeavesByEmployee = (employeeId) =>
  axiosInstance.get(`/api/hrm/leaves/employee/${employeeId}`);

export const approveLeave = (leaveId) =>
  axiosInstance.put(`/api/hrm/leaves/${leaveId}/approve`);

export const rejectLeave = (leaveId) =>
  axiosInstance.put(`/api/hrm/leaves/${leaveId}/reject`);

export const getLeaveBalance = (employeeId) =>
  axiosInstance.get(`/api/hrm/leaves/balance/${employeeId}`);
