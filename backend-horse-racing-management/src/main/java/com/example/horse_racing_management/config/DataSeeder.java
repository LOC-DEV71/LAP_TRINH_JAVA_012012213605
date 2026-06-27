package com.example.horse_racing_management.config;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.horse_racing_management.entity.Horse;
import com.example.horse_racing_management.entity.Jockey;
import com.example.horse_racing_management.entity.Permission;
import com.example.horse_racing_management.entity.Race;
import com.example.horse_racing_management.entity.Registration;
import com.example.horse_racing_management.entity.Role;
import com.example.horse_racing_management.entity.Tournament;
import com.example.horse_racing_management.entity.User;
import com.example.horse_racing_management.entity.enums.RegistrationStatus;
import com.example.horse_racing_management.repository.HorseRepository;
import com.example.horse_racing_management.repository.JockeyRepository;
import com.example.horse_racing_management.repository.PermissionRepository;
import com.example.horse_racing_management.repository.RaceRepository;
import com.example.horse_racing_management.repository.RegistrationRepository;
import com.example.horse_racing_management.repository.RoleRepository;
import com.example.horse_racing_management.repository.TournamentRepository;
import com.example.horse_racing_management.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private JockeyRepository jockeyRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedPermissions();
        seedUsers();
        seedSampleData();
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByKey("ROLE_ADMIN").orElse(null);
        Role refereeRole = roleRepository.findByKey("ROLE_RACE_REFEREE").orElse(null);

        if (adminRole != null && userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User(null, "admin", passwordEncoder.encode("123456"), "admin@example.com", adminRole, "Quản trị viên", 1000000.0, true);
            userRepository.save(admin);
            System.out.println("Seeded admin user.");
        }

        if (refereeRole != null && userRepository.findByUsername("trongtai1").isEmpty()) {
            User referee = new User(null, "trongtai1", passwordEncoder.encode("123456"), "trongtai1@example.com", refereeRole, "Trọng tài Nguyễn Văn A", 0.0, true);
            userRepository.save(referee);
            System.out.println("Seeded referee user 1.");
        }

        if (refereeRole != null && userRepository.findByUsername("trongtai2").isEmpty()) {
            User referee2 = new User(null, "trongtai2", passwordEncoder.encode("123456"), "trongtai2@example.com", refereeRole, "Trọng tài Trần Văn B", 0.0, true);
            userRepository.save(referee2);
            System.out.println("Seeded referee user 2.");
        }
    }

    private void seedSampleData() {
        seedSampleTournaments();
        seedSampleRaces();
        seedSampleHorses();
        seedSampleJockeys();
        seedSampleRegistrations();
    }

    private void seedSampleTournaments() {
        if (!tournamentRepository.findAll().isEmpty()) {
            return;
        }

        Tournament tournament = new Tournament();
        tournament.setName("Giải Vô Địch Đua Ngựa Quốc Gia");
        tournament.setDescription("Giải đua ngựa lớn nhất trong năm, gồm nhiều vòng thi và thí sinh ưu tú.");
        tournament.setStartDate(new Date(System.currentTimeMillis() + 2L * 24 * 60 * 60 * 1000));
        tournament.setEndDate(new Date(System.currentTimeMillis() + 9L * 24 * 60 * 60 * 1000));
        tournament.setStatus(com.example.horse_racing_management.entity.enums.TournamentStatus.UPCOMING);

        tournamentRepository.save(tournament);
        System.out.println("Seeded sample tournament.");
    }

    private void seedSampleRaces() {
        if (!raceRepository.findAll().isEmpty()) {
            return;
        }

        Tournament tournament = tournamentRepository.findAll().stream().findFirst().orElse(null);
        if (tournament == null) {
            return;
        }

        User referee = userRepository.findByUsername("trongtai1").stream().findFirst().orElse(null);
        String refereeId = referee != null ? referee.getId() : null;

        Race race1 = new Race();
        race1.setTournamentId(tournament.getId());
        race1.setName("Vòng 1 - Đua Nước");
        race1.setStartTime(LocalDateTime.now().plusDays(2));
        race1.setDistance(1200.0);
        race1.setStatus(com.example.horse_racing_management.entity.enums.RaceStatus.SCHEDULED);
        race1.setRefereeId(refereeId);

        Race race2 = new Race();
        race2.setTournamentId(tournament.getId());
        race2.setName("Vòng 2 - Đua Tốc Độ");
        race2.setStartTime(LocalDateTime.now().plusDays(4));
        race2.setDistance(1500.0);
        race2.setStatus(com.example.horse_racing_management.entity.enums.RaceStatus.SCHEDULED);
        race2.setRefereeId(refereeId);

        raceRepository.save(race1);
        raceRepository.save(race2);
        System.out.println("Seeded sample races.");
    }

    private void seedSampleHorses() {
        if (!horseRepository.findAll().isEmpty()) {
            return;
        }

        User owner = userRepository.findByUsername("admin").stream().findFirst().orElse(null);
        if (owner == null) {
            owner = new User(null, "owner1", passwordEncoder.encode("owner123"), "owner1@example.com", roleRepository.findByKey("ROLE_SPECTATOR").orElse(null), "Chủ ngựa Nguyễn Văn C", 0.0, true);
            userRepository.save(owner);
            System.out.println("Seeded sample owner user.");
        }

        Horse horse1 = new Horse();
        horse1.setName("Tia Chớp");
        horse1.setAge(4);
        horse1.setBreed("Arabian");
        horse1.setOwnerId(owner.getId());

        Horse horse2 = new Horse();
        horse2.setName("Bão Tố");
        horse2.setAge(5);
        horse2.setBreed("Thoroughbred");
        horse2.setOwnerId(owner.getId());

        horseRepository.save(horse1);
        horseRepository.save(horse2);
        System.out.println("Seeded sample horses.");
    }

    private void seedSampleJockeys() {
        if (!jockeyRepository.findAll().isEmpty()) {
            return;
        }

        Jockey jockey1 = new Jockey();
        jockey1.setName("Nguyễn Minh");
        jockey1.setLicenseNumber("JCK-1001");
        jockey1.setExperienceYears(5);
        jockey1.setRating(4.8);
        jockeyRepository.save(jockey1);

        Jockey jockey2 = new Jockey();
        jockey2.setName("Trần Thanh");
        jockey2.setLicenseNumber("JCK-1002");
        jockey2.setExperienceYears(3);
        jockey2.setRating(4.5);
        jockeyRepository.save(jockey2);

        System.out.println("Seeded sample jockeys.");
    }

    private void seedSampleRegistrations() {
        if (!registrationRepository.findAll().isEmpty()) {
            return;
        }

        List<Race> races = raceRepository.findAll();
        List<Horse> horses = horseRepository.findAll();
        List<Jockey> jockeys = jockeyRepository.findAll();

        if (races.isEmpty() || horses.isEmpty() || jockeys.isEmpty()) {
            return;
        }

        Race targetRace = races.get(0);
        Horse horse1 = horses.get(0);
        Horse horse2 = horses.size() > 1 ? horses.get(1) : horses.get(0);
        Jockey jockey1 = jockeys.get(0);
        Jockey jockey2 = jockeys.size() > 1 ? jockeys.get(1) : jockeys.get(0);

        Registration reg1 = new Registration();
        reg1.setRaceId(targetRace.getId());
        reg1.setHorseId(horse1.getId());
        reg1.setJockeyId(jockey1.getId());
        reg1.setRegistrationDate(new Date());
        reg1.setStatus(RegistrationStatus.APPROVED);
        reg1.setAdminStatus(RegistrationStatus.APPROVED);

        Registration reg2 = new Registration();
        reg2.setRaceId(targetRace.getId());
        reg2.setHorseId(horse2.getId());
        reg2.setJockeyId(jockey2.getId());
        reg2.setRegistrationDate(new Date());
        reg2.setStatus(RegistrationStatus.APPROVED);
        reg2.setAdminStatus(RegistrationStatus.APPROVED);

        registrationRepository.save(reg1);
        registrationRepository.save(reg2);
        System.out.println("Seeded sample registrations for race " + targetRace.getId());
    }

    private void checkAndSeedRole(String title, String key) {
        if (roleRepository.findByKey(key).isEmpty()) {
            Role role = new Role();
            role.setTitle(title);
            role.setKey(key);
            roleRepository.save(role);
            System.out.println("Seeded role " + key + " to database.");
        }
    }

    private void seedRoles() {
        checkAndSeedRole("Quản trị viên", "ROLE_ADMIN");
        checkAndSeedRole("Trọng tài", "ROLE_RACE_REFEREE");
        checkAndSeedRole("Người xem", "ROLE_SPECTATOR");
    }

    private void checkAndSeed(String title, String key) {
        if (permissionRepository.findByKey(key).isEmpty()) {
            permissionRepository.save(new Permission(null, title, key));
            System.out.println("Seeded " + key + " to database.");
        }
    }

    private void seedPermissions() {
        // Đảm bảo các quyền cốt lõi luôn tồn tại
        checkAndSeed("Quản lý Người dùng", "PERM_USER_MANAGER");
        checkAndSeed("Quản lý Vai trò", "PERM_ROLE_MANAGER");
        checkAndSeed("Quản lý Giải đấu", "PERM_TOURNAMENT_MANAGER");
        checkAndSeed("Quản lý Ngựa", "PERM_HORSE_MANAGER");

        // Grant all permissions to ROLE_ADMIN to prevent lockout
        roleRepository.findByKey("ROLE_ADMIN").ifPresent(adminRole -> {
            List<Permission> allPerms = permissionRepository.findAll();
            adminRole.getPermissions().addAll(allPerms);
            roleRepository.save(adminRole);
            System.out.println("Granted all permissions to ROLE_ADMIN.");
        });
    }
}
