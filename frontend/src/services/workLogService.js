import axiosInstance from "../services/axiosInstance";

const BASE_URL = "/api/hrm/worklogs";

export const punchIn = async (employeeId) => {
    return axiosInstance.post(
        `${BASE_URL}/punch-in/${employeeId}`
    );
};

export const punchOut = async (employeeId, workSummary) => {
    return axiosInstance.post(
        `${BASE_URL}/punch-out/${employeeId}`,
        { workSummary }
    );
};

export const getEmployeeLogs = async (employeeId) => {
    return axiosInstance.get(
        `${BASE_URL}/${employeeId}`
    );
};
