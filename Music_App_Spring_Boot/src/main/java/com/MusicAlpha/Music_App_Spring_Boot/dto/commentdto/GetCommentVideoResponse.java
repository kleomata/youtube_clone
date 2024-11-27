package com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetCommentVideoResponse {

    private UUID id;

    private String firstName;
    private String lastName;
    private String imageProfile;

    private String channelName;
    private String channelNameComment;

    private String commentContent;
    private LocalDateTime dataComment;


    public GetCommentVideoResponse(String firstName, String lastName, String imageProfile, String channelName, String commentContent,
                                   LocalDateTime dataComment, String channelNameComment, UUID id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageProfile = imageProfile;
        this.channelName = channelName;
        this.commentContent = commentContent;
        this.dataComment = dataComment;
        this.channelNameComment = channelNameComment;
        this.id = id;
    }
}
