package com.example.horse_racing_management.controller;

import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/registrations")
@CrossOrigin("*")
public class TournamentRegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationRepository.findAll());
    }

    // Admin duyệt đơn đăng ký tham gia giải đấu
    @PutMapping("/{id}/approve")
    public ResponseEntity<Registration> approveRegistration(@PathVariable String id) {
        return registrationRepository.findById(id).map(reg -> {
            reg.setStatus("APPROVED");
            return ResponseEntity.ok(registrationRepository.save(reg));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin từ chối đơn đăng ký
    @PutMapping("/{id}/reject")
    public ResponseEntity<Registration> rejectRegistration(@PathVariable String id) {
        return registrationRepository.findById(id).map(reg -> {
            reg.setStatus("REJECTED");
            return ResponseEntity.ok(registrationRepository.save(reg));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin click phân công trọng tài (refereeId là kiểu String phục vụ MongoDB)
    @PutMapping("/{id}/assign-referee")
    public ResponseEntity<Registration> assignReferee(@PathVariable String id, @RequestParam String refereeId) {
        return registrationRepository.findById(id).map(reg -> {
            reg.setRefereeId(refereeId);
            return ResponseEntity.ok(registrationRepository.save(reg));
        }).orElse(ResponseEntity.notFound().build());
    }
}