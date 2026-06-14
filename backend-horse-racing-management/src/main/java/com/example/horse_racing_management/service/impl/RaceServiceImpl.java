package com.example.horse_racing_management.service.impl;

import com.example.horse_racing_management.dto.RaceDTO;
import com.example.horse_racing_management.entity.Race;
import com.example.horse_racing_management.entity.Tournament;
import com.example.horse_racing_management.repository.RaceRepository;
import com.example.horse_racing_management.repository.TournamentRepository;
import com.example.horse_racing_management.service.RaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RaceServiceImpl implements RaceService {

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Override
    public List<RaceDTO> getAllRaces() {
        return raceRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RaceDTO> getRacesByTournamentId(String tournamentId) {
        if (!tournamentRepository.existsById(tournamentId)) {
            throw new RuntimeException("Không tìm thấy giải đấu với id: " + tournamentId);
        }

        return raceRepository.findByTournamentIdOrderByStartTimeAsc(tournamentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RaceDTO getRaceById(String id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc đua với id: " + id));

        return convertToDTO(race);
    }

    @Override
    public RaceDTO createRace(RaceDTO raceDTO) {
        validateRace(raceDTO);

        Race race = convertToEntity(raceDTO);
        Race savedRace = raceRepository.save(race);

        return convertToDTO(savedRace);
    }

    @Override
    public RaceDTO updateRace(String id, RaceDTO raceDTO) {
        validateRace(raceDTO);

        Race existingRace = raceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc đua với id: " + id));

        existingRace.setTournamentId(raceDTO.getTournamentId());
        existingRace.setName(raceDTO.getName());
        existingRace.setStartTime(raceDTO.getStartTime());
        existingRace.setDistance(raceDTO.getDistance());
        existingRace.setStatus(raceDTO.getStatus());

        Race updatedRace = raceRepository.save(existingRace);

        return convertToDTO(updatedRace);
    }

    @Override
    public void deleteRace(String id) {
        if (!raceRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy cuộc đua với id: " + id);
        }

        raceRepository.deleteById(id);
    }

    private void validateRace(RaceDTO raceDTO) {
        if (raceDTO.getTournamentId() == null || raceDTO.getTournamentId().isBlank()) {
            throw new RuntimeException("Vui lòng chọn giải đấu cho cuộc đua.");
        }

        if (!tournamentRepository.existsById(raceDTO.getTournamentId())) {
            throw new RuntimeException("Không tìm thấy giải đấu với id: " + raceDTO.getTournamentId());
        }

        if (raceDTO.getName() == null || raceDTO.getName().isBlank()) {
            throw new RuntimeException("Tên cuộc đua không được để trống.");
        }

        if (raceDTO.getStartTime() == null) {
            throw new RuntimeException("Thời gian bắt đầu không được để trống.");
        }

        if (raceDTO.getDistance() == null || raceDTO.getDistance() <= 0) {
            throw new RuntimeException("Quãng đường cuộc đua phải lớn hơn 0.");
        }

        if (raceDTO.getStatus() == null) {
            throw new RuntimeException("Trạng thái cuộc đua không được để trống.");
        }
    }

    private RaceDTO convertToDTO(Race race) {
        String tournamentName = null;

        if (race.getTournamentId() != null) {
            tournamentName = tournamentRepository.findById(race.getTournamentId())
                    .map(Tournament::getName)
                    .orElse(null);
        }

        return new RaceDTO(
                race.getId(),
                race.getTournamentId(),
                tournamentName,
                race.getName(),
                race.getStartTime(),
                race.getDistance(),
                race.getStatus()
        );
    }

    private Race convertToEntity(RaceDTO raceDTO) {
        Race race = new Race();
        race.setId(raceDTO.getId());
        race.setTournamentId(raceDTO.getTournamentId());
        race.setName(raceDTO.getName());
        race.setStartTime(raceDTO.getStartTime());
        race.setDistance(raceDTO.getDistance());
        race.setStatus(raceDTO.getStatus());

        return race;
    }
}