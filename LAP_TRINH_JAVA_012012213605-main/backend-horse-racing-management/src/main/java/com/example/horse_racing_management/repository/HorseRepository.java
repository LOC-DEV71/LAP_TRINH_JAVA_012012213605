package com.example.horse_racing_management.repository;

import com.example.horse_racing_management.entity.Horse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorseRepository extends MongoRepository<Horse, String> {
   // Tìm danh sách ngựa theo ID của chủ ngựa (Kiểu String phù hợp với MongoDB)
    List<Horse> findByOwnerId(String ownerId);
}
