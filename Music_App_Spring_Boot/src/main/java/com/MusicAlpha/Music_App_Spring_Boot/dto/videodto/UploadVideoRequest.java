package com.MusicAlpha.Music_App_Spring_Boot.dto.videodto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class UploadVideoRequest {

    //private UUID id;
    private String nameSong;
    private String fullNameSong;
    //private LocalDate dateOfCreation;

    //private String video;

    private List<String> nameSinger;
    private List<String> addHashtag;
    private List<String> selectHashtag;
    private String lyrics;
    private String descriptionVideo;


    //private UUID userId;
    //private UUID channelId;

}
