package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.AddCommentRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.GetCommentResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.GetCommentVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.AddReplayRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.GetReplayResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.GetReplayVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/addComment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetCommentResponse> addComment(
            @Validated
            @RequestBody AddCommentRequest commentRequest,
            Authentication authentication
    ) {
        //UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        GetCommentResponse comment = commentService.addComment(commentRequest, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/allVideoComments/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetCommentVideoResponse>> getAllCommentByVideo(@PathVariable UUID videoId, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
          List<GetCommentVideoResponse> commentVideoResponses = commentService.getAllCommentByVideo(videoId);
          return ResponseEntity.ok(commentVideoResponses);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PostMapping("/addReplay")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetReplayResponse> addReplay(
            @Validated @RequestBody AddReplayRequest request,
            Authentication authentication
    ) {
        GetReplayResponse response = commentService.addReplay(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/allReplayForComment/{videoId}/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetReplayVideoResponse>> getAllCommentByVideo(@PathVariable UUID videoId, @PathVariable UUID commentId, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            List<GetReplayVideoResponse> replayVideoResponses = commentService.getAllReplayByCommentInVideo(videoId, commentId);
            return ResponseEntity.ok(replayVideoResponses);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

}
