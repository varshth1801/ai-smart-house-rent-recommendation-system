package com.smartrent.service;

import com.smartrent.entity.Notification;
import com.smartrent.entity.User;
import com.smartrent.repository.NotificationRepository;
import com.smartrent.websocket.NotificationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Notification sendNotification(User recipient, String title, String message, String type, String link) {
        Notification notification = new Notification(recipient, title, message, type, link);
        Notification saved = notificationRepository.save(notification);

        // Push real-time alert via WebSocket STOMP topic
        try {
            NotificationMessage wsMsg = new NotificationMessage(
                    recipient.getEmail(),
                    title,
                    message,
                    type,
                    link
            );
            messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), wsMsg);
            messagingTemplate.convertAndSend("/topic/notifications", wsMsg);
        } catch (Exception e) {
            logger.warn("WebSocket push failed for notification {}: {}", saved.getId(), e.getMessage());
        }

        return saved;
    }

    public List<Notification> getUserNotifications(Long recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    public long getUnreadCount(Long recipientId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipientId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long recipientId) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
        list.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(list);
    }
}
