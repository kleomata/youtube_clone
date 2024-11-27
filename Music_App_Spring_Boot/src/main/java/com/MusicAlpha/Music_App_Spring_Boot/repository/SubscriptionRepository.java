package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Channel;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    boolean existsByUserIdAndChannelId(UUID userId, UUID channelId);
    Subscription findByUserIdAndChannelId(UUID userId, UUID channelId);
    int countByChannel(Channel channel);

    List<Subscription> findByUserId(UUID userId);

}
