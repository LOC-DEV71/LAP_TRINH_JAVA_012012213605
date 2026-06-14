package com.example.horse_racing_management.repository;

import com.example.horse_racing_management.entity.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RegistrationRepository extends MongoRepository<Registration, String> {

    // Hàm tự động kiểm tra xem ngựa đã đăng ký giải này chưa (Trả về true/false)
<<<<<<< HEAD
    boolean existsByTournamentIdAndHorseId(String tournamentId, String horseId);
    // Thêm method mới để tìm danh sách đăng ký theo horseId
    List<Registration> findByHorseId(String horseId);

}
=======
    boolean existsByRaceIdAndHorseId(String raceId, String horseId);
}
>>>>>>> 6bf9edf13c7adb8f1bd0c27fe0fa6942dac769b3
