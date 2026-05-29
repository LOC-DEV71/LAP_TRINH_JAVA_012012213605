package com.example.horse_racing_management.config;

import com.example.horse_racing_management.entity.Permission;
import com.example.horse_racing_management.entity.Role;
import com.example.horse_racing_management.repository.PermissionRepository;
import com.example.horse_racing_management.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        seedPermissions();
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
