package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto.CreateChannelRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto.GetChannelResponse;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.service.ChannelService;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/channel")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @PostMapping("/createChannel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetChannelResponse> createChannel(
            @Validated
            @RequestBody CreateChannelRequest request,
            Authentication authentication) {

        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        if (channelService.userHasChannel(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        GetChannelResponse channel = channelService.createChannel(request, userId);

        return ResponseEntity.status(HttpStatus.OK).body(channel);
    }

    @GetMapping("/hasChannel")
    @PreAuthorize("hasRole('USER')")
    public boolean hasChannel(Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        return channelService.userHasChannel(userId);
    }

    @GetMapping("/getChannelById")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetChannelResponse> getChannelIdByUserId(Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        GetChannelResponse response = channelService.getChannelIdByUserId(userId);

        return ResponseEntity.ok(response);
    }

}
