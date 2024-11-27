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
public class GetSearchVideoResponse {
    private UUID id;
    private String nameSong;
    private String fullNameSong;
    private String descriptionVideo;
    private List<String> nameSinger;
    private List<String> addHashtag;
    private List<String> selectHashtag;
    private LocalDateTime dateOfCreation;

    private String videoName;
    //private UUID userId;
   //private UUID channelId;
    private String imageProfile;
    private String channelName;

}
