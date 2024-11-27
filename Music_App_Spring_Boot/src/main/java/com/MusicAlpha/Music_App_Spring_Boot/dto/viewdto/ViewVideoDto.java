package com.MusicAlpha.Music_App_Spring_Boot.dto.viewdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewVideoDto {

    private UUID userId;
    private UUID videoId;
    private long timeViewedInSeconds;

}
