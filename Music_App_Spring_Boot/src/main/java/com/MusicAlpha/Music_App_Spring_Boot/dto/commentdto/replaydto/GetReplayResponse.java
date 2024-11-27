package com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Comment;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Replay;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetReplayResponse {

    private UUID id;

    private String commentContent;
    private LocalDateTime dateComment;

    private UUID userId;
    private UUID videoId;
    private String channelName;

    private UUID commentId;


    public GetReplayResponse(Replay replay) {
        this.id = replay.getId();
        this.commentContent = replay.getCommentContent();
        this.dateComment = replay.getDateComment();
        this.userId = replay.getUser().getId();
        this.videoId = replay.getVideo().getId();
        this.channelName = replay.getChannel().getChannel();
        this.commentId = replay.getComment().getId();
    }
}
