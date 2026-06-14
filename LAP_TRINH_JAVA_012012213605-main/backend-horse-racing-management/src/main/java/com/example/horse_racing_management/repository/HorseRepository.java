package com.example.horse_racing_management.repository;

import com.example.horse_racing_management.entity.Horse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorseRepository extends MongoRepository<Horse, String> {
<<<<<<< HEAD:LAP_TRINH_JAVA_012012213605-main/backend-horse-racing-management/src/main/java/com/example/horse_racing_management/repository/HorseRepository.java
   // Tìm danh sách ngựa theo ID của chủ ngựa (Kiểu String phù hợp với MongoDB)
=======
    // Spring Data sẽ cung cấp sẵn các hàm như:
    // save(), findAll(), findById(), deleteById()... mà không cần viết code!
>>>>>>> 6bf9edf13c7adb8f1bd0c27fe0fa6942dac769b3:backend-horse-racing-management/src/main/java/com/example/horse_racing_management/repository/HorseRepository.java
    List<Horse> findByOwnerId(String ownerId);
}
