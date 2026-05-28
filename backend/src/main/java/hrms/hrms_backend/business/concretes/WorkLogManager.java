package hrms.hrms_backend.business.concretes;

import hrms.hrms_backend.api.controllers.exception.EmployeeNotFoundException;
import hrms.hrms_backend.api.controllers.exception.NoActiveWorkSessionException;
import hrms.hrms_backend.api.controllers.exception.WorkLogAlreadyActiveException;
import hrms.hrms_backend.business.abstracts.WorkLogService;
import hrms.hrms_backend.dataacceess.abstracts.HrmEmployeeRepository;
import hrms.hrms_backend.dataacceess.abstracts.WorkLogRepository;
import hrms.hrms_backend.entities.concretes.HrmEmployee;
import hrms.hrms_backend.entities.concretes.WorkLog;
import hrms.hrms_backend.entities.enums.WorkLogStatus;
import hrms.hrms_backend.dto.WorkLogResponseDto;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkLogManager implements WorkLogService {

        private final WorkLogRepository workLogRepository;
        private final HrmEmployeeRepository hrmEmployeeRepository;

        public WorkLogManager(WorkLogRepository workLogRepository,
                        HrmEmployeeRepository hrmEmployeeRepository) {
                this.workLogRepository = workLogRepository;
                this.hrmEmployeeRepository = hrmEmployeeRepository;
        }

        private WorkLogResponseDto mapToDto(WorkLog workLog) {
                return new WorkLogResponseDto(
                                workLog.getId(),
                                workLog.getEmployee().getId(),
                                workLog.getEmployee().getFirstName() + " " +
                                                workLog.getEmployee().getLastName(),
                                workLog.getLoginTime(),
                                workLog.getLogoutTime(),
                                workLog.getTotalMinutes(),
                                workLog.getStatus(),
                                workLog.getWorkSummary());
        }

        @Override
        public WorkLogResponseDto punchIn(Long employeeId) {

                HrmEmployee employee = hrmEmployeeRepository.findById(employeeId)
                                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

                workLogRepository.findByEmployeeAndStatus(
                                employee,
                                WorkLogStatus.ACTIVE)
                                .ifPresent(log -> {
                                        throw new WorkLogAlreadyActiveException("Employee already punched in");
                                });

                WorkLog workLog = new WorkLog();

                workLog.setEmployee(employee);
                workLog.setLoginTime(LocalDateTime.now());
                workLog.setStatus(WorkLogStatus.ACTIVE);
                workLog.setCreatedAt(LocalDateTime.now());

                return mapToDto(workLogRepository.save(workLog));
        }

        @Override
        public WorkLogResponseDto punchOut(Long employeeId, String workSummary) {

                HrmEmployee employee = hrmEmployeeRepository.findById(employeeId)
                                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

                WorkLog workLog = workLogRepository
                                .findByEmployeeAndStatus(
                                                employee,
                                                WorkLogStatus.ACTIVE)
                                .orElseThrow(() -> new NoActiveWorkSessionException("No active session found"));

                LocalDateTime logoutTime = LocalDateTime.now();

                long totalMinutes = Duration.between(
                                workLog.getLoginTime(),
                                logoutTime).toMinutes();

                workLog.setLogoutTime(logoutTime);
                workLog.setTotalMinutes(totalMinutes);
                workLog.setStatus(WorkLogStatus.COMPLETED);
                workLog.setWorkSummary(workSummary);

                return mapToDto(workLogRepository.save(workLog));
        }

        @Override
        public List<WorkLogResponseDto> getWorkLogsByEmployee(Long employeeId) {

                return workLogRepository.findByEmployeeId(employeeId)
                                .stream()
                                .map(this::mapToDto)
                                .toList();
        }
}
