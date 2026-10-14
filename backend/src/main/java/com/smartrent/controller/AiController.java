package com.smartrent.controller;

import com.smartrent.ai.AiService;
import com.smartrent.dto.*;
import com.smartrent.entity.Property;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommendations")
    public ResponseEntity<List<AiRecommendationResponse>> getRecommendations(
            @RequestBody(required = false) AiRecommendationRequest request) {
        if (request == null) {
            request = new AiRecommendationRequest();
        }
        return ResponseEntity.ok(aiService.getRecommendations(request));
    }

    @PostMapping("/predict-price")
    public ResponseEntity<PricePredictionResponse> predictRentalPrice(
            @RequestBody PricePredictionRequest request) {
        return ResponseEntity.ok(aiService.predictRentalPrice(request));
    }

    @PostMapping("/natural-search")
    public ResponseEntity<List<Property>> searchNaturalLanguage(
            @RequestBody AiNaturalSearchRequest request) {
        String query = request != null ? request.getQuery() : "";
        return ResponseEntity.ok(aiService.searchNaturalLanguage(query));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatbotResponse> chatWithAi(
            @RequestBody ChatbotRequest request) {
        return ResponseEntity.ok(aiService.askChatbot(request));
    }

    @PostMapping("/compare")
    public ResponseEntity<PropertyComparisonResponse> compareProperties(
            @RequestBody PropertyComparisonRequest request) {
        return ResponseEntity.ok(aiService.compareProperties(request));
    }
}
