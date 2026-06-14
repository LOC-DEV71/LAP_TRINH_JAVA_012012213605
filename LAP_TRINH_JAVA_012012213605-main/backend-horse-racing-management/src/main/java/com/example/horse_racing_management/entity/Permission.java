package com.example.horse_racing_management.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
<<<<<<< HEAD:LAP_TRINH_JAVA_012012213605-main/backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
import org.springframework.data.mongodb.core.mapping.Field;
=======
>>>>>>> 6bf9edf13c7adb8f1bd0c27fe0fa6942dac769b3:backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

<<<<<<< HEAD:LAP_TRINH_JAVA_012012213605-main/backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
<<<<<<<< HEAD:LAP_TRINH_JAVA_012012213605-main/backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
=======
>>>>>>> 6bf9edf13c7adb8f1bd0c27fe0fa6942dac769b3:backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
@Document(collection = "permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    @Id
    private String id;
    private String title;
    private String key;
}
<<<<<<< HEAD:LAP_TRINH_JAVA_012012213605-main/backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
========
@Document(collection = "horses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horse {

    @Id
    private String id;

    private String name;

    private int age;

    private String breed;

    @Field("owner_id")
    private String ownerId;
}
>>>>>>>> 6bf9edf13c7adb8f1bd0c27fe0fa6942dac769b3:backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Horse.java
=======
>>>>>>> 6bf9edf13c7adb8f1bd0c27fe0fa6942dac769b3:backend-horse-racing-management/src/main/java/com/example/horse_racing_management/entity/Permission.java
