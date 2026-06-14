package com.example.horse_racing_management.controller;

import com.example.horse_racing_management.entity.Horse;
import com.example.horse_racing_management.repository.HorseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horses")
@CrossOrigin("*") 
public class HorseController {

    @Autowired
    private HorseRepository horseRepository;

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Horse>> getHorsesByOwner(@PathVariable String ownerId) {
        return ResponseEntity.ok(horseRepository.findByOwnerId(ownerId));
    }

    @PostMapping
    public ResponseEntity<Horse> createHorse(@RequestBody Horse horse) {
        return ResponseEntity.ok(horseRepository.save(horse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horse> updateHorse(@PathVariable String id, @RequestBody Horse horseDetails) {
        return horseRepository.findById(id).map(horse -> {
            horse.setName(horseDetails.getName());
            // Cập nhật thêm các trường khác nếu thực tế entity Horse có thêm thuộc tính
            return ResponseEntity.ok(horseRepository.save(horse));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorse(@PathVariable String id) {
        if (horseRepository.existsById(id)) {
            horseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}