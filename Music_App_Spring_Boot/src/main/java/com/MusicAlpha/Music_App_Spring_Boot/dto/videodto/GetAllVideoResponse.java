package com.MusicAlpha.Music_App_Spring_Boot.dto.videodto;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetAllVideoResponse {

    private UUID id;
    private String fullNameSong;
    private LocalDateTime dateOfCreation;
    private String videoName;

    private UUID userId;
    private UUID channelId;
    private String imageProfile;
    private String channelName;

    public GetAllVideoResponse(Video video, String videoName, String imageProfile, String channelName) {

        this.id = video.getId();
        this.fullNameSong = video.getFullNameSong();
        this.dateOfCreation = video.getDateOfCreation();
        this.videoName = videoName;

        this.userId = video.getUser().getId();
        this.channelId = video.getChannel().getId();
        this.imageProfile = imageProfile;
        this.channelName = channelName;
    }
}
