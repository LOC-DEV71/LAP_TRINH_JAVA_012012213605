package com.example.horse_racing_management.controller;

import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.entity.Race;
import com.example.horse_racing_management.entity.User;
import com.example.horse_racing_management.repository.RaceRepository;
import com.example.horse_racing_management.repository.UserRepository;
// import com.example.horse_racing_management.repository.RegistrationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/management")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminApprovalController {
    // @Autowired
    // private RegistrationRepository registrationRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private UserRepository userRepository;

    // ==========================================
    // 1. API DUYỆT ĐƠN ĐĂNG KÝ
    // ==========================================

    @GetMapping("/registrations/pending")
    public ResponseEntity<?> getPendingRegistrations() {
        // Lấy tất cả đơn có trạng thái PENDING
        // List<Registration> pendingList = registrationRepository.findAll().stream()
        //        .filter(reg -> "PENDING".equalsIgnoreCase(reg.getStatus()))
        //        .collect(Collectors.toList());
        // return ResponseEntity.ok(pendingList);
        
        // Tạm thời trả về rỗng nếu chưa mở comment phần Repository ở trên
        return ResponseEntity.ok(List.of()); 
    }

    @PutMapping("/registrations/{id}/approve")
    public ResponseEntity<?> approveRegistration(@PathVariable String id) {
        try {
            // Optional<Registration> opt = registrationRepository.findById(id);
            // if (opt.isPresent()) {
            //     Registration reg = opt.get();
            //     reg.setStatus("APPROVED");
            //     registrationRepository.save(reg);
            //     return ResponseEntity.ok(Map.of("message", "Đã duyệt đơn đăng ký thành công!"));
            // }
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy đơn đăng ký!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PutMapping("/registrations/{id}/reject")
    public ResponseEntity<?> rejectRegistration(@PathVariable String id) {
        try {
            // Optional<Registration> opt = registrationRepository.findById(id);
            // if (opt.isPresent()) {
            //     Registration reg = opt.get();
            //     reg.setStatus("REJECTED");
            //     registrationRepository.save(reg);
            //     return ResponseEntity.ok(Map.of("message", "Đã từ chối đơn đăng ký!"));
            // }
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy đơn đăng ký!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    // ==========================================
    // 2. API PHÂN CÔNG TRỌNG TÀI
    // ==========================================

    @GetMapping("/referees")
    public ResponseEntity<?> getAllReferees() {
        // Lọc user có role là REFEREE
        List<User> referees = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "ROLE_REFEREE".equals(u.getRole().getKey()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(referees);
    }

    @PutMapping("/races/{raceId}/assign-referee/{refereeId}")
    public ResponseEntity<?> assignRefereeToRace(
            @PathVariable String raceId, 
            @PathVariable String refereeId) {
        try {
            Optional<Race> raceOpt = raceRepository.findById(raceId);
            Optional<User> refOpt = userRepository.findById(refereeId);

            if (raceOpt.isPresent() && refOpt.isPresent()) {
                Race race = raceOpt.get();
                User referee = refOpt.get();
                
                // Cập nhật ID trọng tài vào chặng đua
                // race.setRefereeId(referee.getId()); 
                // raceRepository.save(race);

                return ResponseEntity.ok(Map.of("message", "Đã phân công trọng tài " + referee.getFullName() + " thành công!"));
            }
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy chặng đua hoặc trọng tài!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
}