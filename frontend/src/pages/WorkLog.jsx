import EmployeeWorkLogDashboard
    from "../components/EmployeeWorkLogDashboard";

import WorkLogManagement
    from "../components/WorkLogManagement";

import { useAuth }
    from "../context/AuthContext";

import { ROLES }
    from "../config/roles";

const WorkLog = () => {

    const { user } = useAuth();

    const isEmployee =
        user.role === ROLES.EMPLOYEE;

    return isEmployee
        ? <EmployeeWorkLogDashboard />
        : <WorkLogManagement />;
};

export default WorkLog;
