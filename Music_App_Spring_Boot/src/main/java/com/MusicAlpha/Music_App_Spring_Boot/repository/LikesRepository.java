package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LikesRepository extends JpaRepository<Likes, UUID> {
    boolean existsByUserIdAndVideoId(UUID userId, UUID videoId);
    Likes findByUserIdAndVideoId(UUID userId, UUID videoId);
    int countByVideoId(UUID videoId);
}
