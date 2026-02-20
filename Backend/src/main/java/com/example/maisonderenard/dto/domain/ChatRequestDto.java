package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequestDto {
    private String message;
    private List<ChatMessageDto> conversationHistory;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatMessageDto {
        private String role;
        private String content;
    }
}