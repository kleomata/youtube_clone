package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.CountChannelDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.GetSubscribeForUserResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.SubscriptionResponse;

import java.util.List;
import java.util.UUID;

public interface SubscriptionService {
    String subscribeToChannel(SubscriptionResponse subscriptionResponse);
    String unsubscribeFromChannel(SubscriptionResponse subscriptionResponse);
    boolean isSubscribed(UUID userId, UUID channelId);
    CountChannelDto getCountSubscribes(UUID channelId);

    List<GetSubscribeForUserResponse> getSubscriptionByUser(UUID userId);
}
