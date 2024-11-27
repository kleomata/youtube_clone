package com.MusicAlpha.Music_App_Spring_Boot.repository;


import com.MusicAlpha.Music_App_Spring_Boot.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByVideoId(UUID videoId);

}
