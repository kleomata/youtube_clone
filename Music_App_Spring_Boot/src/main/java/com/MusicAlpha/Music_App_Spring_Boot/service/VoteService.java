package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto.AddDislikeRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto.CountDislikeDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto.AddLikeRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto.CountLikeDto;
import org.springframework.security.core.Authentication;

import java.util.UUID;

public interface VoteService {
    String addLike(AddLikeRequest likeRequest, Authentication authentication);
    String removeLike(AddLikeRequest likeRequest, Authentication authentication);
    boolean hasLike(UUID videoId, Authentication authentication);
    CountLikeDto getCountLike(UUID videoId);

    String addDislike(AddDislikeRequest dislikeRequest, Authentication authentication);
    String removeDislike(AddDislikeRequest dislikeRequest, Authentication authentication);
    boolean hasDislike(UUID videoId, Authentication authentication);
    CountDislikeDto getCountDislike(UUID videoId);

}
