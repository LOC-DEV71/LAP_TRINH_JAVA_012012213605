package com.example.horse_racing_management.config;

import com.example.horse_racing_management.entity.Permission;
import com.example.horse_racing_management.entity.Role;
import com.example.horse_racing_management.entity.User;
import com.example.horse_racing_management.repository.PermissionRepository;
import com.example.horse_racing_management.repository.RoleRepository;
import com.example.horse_racing_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedPermissions();
        seedUsers();
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
