package com.MusicAlpha.Music_App_Spring_Boot.controller;

import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.CountChannelDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.GetSubscribeForUserResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.SubscriptionResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetSearchVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.service.SubscriptionService;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;


    @PostMapping("/subscribe")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> subscribeFromChannel(@RequestBody SubscriptionResponse response, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            String result = subscriptionService.subscribeToChannel(response);

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "success");
            responseMap.put("message", result);

            return ResponseEntity.ok(responseMap);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "You are not authorized to perform this action");

            return ResponseEntity.status(403).body(errorResponse);
        }
    }

    @PostMapping("/unsubscribe")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> unsubscribeFromChannel(@RequestBody SubscriptionResponse response, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            String result = subscriptionService.unsubscribeFromChannel(response);

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "success");
            responseMap.put("message", result);

            return ResponseEntity.ok(responseMap);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "You are not authorized to perform this action");

            return ResponseEntity.status(403).body(errorResponse);
        }
    }

    @GetMapping("/checkSub/{userId}/{channelId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Boolean>> checkSubscription(@PathVariable UUID userId, @PathVariable UUID channelId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        if (userId == null || channelId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        boolean isSubscribed = subscriptionService.isSubscribed(userId, channelId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isSubscribed", isSubscribed);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{channelId}/subscribers")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CountChannelDto> getSubscribers(@PathVariable UUID channelId, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            CountChannelDto count = subscriptionService.getCountSubscribes(channelId);
            return ResponseEntity.ok(count);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/userSubChannel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GetSubscribeForUserResponse>> getSubscriptionByUser(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = ((CustomUserDetails) userDetails).getUser().getId();
        List<GetSubscribeForUserResponse> subscribeForUserResponses = subscriptionService.getSubscriptionByUser(userId);
        return ResponseEntity.ok(subscribeForUserResponses);
    }

}
