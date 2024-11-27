package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.hashtagdto.GetHashtagResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.*;
import com.MusicAlpha.Music_App_Spring_Boot.service.UserService;
import com.MusicAlpha.Music_App_Spring_Boot.service.VideoService;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/channel/video")
public class VideoController {

    @Autowired
    private UserService userService;

    @Autowired
    private VideoService videoService;

    @PostMapping("/uploadVideo")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetVideoResponse> uploadVideo(
            @Validated
            @ModelAttribute UploadVideoRequest request,
            @RequestParam("videoName") MultipartFile video,
            @RequestParam("channelId") UUID channelId,
            Authentication authentication
    ) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        String videoPaths = videoService.saveVideo(video);

        GetVideoResponse channelResponse = videoService.uploadVideo(request,userId, channelId ,videoPaths);

        return ResponseEntity.status(HttpStatus.CREATED).body(channelResponse);

    }

    @GetMapping("/allVideos")
    @PreAuthorize("/hasRole('USER')")
    public ResponseEntity<List<GetVideoResponse>> getAllVideos (
            @RequestParam("channelId") UUID channelId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = ((CustomUserDetails) userDetails).getUser().getId();

        List<GetVideoResponse> videos = videoService.getAllVideoUser(userId, channelId);
        return ResponseEntity.ok(videos);
    }

    private final String UPLOAD_DIR = "/home/kmata/Desktop/MusicAppProject/Videos/";


    @GetMapping("/videos/{videoName}")
    @PreAuthorize("/hasRole('USER')")
    public ResponseEntity<Resource> getVideo(@PathVariable String videoName) {
        try {
            Path videoPath = Paths.get(UPLOAD_DIR).resolve(videoName);
            Resource resource = new UrlResource(videoPath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/watch/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetVideoByIDResponse> getVideoById(@PathVariable UUID videoId, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            GetVideoByIDResponse videoByIDResponse = videoService.getVideoById(videoId);
            return ResponseEntity.ok(videoByIDResponse);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/hashtag/{hashtag}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetHashtagResponse>> getHashtagVideo(@PathVariable String hashtag, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            List<GetHashtagResponse> hashtagResponse = videoService.getHashtagVideo(hashtag);
            return ResponseEntity.ok(hashtagResponse);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/hashtag/similar/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetSimilarHashtagVideosDto>> getSimilarHashtagVideos(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ){
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            List<GetSimilarHashtagVideosDto> similarHashtagVideosDto = videoService.getSimilarHashtagVideos(videoId);
            return ResponseEntity.status(HttpStatus.OK).body(similarHashtagVideosDto);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }


}
