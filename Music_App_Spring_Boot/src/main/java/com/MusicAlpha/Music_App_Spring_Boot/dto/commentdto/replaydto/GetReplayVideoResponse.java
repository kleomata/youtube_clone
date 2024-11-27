package com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetReplayVideoResponse {

    private UUID id;

    private String firstName;
    private String lastName;
    private String imageProfile;

    private String channelName;
    private String channelNameComment;

    private String commentContent;
    private LocalDateTime dataComment;

    //private UUID commentId;

    public GetReplayVideoResponse(UUID id, String firstName, String lastName, String imageProfile,
                                  String channelName, String channelNameComment, String commentContent, LocalDateTime dataComment) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageProfile = imageProfile;
        this.channelName = channelName;
        this.channelNameComment = channelNameComment;
        this.commentContent = commentContent;
        this.dataComment = dataComment;
        //this.commentId = commentId;
    }
}
