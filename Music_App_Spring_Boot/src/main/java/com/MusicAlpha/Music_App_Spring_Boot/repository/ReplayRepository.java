package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Replay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReplayRepository extends JpaRepository<Replay, UUID> {

    List<Replay> findByVideoIdAndCommentId(UUID videoId, UUID commentId);

}
