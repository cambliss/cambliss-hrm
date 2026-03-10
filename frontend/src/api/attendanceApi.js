import axiosInstance from "../services/axiosInstance";

export const markAttendance = (attendance) =>
  axiosInstance.post("/api/hrm/attendance", attendance);

export const getAttendanceByEmployee = (employeeId) =>
  axiosInstance.get(`/api/hrm/attendance/${employeeId}`);

export const updateAttendance = (attendanceId, attendance) =>
  axiosInstance.put(
    `/api/hrm/attendance/${attendanceId}`,
    attendance
  );

/*
  Employee requests correction
  Payload:
  {
    requestedStatus: "PRESENT" | "ABSENT",
    correctionReason: "text"
  }
*/
export const requestCorrection = (attendanceId, payload) =>
  axiosInstance.put(
    `/api/hrm/attendance/${attendanceId}/request-correction`,
    payload
  );

export const approveCorrection = (attendanceId) =>
  axiosInstance.put(
    `/api/hrm/attendance/${attendanceId}/approve`
  );

export const rejectCorrection = (attendanceId) =>
  axiosInstance.put(
    `/api/hrm/attendance/${attendanceId}/reject`
  );
