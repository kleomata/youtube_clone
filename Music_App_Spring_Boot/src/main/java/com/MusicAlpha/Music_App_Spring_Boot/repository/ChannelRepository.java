package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Channel;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, UUID> {
    //Optional<Channel> findByChannelId(UUID channelId);
    //Optional<Channel> findByUserId(UUID userId);

    Optional<Channel> findByUser(User user);
    Optional<Channel> findByChannel(String channel);

    boolean existsByUserId(UUID userId);

    Optional<Channel> findByUserId(UUID userId);
}
