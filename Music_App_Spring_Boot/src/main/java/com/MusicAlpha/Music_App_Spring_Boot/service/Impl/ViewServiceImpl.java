package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto.CountUserViewDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto.ViewVideoDto;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import com.MusicAlpha.Music_App_Spring_Boot.entity.View;
import com.MusicAlpha.Music_App_Spring_Boot.repository.UserRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.VideoRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.ViewRepository;
import com.MusicAlpha.Music_App_Spring_Boot.service.ViewService;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ViewServiceImpl implements ViewService {

    private static final Logger logger = LoggerFactory.getLogger(ViewServiceImpl.class);


    @Autowired
    private ViewRepository viewRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public void increaseViewCount(ViewVideoDto viewVideoDto, Authentication authentication) {

        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        UUID videoId = viewVideoDto.getVideoId();
        //User user = userRepository.findById(userId)
          //      .orElseThrow(() -> new RuntimeException("User not found"));

        //Video video = videoRepository.findById(viewVideoDto.getVideoId())
          //      .orElseThrow(() -> new RuntimeException("Video not found"));

        View view = viewRepository.findByUserIdAndVideoId(userId, viewVideoDto.getVideoId())
                .orElse(null);
        //.orElseThrow(() -> new RuntimeException("View not found"));

        long timeViewedInSeconds = viewVideoDto.getTimeViewedInSeconds();


        if (view != null) {
            LocalDateTime lastViewedAt = view.getViewedAt();
            Duration duration = Duration.between(lastViewedAt, LocalDateTime.now());
            long hoursElapsed = duration.toHours();

            if (hoursElapsed >= 3 && viewVideoDto.getTimeViewedInSeconds() >= 10) {
                view.setViewCount(view.getViewCount() + 1);
                view.setViewedAt(LocalDateTime.now());
                viewRepository.save(view);
                logger.info("View count increased for video {}", videoId);
            } else {
                if (hoursElapsed < 3) {
                    logger.info("User {} tried to view video {} before 3 hours elapsed since last view", userId, videoId);
                }
                if (timeViewedInSeconds < 10) {
                    logger.info("User {} watched video {} for less than 10 seconds", userId, videoId);
                }
            }
        } else {
            View newView = new View();
            newView.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
            newView.setVideo(videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("Video not found")));
            newView.setViewedAt(LocalDateTime.now());
            newView.setViewCount(1L);

            viewRepository.save(newView);
            logger.info("New view created for video {}", videoId);
        }
    }

    @Override
    public Optional<Long> getTotalViewCountForVideo(UUID videoId) {
        return viewRepository.getTotalViewCountFromVideo(videoId);
    }

    @Override
    public CountUserViewDto getViewCountForUserInVideo(UUID videoId, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        Optional<View> view = viewRepository.findByUserIdAndVideoId(userId, videoId);
        Long countViewUser = view.map(View::getViewCount)
                .orElse(0L);

        return new CountUserViewDto(countViewUser);
    }


}
