package com.smartrent.dto;

import java.util.List;

public class ChatbotRequest {
    private String message;
    private Long propertyId; // Optional property context if chatting on a property page
    private List<ChatMessage> history;

    public ChatbotRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public List<ChatMessage> getHistory() { return history; }
    public void setHistory(List<ChatMessage> history) { this.history = history; }

    public static class ChatMessage {
        private String role; // "user" or "assistant"
        private String content;

        public ChatMessage() {}
        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
