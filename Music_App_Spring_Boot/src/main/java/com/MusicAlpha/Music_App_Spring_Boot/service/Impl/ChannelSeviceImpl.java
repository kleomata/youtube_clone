package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto.CreateChannelRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto.GetChannelResponse;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Channel;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.repository.ChannelRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.UserRepository;
import com.MusicAlpha.Music_App_Spring_Boot.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ChannelSeviceImpl implements ChannelService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChannelRepository channelRepository;


    @Override
    public GetChannelResponse createChannel(CreateChannelRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        Optional<Channel> existingChannel = channelRepository.findByUser(user);
        if (existingChannel.isPresent()) {
            System.out.println("Is one channel");
            Channel channel = existingChannel.get();
            return new GetChannelResponse(
                    channel.getId(),
                    channel.getChannel(),
                    user.getId()
            );
        }

        Optional<Channel> channelWithSameUsername = channelRepository.findByChannel(request.getChannel());
        if (channelWithSameUsername.isPresent()) {
            throw new RuntimeException("Channel name is alredy taken");
        }

        Channel channel = new Channel();
        channel.setChannel(request.getChannel());
        channel.setUser(user);


        channelRepository.save(channel);

        return new GetChannelResponse(
                channel.getId(),
                channel.getChannel(),
                user.getId()
        );
    }

    @Override
    public boolean userHasChannel(UUID userId) {
        return channelRepository.existsByUserId(userId);
    }

    @Override
    public GetChannelResponse getChannelIdByUserId(UUID userId) {
        Channel channel = channelRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Channel not found for user"));

        System.out.println("Channel ID: " + channel.getId()); // Logoni channelId

        return new GetChannelResponse(channel.getId(), channel.getChannel(), channel.getUser().getId());
    }


}
