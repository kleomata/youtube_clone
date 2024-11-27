package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.AddCommentRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.GetCommentResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.GetCommentVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.AddReplayRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.GetReplayResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.GetReplayVideoResponse;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    GetCommentResponse addComment(AddCommentRequest request, Authentication authentication);
    List<GetCommentVideoResponse> getAllCommentByVideo(UUID videoId);

    GetReplayResponse addReplay(AddReplayRequest request, Authentication authentication);
    List<GetReplayVideoResponse> getAllReplayByCommentInVideo(UUID videoId, UUID commentId);
}
