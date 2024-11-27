package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.channelInUserdto.GetInfoChannelResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.GetUserResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.LoginUserRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.RegisterUserRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetAllVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetSearchVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
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
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/registerUser")
    public ResponseEntity<GetUserResponse> register (
            @Validated @ModelAttribute RegisterUserRequest registerUserRequest, @RequestParam("picture") MultipartFile picture) {
        String imagePath = userService.saveImageProfile(picture);
        GetUserResponse response = userService.registerUser(registerUserRequest, imagePath);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/loginUser")
    public ResponseEntity<GetUserResponse> loginUser(@RequestBody LoginUserRequest request) {
        GetUserResponse response = userService.loginUser(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/infoUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetUserResponse> getUserById(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
            UUID id = customUserDetails.getUser().getId();
            if (id == null) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            GetUserResponse response = userService.getUserById(id);
            if(response == null) {
                return  new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error fetching user profile: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    private final String UPLOAD_DIR = "/home/kmata/Desktop/MusicAppProject/Profile/";

    @GetMapping("/pictureUser/{pictureName}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Resource> getPictureUser(@PathVariable String pictureName) {
        try {
            Path imagePath = Paths.get(UPLOAD_DIR).resolve(pictureName).normalize();
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            System.err.println("Error fetching picture: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/allVideos")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetAllVideoResponse>> getAllVideo(Authentication authentication) {

        if (authentication != null && authentication.isAuthenticated()
            && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {

            List<GetAllVideoResponse> videos = userService.getAllVideo();

            return ResponseEntity.ok(videos);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    private final String UPLOAD_DIR_Video = "/home/kmata/Desktop/MusicAppProject/Videos/";


    @GetMapping("/videos/{videoName}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Resource> getVideo(@PathVariable String videoName) {
        try {
            Path videoPath = Paths.get(UPLOAD_DIR_Video).resolve(videoName);
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

    @GetMapping("/channel/{channelName}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetInfoChannelResponse> getChannel(@PathVariable String channelName, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            GetInfoChannelResponse channel = userService.getChannel(channelName);
            return ResponseEntity.ok(channel);
        } else {
            return ResponseEntity.status(403).body(null);
        }

    }


    // Search
    ////
    @GetMapping("/searchSuggestions/{query}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetSearchVideoResponse>> getSearchSuggestions(@PathVariable String query, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
           List<GetSearchVideoResponse> suggestions = userService.getSearchSuggestions(query);
           return ResponseEntity.ok(suggestions);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/searchResults/{query}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetSearchVideoResponse>> getSearchResults(@PathVariable String query, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            List<GetSearchVideoResponse> results = userService.getSearchResults(query);
            return ResponseEntity.ok(results);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }


}
