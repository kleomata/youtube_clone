package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto.CountUserViewDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto.ViewVideoDto;
import org.springframework.security.core.Authentication;

import java.util.Optional;
import java.util.UUID;

public interface ViewService {

    void increaseViewCount(ViewVideoDto viewVideoDto, Authentication authentication);

    Optional<Long> getTotalViewCountForVideo(UUID videoId);

    CountUserViewDto getViewCountForUserInVideo(UUID videoId, Authentication authentication);
}