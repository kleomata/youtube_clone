package com.MusicAlpha.Music_App_Spring_Boot.dto.videodto;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetVideoResponse {

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


    private UUID userId;
    private UUID channelId;


    public GetVideoResponse(Video video, UUID userId, UUID channelId, String videoName) {
        this.id = video.getId();
        this.nameSong = video.getNameSong();
        this.fullNameSong = video.getFullNameSong();
        this.dateOfCreation = video.getDateOfCreation();
        this.videoName = videoName;
        this.nameSinger = video.getNameSinger();
        this.addHashtag = video.getAddHashtag();
        this.selectHashtag = video.getSelectHashtag();
        this.descriptionVideo = video.getDescriptionVideo();
        this.userId = userId;
        this.channelId = channelId;
    }

    public GetVideoResponse(Video video, String videoName) {
        this.id = video.getId();
        this.nameSong = video.getNameSong();
        this.fullNameSong = video.getFullNameSong();
        this.dateOfCreation = video.getDateOfCreation();
        this.videoName = videoName;
        this.nameSinger = video.getNameSinger();
        this.addHashtag = video.getAddHashtag();
        this.selectHashtag = video.getSelectHashtag();
        this.descriptionVideo = video.getDescriptionVideo();
        //this.userId = userId;
        //this.channelId = channelId;
    }



}
