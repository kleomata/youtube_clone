package com.MusicAlpha.Music_App_Spring_Boot.dto.userdto;

import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetUserResponse {

    private UUID id;
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
    private String picture;
    private String username;
    //private String password;

    private String token;


    public GetUserResponse(User user, String picture){
        this.picture = picture;
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthdate = user.getBirthdate();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.country = user.getCountry();
        this.state = user.getState();
        this.city = user.getCity();
        this.specificAddress = user.getSpecificAddress();
        this.username = user.getUsername();
        this.gender = user.getGender();
    }
}
