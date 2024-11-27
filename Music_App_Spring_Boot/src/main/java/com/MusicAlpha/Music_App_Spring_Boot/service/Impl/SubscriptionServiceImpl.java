package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.CountChannelDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.GetSubscribeForUserResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.subsriptiondto.SubscriptionResponse;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Channel;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Subscription;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.repository.ChannelRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.SubscriptionRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.UserRepository;
import com.MusicAlpha.Music_App_Spring_Boot.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Transactional
    @Override
    public String subscribeToChannel(SubscriptionResponse subscriptionResponse) {

        User user = userRepository.findById(subscriptionResponse.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Channel channel = channelRepository.findById(subscriptionResponse.getChannelId())
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        if (subscriptionRepository.existsByUserIdAndChannelId(subscriptionResponse.getUserId(), subscriptionResponse.getChannelId())) {
            return "User is already subscribed to this channel.";
        }

        Subscription subscription = new Subscription(user, channel);
        subscription.setSubscriptionDate(LocalDateTime.now());

        subscriptionRepository.save(subscription);

        return "Successfully subscribed to channel: " + channel.getChannel();
    }

    @Transactional
    @Override
    public String unsubscribeFromChannel(SubscriptionResponse subscriptionResponse) {

        Channel channel = channelRepository.findById(subscriptionResponse.getChannelId())
                .orElseThrow(() -> new RuntimeException("Channel not found"));


        Subscription subscription = subscriptionRepository.findByUserIdAndChannelId(subscriptionResponse.getUserId(), subscriptionResponse.getChannelId());
        if (subscription == null) {
            return "No active subscription found for the user on this channel.";
        }

        subscriptionRepository.delete(subscription);

        return "Successfully unsubscribed from channel: " + channel.getChannel();
    }

    @Override
    public boolean isSubscribed(UUID userId, UUID channelId) {
        return subscriptionRepository.existsByUserIdAndChannelId(userId, channelId);
    }

    @Override
    public CountChannelDto getCountSubscribes(UUID channelId) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        int countSub = subscriptionRepository.countByChannel(channel);
        return new CountChannelDto(countSub);
    }

    @Override
    public List<GetSubscribeForUserResponse> getSubscriptionByUser(UUID userId) {
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(userId);

        return subscriptions.stream()
                .map(sub -> {
                    Channel channel = sub.getChannel();
                    User user = channel.getUser();

                    UUID channelId = channel.getId();

                    String imageProfile = Optional.ofNullable(user.getPicture())
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);
                    String firstName = user.getFirstName();
                    String lastName = user.getLastName();

                    String channelName = channel.getChannel();

                    Integer counter = subscriptionRepository.countByChannel(channel);

                    LocalDateTime subscriptionDate = sub.getSubscriptionDate();

                    return new GetSubscribeForUserResponse(firstName, lastName, imageProfile, channelName, counter, subscriptionDate, userId, channelId);
                }) .collect(Collectors.toList());
    }
}
