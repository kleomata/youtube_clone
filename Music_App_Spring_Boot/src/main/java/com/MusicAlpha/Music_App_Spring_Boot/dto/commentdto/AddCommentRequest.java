package com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class AddCommentRequest {

    private UUID id;
    private String commentContent;
    private UUID videoId;
    private UUID userId;
    private String channel;

}
