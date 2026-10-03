package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequestDto {
    private String message;//poslednata poraka pratena od korisnikot
    private List<ChatMessageDto> conversationHistory;
    private List<String> viewedProducts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatMessageDto {
        private String role;//user ili assistant vo zavisnost koj pisuva
        private String content;//poraki prateni vo chatot{tekstot}
    }
}