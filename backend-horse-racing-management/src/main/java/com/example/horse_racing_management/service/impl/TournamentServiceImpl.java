package com.example.horse_racing_management.service.impl;

import com.example.horse_racing_management.dto.TournamentDTO;
import com.example.horse_racing_management.entity.Tournament;
import com.example.horse_racing_management.repository.RaceRepository;
import com.example.horse_racing_management.repository.TournamentRepository;
import com.example.horse_racing_management.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TournamentServiceImpl implements TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Override
    public List<TournamentDTO> getAllTournaments() {
        return tournamentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TournamentDTO getTournamentById(String id) {
        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giải đấu với id: " + id));

        return convertToDTO(tournament);
    }

    @Override
    public TournamentDTO createTournament(TournamentDTO tournamentDTO) {
        validateTournament(tournamentDTO);

        Tournament tournament = convertToEntity(tournamentDTO);
        Tournament savedTournament = tournamentRepository.save(tournament);

        return convertToDTO(savedTournament);
    }

    @Override
    public TournamentDTO updateTournament(String id, TournamentDTO tournamentDTO) {
        validateTournament(tournamentDTO);

        Tournament existingTournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giải đấu với id: " + id));

        existingTournament.setName(tournamentDTO.getName());
        existingTournament.setDescription(tournamentDTO.getDescription());
        existingTournament.setStartDate(tournamentDTO.getStartDate());
        existingTournament.setEndDate(tournamentDTO.getEndDate());
        existingTournament.setStatus(tournamentDTO.getStatus());

        Tournament updatedTournament = tournamentRepository.save(existingTournament);

        return convertToDTO(updatedTournament);
    }

    @Override
    public void deleteTournament(String id) {
        if (!tournamentRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy giải đấu với id: " + id);
        }

        if (raceRepository.existsByTournamentId(id)) {
            throw new RuntimeException("Không thể xóa giải đấu vì đang có cuộc đua/lịch thi đấu thuộc giải này.");
        }

        tournamentRepository.deleteById(id);
    }

    private void validateTournament(TournamentDTO tournamentDTO) {
        if (tournamentDTO.getName() == null || tournamentDTO.getName().isBlank()) {
            throw new RuntimeException("Tên giải đấu không được để trống.");
        }

        if (tournamentDTO.getStartDate() == null) {
            throw new RuntimeException("Ngày bắt đầu không được để trống.");
        }

        if (tournamentDTO.getEndDate() == null) {
            throw new RuntimeException("Ngày kết thúc không được để trống.");
        }

        if (tournamentDTO.getStartDate().after(tournamentDTO.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu không được sau ngày kết thúc.");
        }

        if (tournamentDTO.getStatus() == null) {
            throw new RuntimeException("Trạng thái giải đấu không được để trống.");
        }
    }

    private TournamentDTO convertToDTO(Tournament tournament) {
        return new TournamentDTO(
                tournament.getId(),
                tournament.getName(),
                tournament.getDescription(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getStatus()
        );
    }

    private Tournament convertToEntity(TournamentDTO tournamentDTO) {
        Tournament tournament = new Tournament();
        tournament.setId(tournamentDTO.getId());
        tournament.setName(tournamentDTO.getName());
        tournament.setDescription(tournamentDTO.getDescription());
        tournament.setStartDate(tournamentDTO.getStartDate());
        tournament.setEndDate(tournamentDTO.getEndDate());
        tournament.setStatus(tournamentDTO.getStatus());

        return tournament;
    }
}