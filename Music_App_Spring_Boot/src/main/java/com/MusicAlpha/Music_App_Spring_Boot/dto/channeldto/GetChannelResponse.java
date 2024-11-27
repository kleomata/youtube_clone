package com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class GetChannelResponse {

    private UUID id;
    private String channel;
    private UUID userId;

    public GetChannelResponse(UUID id, String channel, UUID userId) {
        this.id = id;
        this.channel = channel;
        this.userId = userId;
    }
}
