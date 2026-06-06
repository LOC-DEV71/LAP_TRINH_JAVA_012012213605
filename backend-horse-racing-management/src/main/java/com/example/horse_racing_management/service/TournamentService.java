package com.example.horse_racing_management.service;

import com.example.horse_racing_management.dto.RegisterTournamentDTO;
import com.example.horse_racing_management.entity.Tournament;
import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.entity.Horse;
import com.example.horse_racing_management.entity.enums.RegistrationStatus;
import com.example.horse_racing_management.entity.enums.TournamentStatus;
import com.example.horse_racing_management.repository.TournamentRepository;
import com.example.horse_racing_management.repository.RegistrationRepository;
import com.example.horse_racing_management.repository.HorseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public Registration registerHorseToTournament(RegisterTournamentDTO dto) {
        // 1. Kiểm tra giải đấu có tồn tại không
        Tournament tournament = tournamentRepository.findById(dto.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin giải đấu!"));

        // 2. Kiểm tra xem giải đấu còn mở đăng ký không (Thay vì CLOSED, check xem có phải đang diễn ra hoặc đã kết thúc không)
        if (tournament.getStatus() == TournamentStatus.ONGOING || tournament.getStatus() == TournamentStatus.COMPLETED) {
            throw new RuntimeException("Giải đấu này đã đóng hoặc đang diễn ra, không thể đăng ký thêm!");
        }

        // 3. Kiểm tra xem con ngựa này có tồn tại trong hệ thống không
        Horse horse = horseRepository.findById(dto.getHorseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin con ngựa này!"));

        // 4. Kiểm tra xem con ngựa này đã đăng ký giải này từ trước chưa
        // Lưu ý: Đổi tên method trong repository thành existsByRaceIdAndHorseId cho khớp Entity
        if (registrationRepository.existsByRaceIdAndHorseId(dto.getTournamentId(), dto.getHorseId())) {
            throw new RuntimeException("Con ngựa này đã được đăng ký tham gia giải đấu này rồi!");
        }

        // 5. Tạo dữ liệu đăng ký mới theo chuẩn lưu trữ MongoDB
        Registration registration = new Registration();
        
        // MongoDB lưu Reference bằng ID (String), không lưu nguyên Object như SQL
        registration.setRaceId(tournament.getId()); 
        registration.setHorseId(horse.getId());
        registration.setRegistrationDate(new Date()); 
        
        // Dùng Enum thay vì String "PENDING"
        registration.setStatus(RegistrationStatus.PENDING); 

        return registrationRepository.save(registration);
    }
}