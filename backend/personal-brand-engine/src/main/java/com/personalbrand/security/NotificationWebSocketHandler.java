package com.personalbrand.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@Slf4j
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private static final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        log.info("WebSocket connection established: {}", session.getId());
        try {
            session.sendMessage(new TextMessage("{\"type\":\"INFO\",\"message\":\"Connected to BrandEngine.AI Notification Service\"}"));
        } catch (IOException e) {
            log.error("Failed to send welcome message: {}", e.getMessage());
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.info("Received WebSocket message: {}", message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        log.info("WebSocket connection closed: {}", session.getId());
    }

    /**
     * Broadcasts a real-time notification to all active frontend web socket connections.
     */
    public static void sendNotification(String type, String message) {
        String payload = String.format("{\"type\":\"%s\",\"message\":\"%s\"}", type, message.replace("\"", "\\\""));
        log.info("Broadcasting WebSocket notification: {}", payload);
        TextMessage textMessage = new TextMessage(payload);
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(textMessage);
                } catch (IOException e) {
                    log.error("Failed to send message to session {}: {}", session.getId(), e.getMessage());
                }
            }
        }
    }
}
