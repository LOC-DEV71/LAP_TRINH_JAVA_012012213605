package com.example.horse_racing_management.service;

import com.example.horse_racing_management.dto.RegisterTournamentDTO;
import com.example.horse_racing_management.entity.Tournament;
import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.entity.Horse;
import com.example.horse_racing_management.repository.TournamentRepository;
import com.example.horse_racing_management.repository.RegistrationRepository;
import com.example.horse_racing_management.repository.HorseRepository;
import com.example.horse_racing_management.entity.enums.TournamentStatus;
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

        // 2. Kiểm tra xem giải đấu còn mở đăng ký không (Dựa trên thuộc tính status có sẵn của nhóm)
        if (tournament.getStatus() == TournamentStatus.CLOSED) {
            throw new RuntimeException("Giải đấu này đã đóng, không thể đăng ký thêm!");
        }

        // 3. Kiểm tra xem con ngựa này có tồn tại trong hệ thống không
        Horse horse = horseRepository.findById(dto.getHorseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin con ngựa này!"));

        // 4. Kiểm tra xem con ngựa này đã đăng ký giải này từ trước chưa
        if (registrationRepository.existsByTournamentIdAndHorseId(dto.getTournamentId(), dto.getHorseId())) {
            throw new RuntimeException("Con ngựa này đã được đăng ký tham gia giải đấu này rồi!");
        }

        // 5. Tạo dữ liệu đăng ký mới theo chuẩn lưu trữ MongoDB
        Registration registration = new Registration();
        registration.setTournament(tournament);
        registration.setHorse(horse);
        registration.setRegistrationDate(new Date()); // Dùng java.util.Date theo chuẩn file mẫu của nhóm
        registration.setStatus("PENDING"); // Trạng thái chờ duyệt ban đầu

        return registrationRepository.save(registration);
    }
}