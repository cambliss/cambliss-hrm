import { createContext, useContext, useState } from "react";
import { ROLES } from "../config/roles";

const AuthContext = createContext();

//Mock roles
const MOCK_ROLE = ROLES.HR_ADMIN;
// Options:
// ROLES.EMPLOYEE
// ROLES.MANAGER
// ROLES.HR_ADMIN
// ROLES.SUPER_ADMIN

const mockUsers = {
  [ROLES.EMPLOYEE]: {
    id: 3,                  // user id
    name: "Employee One",
    role: ROLES.EMPLOYEE,
    employeeId: 5,          // employee record id
  },

  [ROLES.MANAGER]: {
    id: 10,
    name: "Manager One",
    role: ROLES.MANAGER,
    employeeId: 10,
    teamEmployeeIds: [3, 4, 5],
  },

  [ROLES.HR_ADMIN]: {
    id: 1,
    name: "HR Admin",
    role: ROLES.HR_ADMIN,
  },

  [ROLES.SUPER_ADMIN]: {
    id: 0,
    name: "Super Admin",
    role: ROLES.SUPER_ADMIN,
  },
};

export const AuthProvider = ({ children }) => {
  const [user] = useState(mockUsers[MOCK_ROLE]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
