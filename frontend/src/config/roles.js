export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HR_ADMIN: "HR_ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    employees: true,
    attendance: true,
    leaves: true,
    reports: true,
    fullAccess: true,
  },
  HR_ADMIN: {
    employees: true,
    attendance: true,
    leaves: true,
    reports: true,
  },
  MANAGER: {
    employees: false,
    attendance: true,
    leaves: true,
    teamOnly: true,
  },
  EMPLOYEE: {
    employees: false,
    attendance: true,
    leaves: true,
    selfOnly: true,
  },
};
