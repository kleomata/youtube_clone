package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto.AddDislikeRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto.CountDislikeDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto.AddLikeRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto.CountLikeDto;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Dislike;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Likes;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import com.MusicAlpha.Music_App_Spring_Boot.repository.DislikeRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.LikesRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.UserRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.VideoRepository;
import com.MusicAlpha.Music_App_Spring_Boot.service.VoteService;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VoteServiceImpl implements VoteService {

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private DislikeRepository dislikeRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String addLike(AddLikeRequest likeRequest, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        Video video = videoRepository.findById(likeRequest.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (likesRepository.existsByUserIdAndVideoId(userId, likeRequest.getVideoId())){
            return "User is already like to this video.";
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Likes likes = new Likes();
        likes.setVideo(video);
        likes.setUser(user);
        likes.setDateLike(LocalDateTime.now());

        likesRepository.save(likes);

        return  "Successfully like to video: " + video.getId();
    }

    @Override
    public String removeLike(AddLikeRequest likeRequest, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        Video video = videoRepository.findById(likeRequest.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        Likes likes = likesRepository.findByUserIdAndVideoId(userId, likeRequest.getVideoId());
        if(likes == null) {
            return "No have like found for the user on this video.";
        }

        likesRepository.delete(likes);

        return "Successfully remove like from video: " + video.getId();
    }

    @Override
    public boolean hasLike(UUID videoId, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        //Video video = videoRepository.findById(videoId)
          //      .orElseThrow(() -> new RuntimeException("Video not found"));

        return likesRepository.existsByUserIdAndVideoId(userId, videoId);
    }

    @Override
    public CountLikeDto getCountLike(UUID videoId) {
        //Video video = videoRepository.findById(videoId)
          //      .orElseThrow(() -> new RuntimeException("Video not found"));

        int countVideoLike = likesRepository.countByVideoId(videoId);
        return new CountLikeDto(countVideoLike);
    }

    @Override
    public String addDislike(AddDislikeRequest dislikeRequest, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        Video video = videoRepository.findById(dislikeRequest.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (dislikeRepository.existsByUserIdAndVideoId(userId, dislikeRequest.getVideoId())){
            return "User is already dislike to this video.";
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dislike dislike = new Dislike();
        dislike.setVideo(video);
        dislike.setUser(user);
        dislike.setDateDislike(LocalDateTime.now());

        dislikeRepository.save(dislike);

        return  "Successfully dislike to video: " + video.getId();
    }

    @Override
    public String removeDislike(AddDislikeRequest dislikeRequest, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        Video video = videoRepository.findById(dislikeRequest.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        Dislike dislike = dislikeRepository.findByUserIdAndVideoId(userId, dislikeRequest.getVideoId());
        if(dislike == null) {
            return "No have dislike found for the user on this video.";
        }

        dislikeRepository.delete(dislike);

        return "Successfully remove dislike from video: " + video.getId();
    }

    @Override
    public boolean hasDislike(UUID videoId, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        //Video video = videoRepository.findById(videoId)
        //      .orElseThrow(() -> new RuntimeException("Video not found"));
        return dislikeRepository.existsByUserIdAndVideoId(userId, videoId);
    }

    @Override
    public CountDislikeDto getCountDislike(UUID videoId) {
        int countVideoDislike = dislikeRepository.countByVideoId(videoId);
        return new CountDislikeDto(countVideoDislike);
    }

}
