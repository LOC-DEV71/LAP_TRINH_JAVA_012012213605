package com.example.horse_racing_management.controller;

import com.example.horse_racing_management.dto.JockeyDTO;
import com.example.horse_racing_management.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.horse_racing_management.dto.JockeyScheduleDTO;
import java.util.List;

@RestController
@RequestMapping("/api/v1/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping("/horse/{horseId}/jockeys")
    public ResponseEntity<List<JockeyDTO>> getJockeysByHorse(@PathVariable String horseId) {
        return ResponseEntity.ok(registrationService.getJockeysByHorseId(horseId));
    }

    @PutMapping("/{registrationId}/assign-jockey/{jockeyId}")
    public ResponseEntity<Void> assignJockey(@PathVariable String registrationId, @PathVariable String jockeyId) {
        registrationService.assignJockeyToRegistration(registrationId, jockeyId);
        return ResponseEntity.ok().build();

    }
    // Thêm endpoint mới để lấy lịch trình của jockey
    @GetMapping("/jockey/{jockeyId}/schedule")
    public ResponseEntity<List<JockeyScheduleDTO>> getJockeySchedule(@PathVariable String jockeyId) {
        return ResponseEntity.ok(registrationService.getScheduleByJockeyId(jockeyId));
    }
}