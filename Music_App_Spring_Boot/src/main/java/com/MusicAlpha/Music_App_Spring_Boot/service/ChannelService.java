package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto.CreateChannelRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto.GetChannelResponse;

import java.util.UUID;

public interface ChannelService {

    GetChannelResponse createChannel(CreateChannelRequest request, UUID userId);

    boolean userHasChannel(UUID userId);

    GetChannelResponse getChannelIdByUserId(UUID userId);
}
