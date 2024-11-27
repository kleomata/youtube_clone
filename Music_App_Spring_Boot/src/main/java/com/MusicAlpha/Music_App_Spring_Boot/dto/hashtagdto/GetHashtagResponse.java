package com.MusicAlpha.Music_App_Spring_Boot.dto.hashtagdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetHashtagResponse {
    private UUID id;
    private String fullNameSong;
    private LocalDateTime dateOfCreation;
    private String videoName;

    //private UUID userId;
    //private UUID channelId;
    private String imageProfile;
    private String channelName;

    public GetHashtagResponse(UUID videoId, String videoName, String fullNameSong,LocalDateTime dateOfCreation,
                              String imageProfile, String channelName) {
        this.id = videoId;
        this.videoName = videoName;
        this.fullNameSong = fullNameSong;
        this.dateOfCreation = dateOfCreation;
        this.imageProfile = imageProfile;
        this.channelName = channelName;
    }
}
