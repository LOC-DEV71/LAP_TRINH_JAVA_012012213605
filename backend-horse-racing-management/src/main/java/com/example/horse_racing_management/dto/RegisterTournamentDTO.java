package com.example.horse_racing_management.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterTournamentDTO {
    // Đồng bộ kiểu String theo database MongoDB
    private String tournamentId;
    private String horseId;
    private String jockeyId;// ID của ngựa (cũng là String)
}