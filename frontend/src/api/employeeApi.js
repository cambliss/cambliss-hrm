import axiosInstance from "../services/axiosInstance";

export const getAllEmployees = () =>
  axiosInstance.get("/api/hrm/employees/get");

export const addEmployee = (employee) =>
  axiosInstance.post("/api/hrm/employees/add", employee);

export const updateEmployee = (id, employee) =>
  axiosInstance.put(`/api/hrm/employees/update/${id}`, employee);

export const getEmployeeById = (id) =>
  axiosInstance.get(`/api/hrm/employees/${id}`);
