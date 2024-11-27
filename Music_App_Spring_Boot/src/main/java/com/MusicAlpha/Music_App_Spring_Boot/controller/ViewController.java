package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.CountChannelDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto.CountUserViewDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto.ViewVideoDto;
import com.MusicAlpha.Music_App_Spring_Boot.service.ViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/view")
public class ViewController {

    @Autowired
    private ViewService viewService;

    @PostMapping("/increaseViewCount")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> increaseViewCount(
            @Validated
            @RequestBody ViewVideoDto viewVideoDto,
            Authentication authentication
    ){
        viewService.increaseViewCount(viewVideoDto, authentication);
        return ResponseEntity.status(HttpStatus.OK).body("View count increased successfully.");
    }

    @GetMapping("/{videoId}/total-views")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Long> getTotalViewCountForVideo(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ){
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            Optional<Long> totalViews = viewService.getTotalViewCountForVideo(videoId);

            return totalViews
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/{videoId}/user-views")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CountUserViewDto> getViewCountForUserInVideo(
            @Validated
            @PathVariable UUID videoId,
            Authentication authentication
    ){
        CountUserViewDto countViewUser = viewService.getViewCountForUserInVideo(videoId, authentication);
        return ResponseEntity.status(HttpStatus.OK).body(countViewUser);
    }

}
