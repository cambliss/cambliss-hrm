package hrms.hrms_backend.business.abstracts;

import hrms.hrms_backend.dto.WorkLogResponseDto;

import java.util.List;

public interface WorkLogService {

    WorkLogResponseDto punchIn(Long employeeId);

    WorkLogResponseDto punchOut(Long employeeId, String workSummary);

    List<WorkLogResponseDto> getWorkLogsByEmployee(Long employeeId);
}
