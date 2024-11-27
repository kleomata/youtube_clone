package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.CountChannelDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto.AddDislikeRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto.CountDislikeDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto.AddLikeRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto.CountLikeDto;
import com.MusicAlpha.Music_App_Spring_Boot.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/vote")
public class VoteController {


    @Autowired
    private VoteService voteService;

    // Like

    @PostMapping("/addLike")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> addLike(
            @Validated
            @RequestBody AddLikeRequest addLikeRequest,
            Authentication authentication
    ){
        String result = voteService.addLike(addLikeRequest, authentication);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", result));
    }

    @PostMapping("/removeLike")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> removeLike(
            @Validated
            @RequestBody AddLikeRequest addLikeRequest,
            Authentication authentication
    ){
        String result = voteService.removeLike(addLikeRequest, authentication);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", result));
    }

    @GetMapping("/checkLike/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Boolean>> checkLike(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ) {
        boolean isLike = voteService.hasLike(videoId, authentication);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("isLike", isLike));
    }

    @GetMapping("/{videoId}/likes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CountLikeDto> getCountLike(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ){
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            CountLikeDto countLike = voteService.getCountLike(videoId);
            return ResponseEntity.status(HttpStatus.OK).body(countLike);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    //Dislike
    @PostMapping("/addDislike")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> addDislike(
            @Validated
            @RequestBody AddDislikeRequest addDislikeRequest,
            Authentication authentication
    ){
        String result = voteService.addDislike(addDislikeRequest, authentication);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", result));
    }

    @PostMapping("/removeDislike")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> removeDislike(
            @Validated
            @RequestBody AddDislikeRequest addDislikeRequest,
            Authentication authentication
    ){
        String result = voteService.removeDislike(addDislikeRequest, authentication);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", result));
    }

    @GetMapping("/checkDislike/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Boolean>> checkDislike(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ) {
        boolean isDislike = voteService.hasDislike(videoId, authentication);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("isDislike", isDislike));
    }

    @GetMapping("/{videoId}/dislikes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CountDislikeDto> getCountDislike(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ){
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            CountDislikeDto countDislike = voteService.getCountDislike(videoId);
            return ResponseEntity.status(HttpStatus.OK).body(countDislike);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }




}
