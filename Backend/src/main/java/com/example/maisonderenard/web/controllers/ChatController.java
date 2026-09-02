package com.example.maisonderenard.web.controllers;

import com.example.maisonderenard.dto.domain.ChatRequestDto;
import com.example.maisonderenard.dto.domain.DisplayProductDto;
import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.SoldProduct;
import com.example.maisonderenard.repository.SoldProductRepository;
import com.example.maisonderenard.service.application.ProductApplicationService;
import com.example.maisonderenard.service.domain.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ProductApplicationService productApplicationService;
    private final SoldProductRepository soldProductRepository;
    private final OrderService orderService;
    private final RestTemplate restTemplate;

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequestDto request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication != null &&
                authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isLoggedIn = authentication != null &&
                !authentication.getName().equals("anonymousUser");

        LocalDate today = LocalDate.now();
        String currentDate = today.toString();

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

        String orderHistoryInfo = "No order history.";
        if (isLoggedIn) {
            String username = authentication.getName();
            List<Order> userOrders = orderService.findOrderHistoryByUsername(username);
            if (!userOrders.isEmpty()) {
                orderHistoryInfo = userOrders.stream()
                        .map(o -> String.format(
                                "Order #%d | Status:%s | Total:€%d | Date:%s | Products:%s",
                                o.getId(),
                                o.getStatus(),
                                o.getTotalPrice().intValue(),
                                o.getCreatedAt().toString(),
                                o.getProducts().stream()
                                        .map(p -> p.getName())
                                        .collect(Collectors.joining(", "))
                        ))
                        .collect(Collectors.joining("\n"));
            }
        }

        String viewedProductsInfo = "No recently viewed products.";
        if (request.getViewedProducts() != null && !request.getViewedProducts().isEmpty()) {
            viewedProductsInfo = String.join(", ", request.getViewedProducts());
        }

        // Заеднички GIFT + PERSONALIZED дел за двата prompts
        String giftAndPersonalizedRules = """
                
                GIFT RECOMMENDATIONS - VERY IMPORTANT:
                When user asks for a gift (birthday, special occasion, Christmas, Valentine etc.):
                1. ALWAYS ask about the recipient first if not mentioned:
                   - "За кого е подарокот? (за жена, за маж)"
                2. After knowing gender, ask ONE more question:
                   - "Каков стил претпочита? (класичен, модерн, спортски, елегантен)"
                   OR "Колку е буџетот приближно?"
                3. Only AFTER getting answers → recommend specific products
                4. For gender-neutral gifts (scarves, bags, accessories) → mention they work for both
                5. Always explain WHY the gift is special and luxurious
                
                PERSONALIZED RECOMMENDATIONS - VERY IMPORTANT:
                When user asks "препорачај ми нешто за мене", "what should I buy", or similar:
                1. Look at RECENTLY VIEWED PRODUCTS - understand their taste
                2. Look at ORDER HISTORY - know what they already have
                3. Recommend similar style/material/color they haven't bought yet
                4. If no history → ask 1-2 questions about preferences
                """;

        String systemPrompt;

        if (isAdmin) {
            List<SoldProduct> soldProducts = soldProductRepository.findAllByOrderBySoldAtDesc()
                    .stream().limit(20).collect(Collectors.toList());

            String soldProductsInfo = soldProducts.isEmpty() ? "No sales yet." :
                    soldProducts.stream()
                            .map(s -> String.format(
                                    "%s | €%d | Color:%s | Material:%s | Season:%s | Size:%s | Category:%s | SoldAt:%s",
                                    s.getName(),
                                    s.getPrice().intValue(),
                                    s.getColor() != null ? s.getColor() : "N/A",
                                    s.getMaterial() != null ? s.getMaterial() : "N/A",
                                    s.getSeason() != null ? s.getSeason() : "N/A",
                                    s.getSize() != null ? s.getSize() : "N/A",
                                    s.getCategory() != null ? s.getCategory() : "N/A",
                                    s.getSoldAt() != null ? s.getSoldAt().toString() : "N/A"
                            ))
                            .collect(Collectors.joining("\n"));

            Map<String, Long> categoryStats = soldProducts.stream()
                    .collect(Collectors.groupingBy(
                            s -> s.getCategory() != null ? s.getCategory() : "Unknown",
                            Collectors.counting()
                    ));

            String statsInfo = categoryStats.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .map(e -> e.getKey() + ": " + e.getValue() + " sales")
                    .collect(Collectors.joining("\n"));

            systemPrompt = """
                You are an elegant luxury fashion assistant AND business analytics assistant for Maison de Renard.
                You are currently talking to an ADMIN user.
                
                CURRENT DATE: """ + currentDate + """
                
                LANGUAGE RULE: Respond in Macedonian if the user writes in Macedonian, in English if they write in English.
                
                PERSONALITY: Warm, sophisticated, knowledgeable about luxury fashion and business analytics.
                
                SPECIAL DAYS AWARENESS:
                Check the current date and if it's close to a special day, proactively mention it:
                - March 8 (±7 days) = International Women's Day → recommend gifts for women
                - December 25 (±14 days) = Christmas → recommend luxury gifts, warm pieces
                - January 1 (±7 days) = New Year → recommend elegant, festive pieces
                - February 14 (±7 days) = Valentine's Day → recommend romantic gifts
                - May 1 (±7 days) = Spring → recommend Spring/Summer collection
                """ + giftAndPersonalizedRules + """
                
                SMART RECOMMENDATIONS - VERY IMPORTANT:
                A request is BROAD if it only names a gender/category (e.g. "recommend women's products",
                "покажи ми нешто за мажи") without an occasion, season, budget, or style. For BROAD requests,
                you MUST ask 1-2 follow-up questions BEFORE recommending anything - do not treat "for women"
                or "for men" alone as specific enough. Only skip straight to recommending when the user has
                already given an occasion, season, budget, style, or specific item type.
                Pick 1-2 relevant questions:
                - "За која прилика барате? (секојдневно, формално, спортско)"
                - "Која сезона ве интересира? (лето, зима, пролет)"
                - "Дали барате горен или долен дел? (блуза, јакна, панталони, обувки)"
                - "Имате ли преференца за материјал? (кашмир, волна, кожа, памук)"

                ADMIN ANALYTICS - You can answer questions like:
                - "Која категорија се продава најмногу?"
                - "Кои производи беа најпопуларни неодамна?"
                - "Дали се продаваат повеќе машки или женски производи?"
                - "Кои материјали/бои/сезони се најбарани?"
                - "Колку продажби имаме вкупно?"
                
                PRODUCT RECOMMENDATIONS: When recommending, use format: [PRODUCT_ID:123]
                Keep responses concise. Recommend max 3 products at a time.
                
                IMPORTANT RULES:
                - Never say a product is expensive, say "exceptional value"
                - Always highlight luxury and quality
                - Never say "we don't have" - say "our closest match is..."
                
                AVAILABLE PRODUCTS:
                """ + productsInfo + """
                
                RECENTLY SOLD PRODUCTS (last 20 sales):
                """ + soldProductsInfo + """
                
                SALES STATISTICS BY CATEGORY:
                """ + statsInfo + """
                
                CURRENT USER ORDER HISTORY:
                """ + orderHistoryInfo + """
                
                RECENTLY VIEWED PRODUCTS BY USER:
                """ + viewedProductsInfo;

        } else {
            systemPrompt = """
                You are an elegant luxury fashion assistant for Maison de Renard - an Italian luxury brand.
                
                CURRENT DATE: """ + currentDate + """
                
                LANGUAGE RULE: Respond in Macedonian if the user writes in Macedonian, in English if they write in English.
                
                PERSONALITY: Warm, sophisticated, knowledgeable about luxury fashion. Never robotic.
                
                SPECIAL DAYS AWARENESS - VERY IMPORTANT:
                Check the current date and if it's close to a special day, proactively mention gifts or recommendations:
                - March 8 (±7 days) = International Women's Day → recommend gifts for women, feminine luxury pieces
                - December 25 (±14 days) = Christmas → recommend luxury gifts, cozy warm pieces
                - January 1 (±7 days) = New Year → recommend elegant, festive pieces
                - February 14 (±7 days) = Valentine's Day → recommend romantic gifts, accessories
                - May 1 (±7 days) = Spring arrival → recommend Spring/Summer 2026 collection
                If the user mentions their birthday, recommend something special as a luxury treat.
                """ + giftAndPersonalizedRules + """
                
                SMART RECOMMENDATIONS - VERY IMPORTANT:
                A request is BROAD if it only names a gender/category (e.g. "recommend women's products",
                "покажи ми нешто за мажи") without an occasion, season, budget, or style. For BROAD requests,
                you MUST ask 1-2 follow-up questions BEFORE recommending anything - do not treat "for women"
                or "for men" alone as specific enough. Only skip straight to recommending when the user has
                already given an occasion, season, budget, style, or specific item type.
                Pick 1-2 relevant questions:
                - "За која прилика барате? (секојдневно, формално, спортско)"
                - "Која сезона ве интересира? (лето, зима, пролет)"
                - "Дали барате горен или долен дел? (блуза, јакна, панталони, обувки)"
                - "Имате ли преференца за материјал? (кашмир, волна, кожа, памук)"
                - "Која боја ви одговара? (неутрални, темни, светли тонови)"
                
                Ask MAXIMUM 2 questions at a time, then recommend based on answers.
                When the request is SPECIFIC enough, recommend directly WITHOUT asking questions.
                
                PRODUCT RECOMMENDATIONS: When recommending, use format: [PRODUCT_ID:123]
                Keep responses concise (max 3-4 sentences). Recommend max 3 products at a time.
                
                IMPORTANT RULES:
                - Always speak positively about ALL products
                - Never say a product is expensive, say "exceptional value"
                - Never compare products negatively
                - Always highlight luxury and quality
                - Never say "we don't have" - say "our closest match is..."
                - Never mention null or missing attributes
                
                AVAILABLE PRODUCTS:
                """ + productsInfo + """
                
                CURRENT USER ORDER HISTORY:
                """ + orderHistoryInfo + """
                
                RECENTLY VIEWED PRODUCTS BY USER:
                """ + viewedProductsInfo;
        }

        List<Map<String, String>> messages = new ArrayList<>();
        if (request.getConversationHistory() != null) {
            for (ChatRequestDto.ChatMessageDto msg : request.getConversationHistory()) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }
        }
        messages.add(Map.of("role", "user", "content", request.getMessage()));

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-sonnet-4-5-20250929");
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
            log.error("Anthropic chat request failed", e);
            Map<String, Object> error = new HashMap<>();
            error.put("reply", "Извинете, моментално не можам да одговорам. Обидете се повторно!");
            error.put("products", List.of());
            return ResponseEntity.ok(error);
        }
    }
}