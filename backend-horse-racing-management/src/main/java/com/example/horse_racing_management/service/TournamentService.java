package com.example.horse_racing_management.service;

import java.util.List;

import com.example.horse_racing_management.dto.TournamentDTO;

public interface TournamentService {
    List<TournamentDTO> getAllTournaments();

    TournamentDTO getTournamentById(String id);

    TournamentDTO createTournament(TournamentDTO tournamentDTO);

    TournamentDTO updateTournament(String id, TournamentDTO tournamentDTO);

    void deleteTournament(String id);
}