package com.MusicAlpha.Music_App_Spring_Boot.dto.videodto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetVideoByIDResponse {
    private UUID id;
    private String nameSong;
    private String fullNameSong;
    private LocalDateTime dateOfCreation;

    private String videoName;

    private List<String> nameSinger;
    private List<String> addHashtag;
    private List<String> selectHashtag;
    private String lyrics;
    private String descriptionVideo;

    private Integer countSubscribe;
    private String channelName;

    private String firstName;
    private String lastName;
    private String picture;

    //private UUID userId;
    private UUID channelId;

    public GetVideoByIDResponse(
            String firstName, String lastName, String imageProfile, String channelName,
            Integer countSubscribe, String videoName, String nameSong, String fullNameSong,
            LocalDateTime dateOfCreation, String lyrics, String descriptionVideo, List<String> nameSinger,
            List<String> addHashtag, List<String> selectHashtag, UUID channelId, UUID videoId) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = imageProfile;
        this.channelName = channelName;
        this.countSubscribe = countSubscribe;
        this.videoName = videoName;
        this.nameSong = nameSong;
        this.fullNameSong = fullNameSong;
        this.dateOfCreation = dateOfCreation;
        this.lyrics = lyrics;
        this.descriptionVideo = descriptionVideo;
        this.nameSinger = nameSinger;
        this.addHashtag = addHashtag;
        this.selectHashtag = selectHashtag;
        this.channelId = channelId;
        this.id = videoId;
    }

}
