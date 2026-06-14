package com.example.horse_racing_management.service.impl;

import com.example.horse_racing_management.dto.JockeyDTO;
import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.entity.Jockey;
import com.example.horse_racing_management.repository.RegistrationRepository;
import com.example.horse_racing_management.repository.JockeyRepository;
import com.example.horse_racing_management.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private JockeyRepository jockeyRepository;

    @Override
    public List<JockeyDTO> getJockeysByHorseId(String horseId) {
        List<Registration> registrations = registrationRepository.findByHorseId(horseId);
        List<String> jockeyIds = registrations.stream()
                .map(Registration::getJockeyId)
                .filter(id -> id != null && !id.isEmpty())
                .distinct()
                .collect(Collectors.toList());
        return jockeyRepository.findAllById(jockeyIds).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void assignJockeyToRegistration(String registrationId, String jockeyId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        jockeyRepository.findById(jockeyId)
                .orElseThrow(() -> new RuntimeException("Jockey not found"));
        registration.setJockeyId(jockeyId);
        registrationRepository.save(registration);
    }

    private JockeyDTO convertToDTO(Jockey jockey) {
        return new JockeyDTO(jockey.getId(), jockey.getName(), jockey.getLicenseNumber(),
                jockey.getExperienceYears(), jockey.getRating(), jockey.getUserId());
    }
}