package com.example.maisonderenard.web.controllers;

import com.example.maisonderenard.dto.domain.ChatRequestDto;
import com.example.maisonderenard.dto.domain.DisplayProductDto;
import com.example.maisonderenard.service.application.ProductApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ProductApplicationService productApplicationService;
    private final RestTemplate restTemplate;

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequestDto request) {
        List<DisplayProductDto> products = productApplicationService.findAll();

        String productsInfo = products.stream()
                .map(p -> String.format(
                        "[ID:%d] %s | €%d | Category:%s | Color:%s | Season:%s | Material:%s | Gender:%s | Style:%s | Sizes:%s | %s",
                        p.getId(),
                        p.getName(),
                        p.getPrice().intValue(),
                        p.getCategoryName(),
                        p.getColor() != null ? p.getColor() : "N/A",
                        p.getSeason() != null ? p.getSeason() : "N/A",
                        p.getMaterial() != null ? p.getMaterial() : "N/A",
                        p.getGender() != null ? p.getGender() : "N/A",
                        p.getStyle() != null ? p.getStyle() : "N/A",
                        p.getSize() != null ? p.getSize() : "N/A",
                        p.getDescription() != null ? p.getDescription().substring(0, Math.min(80, p.getDescription().length())) : ""
                ))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
            You are an elegant luxury fashion assistant for Maison de Renard - an Italian luxury brand.
            
            LANGUAGE RULE: Respond in Macedonian if the user writes in Macedonian, in English if they write in English.
            
            PERSONALITY: Warm, sophisticated, knowledgeable about luxury fashion. Never robotic.
            
            PRODUCT RECOMMENDATIONS: When recommending products, always include their ID in this exact format: [PRODUCT_ID:123]
            Example: "Ви препорачувам Essential Merino Turtleneck [PRODUCT_ID:38] - совршен за зимски денови!"
            
            You can filter and recommend based on:
            - Season (WINTER, SUMMER, SPRING, ALL_SEASON)
            - Gender (MEN, WOMEN, UNISEX)
            - Style (FORMAL, CASUAL, SPORT)
            - Material (Cashmere, Merino Wool, Leather, Silk...)
            - Color preferences
            - Price range
            - Category (Men, Women, Gifts, Essentials)
            
            Keep responses concise (max 3-4 sentences). Recommend max 3 products at a time.
                
            IMPORTANT RULES:
            - Always speak positively about ALL products
            - Never say a product is expensive, instead say "exceptional value"
            - Never compare products negatively
            - Always highlight the luxury and quality
            - If a product doesn't match perfectly, still recommend the closest match positively
            - Never say "we don't have" - instead say "our closest match is..."
            - Never mention that a product has null or missing attributes
            
            AVAILABLE PRODUCTS:
            """ + productsInfo;

        List<Map<String, String>> messages = new ArrayList<>();

        if (request.getConversationHistory() != null) {
            for (ChatRequestDto.ChatMessageDto msg : request.getConversationHistory()) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }
        }
        messages.add(Map.of("role", "user", "content", request.getMessage()));

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-sonnet-4-20250514");
        body.put("max_tokens", 1024);
        body.put("system", systemPrompt);
        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(ANTHROPIC_URL, entity, Map.class);

            List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
            String reply = (String) content.get(0).get("text");

            List<Long> mentionedIds = new ArrayList<>();
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\[PRODUCT_ID:(\\d+)\\]");
            java.util.regex.Matcher matcher = pattern.matcher(reply);
            while (matcher.find()) {
                mentionedIds.add(Long.parseLong(matcher.group(1)));
            }

            List<DisplayProductDto> mentionedProducts = products.stream()
                    .filter(p -> mentionedIds.contains(p.getId()))
                    .collect(Collectors.toList());

            String cleanReply = reply.replaceAll("\\[PRODUCT_ID:\\d+\\]", "").trim();

            Map<String, Object> result = new HashMap<>();
            result.put("reply", cleanReply);
            result.put("products", mentionedProducts);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("reply", "Извинете, моментално не можам да одговорам. Обидете се повторно!");
            error.put("products", List.of());
            return ResponseEntity.ok(error);
        }
    }
}