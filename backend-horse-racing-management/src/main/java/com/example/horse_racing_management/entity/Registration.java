package com.example.horse_racing_management.entity;

import com.example.horse_racing_management.entity.enums.RegistrationStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Registration {

    @Id
    private String id;

    @Field("race_id")
    private String raceId;

    @Field("horse_id")
    private String horseId;

    @Field("jockey_id")
    private String jockeyId;

    private RegistrationStatus status;
}
