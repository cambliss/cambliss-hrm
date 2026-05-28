package hrms.hrms_backend.api.controllers;

import hrms.hrms_backend.business.abstracts.WorkLogService;
import hrms.hrms_backend.dto.PunchOutRequestDto;
import hrms.hrms_backend.dto.WorkLogResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hrm/worklogs")
public class WorkLogController {

    private final WorkLogService workLogService;

    public WorkLogController(WorkLogService workLogService) {
        this.workLogService = workLogService;
    }

    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','HR_ADMIN','MANAGER','EMPLOYEE')")
    @PostMapping("/punch-in/{employeeId}")
    public ResponseEntity<WorkLogResponseDto> punchIn(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                workLogService.punchIn(employeeId));
    }

    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','HR_ADMIN','MANAGER','EMPLOYEE')")
    @PostMapping("/punch-out/{employeeId}")
    public ResponseEntity<WorkLogResponseDto> punchOut(
            @PathVariable Long employeeId, @RequestBody PunchOutRequestDto request) {

        return ResponseEntity.ok(
                workLogService.punchOut(employeeId, request.getWorkSummary()));
    }

    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','HR_ADMIN','MANAGER','EMPLOYEE')")
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<WorkLogResponseDto>> getEmployeeLogs(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                workLogService.getWorkLogsByEmployee(employeeId));
    }
}
