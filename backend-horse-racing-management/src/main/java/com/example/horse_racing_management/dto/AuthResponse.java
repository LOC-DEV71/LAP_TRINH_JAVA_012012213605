package com.example.horse_racing_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserInfo user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String username;
        private String role;
    }
}
