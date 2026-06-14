package com.example.horse_racing_management.repository;

import com.example.horse_racing_management.entity.Horse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorseRepository extends MongoRepository<Horse, String> {
    // Spring Data sẽ cung cấp sẵn các hàm như:
    // save(), findAll(), findById(), deleteById()... mà không cần viết code!
    List<Horse> findByOwnerId(String ownerId);
}
