package com.example.horse_racing_management.repository;

import com.example.horse_racing_management.entity.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRepository extends MongoRepository<Registration, String> {

    // Hàm tự động kiểm tra xem ngựa đã đăng ký giải này chưa (Trả về true/false)
    boolean existsByTournamentIdAndHorseId(String tournamentId, String horseId);
}