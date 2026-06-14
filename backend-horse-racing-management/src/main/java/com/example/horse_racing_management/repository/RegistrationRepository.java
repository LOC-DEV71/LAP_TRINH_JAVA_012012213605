package com.example.horse_racing_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JockeyScheduleDTO {
    private String registrationId;
    private String tournamentId;
    private String tournamentName;
    private String tournamentStatus;
    private String horseId;
    private String horseName;
    private String status;        // trạng thái đăng ký (PENDING, CONFIRMED...)
    private String startDate;
    private String endDate;
}