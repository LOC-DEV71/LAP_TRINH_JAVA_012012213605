package com.example.horse_racing_management.controller;

import com.example.horse_racing_management.dto.AuthResponse;
import com.example.horse_racing_management.dto.LoginRequest;
import com.example.horse_racing_management.dto.RegisterRequest;
import com.example.horse_racing_management.entity.User;
import com.example.horse_racing_management.entity.enums.Role;
import com.example.horse_racing_management.repository.UserRepository;
import com.example.horse_racing_management.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateJwtToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow();
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getUsername(),
                "ROLE_" + user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(jwt, "Bearer", userInfo));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.SPECTATOR);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}