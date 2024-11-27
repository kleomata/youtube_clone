package com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Comment;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetCommentResponse {

    private UUID id;

    private String commentContent;
    private LocalDateTime dateComment;

    private UUID userId;
    private UUID videoId;
    private String channelName;

    public GetCommentResponse(Comment comment) {
        this.id = comment.getId();
        this.commentContent = comment.getCommentContent();
        this.dateComment = comment.getDateComment();
        this.userId = comment.getUser().getId();
        this.videoId = comment.getVideo().getId();
        this.channelName = comment.getChannel().getChannel();
    }

}
