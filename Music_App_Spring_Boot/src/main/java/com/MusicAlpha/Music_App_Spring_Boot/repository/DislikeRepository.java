package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Dislike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DislikeRepository extends JpaRepository<Dislike, UUID> {
    boolean existsByUserIdAndVideoId(UUID userId, UUID videoId);
    Dislike findByUserIdAndVideoId(UUID userId, UUID videoId);
    int countByVideoId(UUID videoId);
}
