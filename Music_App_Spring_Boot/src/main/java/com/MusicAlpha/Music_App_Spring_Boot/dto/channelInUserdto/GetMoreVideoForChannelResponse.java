package com.MusicAlpha.Music_App_Spring_Boot.dto.channelInUserdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetMoreVideoForChannelResponse {
    private UUID videoId;
    private String fullNameSong;
    private LocalDateTime dateOfCreation;
    private String videoName;

    public GetMoreVideoForChannelResponse(String fullNameSong, LocalDateTime dateOfCreation, String videoName, UUID videoId) {
        this.fullNameSong = fullNameSong;
        this.dateOfCreation = dateOfCreation;
        this.videoName = videoName;
        this.videoId = videoId;
    }
}
