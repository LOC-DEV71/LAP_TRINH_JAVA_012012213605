package com.example.horse_racing_management.service;

import com.example.horse_racing_management.dto.JockeyDTO;
import java.util.List;

public interface RegistrationService {
    List<JockeyDTO> getJockeysByHorseId(String horseId);
    void assignJockeyToRegistration(String registrationId, String jockeyId);
    // Thêm method mới
    List<JockeyScheduleDTO> getScheduleByJockeyId(String jockeyId);
}