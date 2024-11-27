package com.MusicAlpha.Music_App_Spring_Boot.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "firstName")
    private String firstName;

    @Column(nullable = false, name = "lastName")
    private String lastName;

    @Column(nullable = false, name = "birthdate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy")
    private LocalDate birthdate;

    @Column(nullable = false, name = "email", unique = true)
    private String email;

    @Column(nullable = false, name = "gender")
    private String gender;

    @Column(nullable = false, name = "phone")
    private String phone;

    @Column(nullable = false, name = "country")
    private String country;

    @Column(nullable = false, name = "state")
    private String state;

    @Column(nullable = false, name = "city")
    private String city;

    @Column(nullable = false, name = "specificAddress")
    private String specificAddress;

    @Column(nullable = false, name = "picture")
    private String picture;

    @Column(nullable = false, name = "username", unique = true)
    private String username;

    @Column(nullable = false, name = "password")
    private String password;

    @Column(nullable = false, name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

}
