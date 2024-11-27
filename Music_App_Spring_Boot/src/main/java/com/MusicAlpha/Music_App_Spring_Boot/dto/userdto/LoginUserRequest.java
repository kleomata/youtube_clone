package com.MusicAlpha.Music_App_Spring_Boot.dto.userdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class LoginUserRequest {

    private UUID id;
    private String username;
    private String password;

}
