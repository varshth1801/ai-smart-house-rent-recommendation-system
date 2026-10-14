package com.smartrent.dto;

import com.smartrent.entity.Property;
import java.util.ArrayList;
import java.util.List;

public class AiRecommendationResponse {
    private Property property;
    private int matchPercentage;       // e.g. 94%
    private int budgetScore;           // e.g. 98%
    private int locationScore;         // e.g. 90%
    private int lifestyleScore;        // e.g. 92%
    private int amenitiesScore;        // e.g. 95%
    private int safetyScore;           // e.g. 88%
    private String primaryMatchReason;
    private List<String> highlightPoints = new ArrayList<>();
    private List<String> considerations = new ArrayList<>();
    private String aiVerdict;

    public AiRecommendationResponse() {}

    public AiRecommendationResponse(Property property) {
        this.property = property;
    }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public int getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }

    public int getBudgetScore() { return budgetScore; }
    public void setBudgetScore(int budgetScore) { this.budgetScore = budgetScore; }

    public int getLocationScore() { return locationScore; }
    public void setLocationScore(int locationScore) { this.locationScore = locationScore; }

    public int getLifestyleScore() { return lifestyleScore; }
    public void setLifestyleScore(int lifestyleScore) { this.lifestyleScore = lifestyleScore; }

    public int getAmenitiesScore() { return amenitiesScore; }
    public void setAmenitiesScore(int amenitiesScore) { this.amenitiesScore = amenitiesScore; }

    public int getSafetyScore() { return safetyScore; }
    public void setSafetyScore(int safetyScore) { this.safetyScore = safetyScore; }

    public String getPrimaryMatchReason() { return primaryMatchReason; }
    public void setPrimaryMatchReason(String primaryMatchReason) { this.primaryMatchReason = primaryMatchReason; }

    public List<String> getHighlightPoints() { return highlightPoints; }
    public void setHighlightPoints(List<String> highlightPoints) { this.highlightPoints = highlightPoints; }

    public List<String> getConsiderations() { return considerations; }
    public void setConsiderations(List<String> considerations) { this.considerations = considerations; }

    public String getAiVerdict() { return aiVerdict; }
    public void setAiVerdict(String aiVerdict) { this.aiVerdict = aiVerdict; }
}
