package com.example.horse_racing_management.service.impl;

import com.example.horse_racing_management.dto.JockeyDTO;
import com.example.horse_racing_management.entity.Jockey;
import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.entity.Tournament;
import com.example.horse_racing_management.entity.Horse;
import com.example.horse_racing_management.repository.JockeyRepository;
import com.example.horse_racing_management.repository.RegistrationRepository;
import com.example.horse_racing_management.repository.TournamentRepository;
import com.example.horse_racing_management.repository.HorseRepository;
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

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private HorseRepository horseRepository;

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

    @Override
    public List<JockeyScheduleDTO> getScheduleByJockeyId(String jockeyId) {
        List<Registration> registrations = registrationRepository.findByJockeyId(jockeyId);
        return registrations.stream().map(reg -> {
            JockeyScheduleDTO dto = new JockeyScheduleDTO();
            dto.setRegistrationId(reg.getId());
            dto.setStatus(reg.getStatus().name());

            // Lấy thông tin giải đấu (tournament) từ raceId
            Tournament tournament = tournamentRepository.findById(reg.getRaceId())
                    .orElseThrow(() -> new RuntimeException("Tournament not found for id: " + reg.getRaceId()));
            dto.setTournamentId(tournament.getId());
            dto.setTournamentName(tournament.getName());
            dto.setTournamentStatus(tournament.getStatus().name());
            dto.setStartDate(tournament.getStartDate().toString());
            dto.setEndDate(tournament.getEndDate().toString());

            // Lấy thông tin ngựa
            Horse horse = horseRepository.findById(reg.getHorseId())
                    .orElseThrow(() -> new RuntimeException("Horse not found for id: " + reg.getHorseId()));
            dto.setHorseId(horse.getId());
            dto.setHorseName(horse.getName());

            return dto;
        }).collect(Collectors.toList());
    }

    private JockeyDTO convertToDTO(Jockey jockey) {
        return new JockeyDTO(jockey.getId(), jockey.getName(), jockey.getLicenseNumber(),
                jockey.getExperienceYears(), jockey.getRating(), jockey.getUserId());
    }
}