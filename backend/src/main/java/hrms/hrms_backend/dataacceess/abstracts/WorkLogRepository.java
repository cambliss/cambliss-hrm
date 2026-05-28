package hrms.hrms_backend.dataacceess.abstracts;

import hrms.hrms_backend.entities.concretes.HrmEmployee;
import hrms.hrms_backend.entities.concretes.WorkLog;
import hrms.hrms_backend.entities.enums.WorkLogStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {

    Optional<WorkLog> findByEmployeeAndStatus(
            HrmEmployee employee,
            WorkLogStatus status);

    List<WorkLog> findByEmployeeId(Long employeeId);

    List<WorkLog> findByLoginTimeBetween(
            LocalDateTime start,
            LocalDateTime end);
}
