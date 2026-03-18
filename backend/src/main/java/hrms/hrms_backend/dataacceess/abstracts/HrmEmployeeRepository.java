package hrms.hrms_backend.dataacceess.abstracts;

import hrms.hrms_backend.entities.concretes.HrmEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HrmEmployeeRepository extends JpaRepository<HrmEmployee, Long> {

    boolean existsByEmail(String email);

    Optional<HrmEmployee> findByEmail(String email);
}
