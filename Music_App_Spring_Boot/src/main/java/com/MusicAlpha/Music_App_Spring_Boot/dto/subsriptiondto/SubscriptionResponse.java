package com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class SubscriptionResponse {
    private UUID userId;
    private UUID channelId;

    public SubscriptionResponse(UUID userId, UUID channelId) {
        this.userId = userId;
        this.channelId = channelId;
    }
}
