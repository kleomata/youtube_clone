package com.MusicAlpha.Music_App_Spring_Boot.dto.channeldto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class CreateChannelRequest {

    private String channel;
}
