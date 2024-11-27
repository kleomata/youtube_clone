package com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetSubscribeForUserResponse {

    private UUID id;

    private String firstName;
    private String lastName;

    private String picture;
    private String channelName;
    private Integer countSubscribe;
    private LocalDateTime subscriptionDate;


    private UUID userId;
    private UUID channelId;

    public GetSubscribeForUserResponse(String firstName, String lastName, String imageProfile, String channelName, Integer counter, LocalDateTime subscriptionDate,
                                       UUID userId, UUID channelId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = imageProfile;
        this.channelName = channelName;
        this.countSubscribe = counter;
        this.subscriptionDate = subscriptionDate;
        this.userId = userId;
        this.channelId = channelId;
    }

}
