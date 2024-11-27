package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.View;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ViewRepository extends JpaRepository<View, UUID> {
    Optional<View> findByUserIdAndVideoId(UUID userId, UUID videoId);

    @Query("SELECT SUM(v.viewCount) FROM View v WHERE v.video.id = :videoId")
    Optional<Long> getTotalViewCountFromVideo(UUID videoId);


}
