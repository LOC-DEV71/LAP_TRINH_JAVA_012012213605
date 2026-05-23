package com.example.horse_racing_management.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Document(collection = "horses") 
public class Horse {
    @Id
    private String id; 
    
    private String name; 
    private int age;     
    private String breed; 
    
    private String ownerId; 
}