package com.MusicAlpha.Music_App_Spring_Boot.dto.userdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class RegisterUserRequest {
    //private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate birthdate;
    private String email;
    private String gender;
    private String phone;
    private String country;
    private String state;
    private String city;
    private String specificAddress;
    //private String picture;
    private String username;
    private String password;
}
