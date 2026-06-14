package com.example.horse_racing_management.controller;

import com.example.horse_racing_management.dto.JockeyDTO;
import com.example.horse_racing_management.service.JockeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jockeys")
public class JockeyController {

    @Autowired
    private JockeyService jockeyService;

    @GetMapping
    public ResponseEntity<List<JockeyDTO>> getAll() {
        return ResponseEntity.ok(jockeyService.getAllJockeys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JockeyDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(jockeyService.getJockeyById(id));
    }

    @PostMapping
    public ResponseEntity<JockeyDTO> create(@RequestBody JockeyDTO jockeyDTO) {
        return new ResponseEntity<>(jockeyService.createJockey(jockeyDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JockeyDTO> update(@PathVariable String id, @RequestBody JockeyDTO jockeyDTO) {
        return ResponseEntity.ok(jockeyService.updateJockey(id, jockeyDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        jockeyService.deleteJockey(id);
        return ResponseEntity.noContent().build();
    }
}