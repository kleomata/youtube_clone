package com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.likedto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class AddLikeRequest {

    private UUID userId;
    private UUID videoId;

}
