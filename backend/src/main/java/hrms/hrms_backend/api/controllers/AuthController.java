package hrms.hrms_backend.api.controllers;

import hrms.hrms_backend.dataacceess.abstracts.HrmEmployeeRepository;
import hrms.hrms_backend.dto.ChangePasswordRequest;
import hrms.hrms_backend.dto.LoginRequest;
import hrms.hrms_backend.dto.LoginResponse;
import hrms.hrms_backend.entities.concretes.HrmEmployee;
import hrms.hrms_backend.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    private HrmEmployeeRepository employeeRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        HrmEmployee user = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // TEMP password check (we will secure later)
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getRole().name(), // enum → string
                user.isPasswordChanged(),
                token
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {

        Optional<HrmEmployee> optionalUser = employeeRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        HrmEmployee user = optionalUser.get();

        // check old password
        if (!user.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        // update password
        user.setPassword(request.getNewPassword());
        user.setPasswordChanged(true);

        employeeRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}
