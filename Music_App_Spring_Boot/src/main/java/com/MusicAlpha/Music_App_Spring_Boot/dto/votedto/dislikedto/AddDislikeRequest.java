package com.MusicAlpha.Music_App_Spring_Boot.dto.votedto.dislikedto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class AddDislikeRequest {

    private UUID userId;
    private UUID videoId;

}
