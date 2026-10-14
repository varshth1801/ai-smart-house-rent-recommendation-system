package com.smartrent.dto;

import com.smartrent.entity.Property;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PropertyComparisonResponse {
    private List<Property> properties = new ArrayList<>();
    private Long recommendedWinnerId;
    private String winnerTitle;
    private String winnerReason;
    private String executiveSummary;
    private Map<Long, List<String>> propertyPros = new HashMap<>();
    private Map<Long, List<String>> propertyCons = new HashMap<>();
    private Map<Long, Double> valueForMoneyScores = new HashMap<>();

    public PropertyComparisonResponse() {}

    public List<Property> getProperties() { return properties; }
    public void setProperties(List<Property> properties) { this.properties = properties; }

    public Long getRecommendedWinnerId() { return recommendedWinnerId; }
    public void setRecommendedWinnerId(Long recommendedWinnerId) { this.recommendedWinnerId = recommendedWinnerId; }

    public String getWinnerTitle() { return winnerTitle; }
    public void setWinnerTitle(String winnerTitle) { this.winnerTitle = winnerTitle; }

    public String getWinnerReason() { return winnerReason; }
    public void setWinnerReason(String winnerReason) { this.winnerReason = winnerReason; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public Map<Long, List<String>> getPropertyPros() { return propertyPros; }
    public void setPropertyPros(Map<Long, List<String>> propertyPros) { this.propertyPros = propertyPros; }

    public Map<Long, List<String>> getPropertyCons() { return propertyCons; }
    public void setPropertyCons(Map<Long, List<String>> propertyCons) { this.propertyCons = propertyCons; }

    public Map<Long, Double> getValueForMoneyScores() { return valueForMoneyScores; }
    public void setValueForMoneyScores(Map<Long, Double> valueForMoneyScores) { this.valueForMoneyScores = valueForMoneyScores; }
}
