package com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class AddReplayRequest {

    private UUID id;
    private String commentContent;
    private UUID videoId;
    private UUID userId;
    private String channel;
    private UUID commentId;

}
