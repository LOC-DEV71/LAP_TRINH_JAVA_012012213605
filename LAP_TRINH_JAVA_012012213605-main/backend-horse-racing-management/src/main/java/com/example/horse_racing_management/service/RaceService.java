package com.example.horse_racing_management.service;

import java.util.List;

import com.example.horse_racing_management.dto.RaceDTO;

public interface RaceService {
    List<RaceDTO> getAllRaces();

    List<RaceDTO> getRacesByTournamentId(String tournamentId);

    RaceDTO getRaceById(String id);

    RaceDTO createRace(RaceDTO raceDTO);

    RaceDTO updateRace(String id, RaceDTO raceDTO);

    void deleteRace(String id);
}