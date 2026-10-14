package com.smartrent.dto;

import com.smartrent.entity.Property;
import java.util.ArrayList;
import java.util.List;

public class ChatbotResponse {
    private String reply;
    private List<Property> suggestedProperties = new ArrayList<>();
    private List<String> followUpSuggestions = new ArrayList<>();
    private String confidence;

    public ChatbotResponse() {}

    public ChatbotResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<Property> getSuggestedProperties() { return suggestedProperties; }
    public void setSuggestedProperties(List<Property> suggestedProperties) { this.suggestedProperties = suggestedProperties; }

    public List<String> getFollowUpSuggestions() { return followUpSuggestions; }
    public void setFollowUpSuggestions(List<String> followUpSuggestions) { this.followUpSuggestions = followUpSuggestions; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }
}
