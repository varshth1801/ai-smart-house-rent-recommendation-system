package com.smartrent.websocket;

import java.time.LocalDateTime;

public class NotificationMessage {
    private String recipientEmail;
    private String title;
    private String message;
    private String type;
    private String link;
    private LocalDateTime timestamp = LocalDateTime.now();

    public NotificationMessage() {}

    public NotificationMessage(String recipientEmail, String title, String message, String type, String link) {
        this.recipientEmail = recipientEmail;
        this.title = title;
        this.message = message;
        this.type = type;
        this.link = link;
    }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
