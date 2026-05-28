package hrms.hrms_backend.dto;

import hrms.hrms_backend.entities.enums.WorkLogStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLogResponseDto {

    private Long id;

    private Long employeeId;

    private String employeeName;

    private LocalDateTime loginTime;

    private LocalDateTime logoutTime;

    private Long totalMinutes;

    private WorkLogStatus status;

    private String workSummary;
}
