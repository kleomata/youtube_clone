package com.MusicAlpha.Music_App_Spring_Boot.dto.videodto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetSimilarHashtagVideosDto {

    private UUID id;
    private String fullNameSong;
    private LocalDateTime dateOfCreation;
    private String videoName;

    private Long viewCount;
    //private UUID userId;
    //private UUID channelId;
    private String imageProfile;
    private String channelName;

    private List<String> addHashtag;
    private List<String> selectHashtag;


    public GetSimilarHashtagVideosDto(UUID id, String fullNameSong, LocalDateTime dateOfCreation, String videoName, Long viewCount, String imageProfile, String channelName, List<String> addHashtag, List<String> selectHashtag) {
        this.id = id;
        this.fullNameSong = fullNameSong;
        this.dateOfCreation = dateOfCreation;
        this.videoName = videoName;
        this.viewCount = viewCount;
        this.imageProfile = imageProfile;
        this.channelName = channelName;
        this.addHashtag = addHashtag;
        this.selectHashtag = selectHashtag;
    }
}
