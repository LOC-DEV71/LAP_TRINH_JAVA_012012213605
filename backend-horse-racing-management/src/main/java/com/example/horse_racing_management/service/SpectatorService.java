package com.example.horse_racing_management.service;

import com.example.horse_racing_management.dto.BetDTO;
import com.example.horse_racing_management.entity.Bet;
import com.example.horse_racing_management.entity.Race;
import com.example.horse_racing_management.entity.enums.BetStatus;
import com.example.horse_racing_management.entity.enums.RaceStatus;
import com.example.horse_racing_management.repository.BetRepository;
import com.example.horse_racing_management.repository.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SpectatorService {

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private RaceRepository raceRepository;

    public BetDTO placeBet(BetDTO betDTO) {
        Optional<Race> optionalRace = raceRepository.findById(betDTO.getRaceId());
        if (optionalRace.isEmpty()) {
            throw new RuntimeException("Race not found");
        }
        
        Race race = optionalRace.get();
        if (race.getStatus() != RaceStatus.SCHEDULED) {
            throw new RuntimeException("Race is not open for betting. Current status: " + race.getStatus());
        }

        Bet bet = new Bet();
        bet.setSpectatorId(betDTO.getSpectatorId());
        bet.setRaceId(betDTO.getRaceId());
        bet.setHorseId(betDTO.getHorseId());
        bet.setAmount(betDTO.getAmount());
        bet.setPredictedPosition(betDTO.getPredictedPosition());
        bet.setStatus(BetStatus.PENDING);
        
        Bet savedBet = betRepository.save(bet);
        
        betDTO.setId(savedBet.getId());
        betDTO.setStatus(savedBet.getStatus());
        
        return betDTO;
    }

    public List<Race> getLiveAndScheduledRaces() {
        return raceRepository.findAll().stream()
                .filter(race -> race.getStatus() == RaceStatus.IN_PROGRESS || race.getStatus() == RaceStatus.SCHEDULED)
                .collect(Collectors.toList());
    }
}
