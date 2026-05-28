package hrms.hrms_backend.entities.concretes;

import hrms.hrms_backend.entities.enums.WorkLogStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private HrmEmployee employee;

    private LocalDateTime loginTime;

    private LocalDateTime logoutTime;

    private Long totalMinutes;

    @Enumerated(EnumType.STRING)
    private WorkLogStatus status;

    private LocalDateTime createdAt;

    @Column(length = 2000)
    private String workSummary;
}
