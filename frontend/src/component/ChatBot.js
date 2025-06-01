import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Badge, Container, Row, Col } from 'react-bootstrap';
import './ChatBot.css'; // We'll create this CSS file

const ChatBot = ({botAnswer, onUserQuery}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm here to help you find the perfect products. What are you looking for today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (botAnswer.answer) {
            const botResponse = {
                id: botAnswer.id + Math.random(),
                text: botAnswer.answer,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
            if (!isOpen) setUnreadCount(prev => prev + 1);
        }
        // eslint-disable-next-line
    }, [botAnswer]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        if (inputMessage) {
            onUserQuery(inputMessage);
            // setIsTyping(false);
        }
        setInputMessage('');
        
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container">
                    <Card className="chatbot-card shadow-lg">
                        <Card.Header className="chatbot-header">
                            <Container fluid>
                                <Row className="align-items-center">
                                    <Col xs="auto">
                                        <div className="chatbot-avatar me-2">
                                            <i className="fas fa-robot"></i>
                                        </div>
                                    </Col>
                                    <Col>
                                        <h6 className="mb-0 text-white">Shopping Assistant</h6>
                                        <small className="text-white-50">Online now</small>
                                    </Col>
                                    <Col xs="auto">
                                        <Button
                                            variant="link"
                                            className="text-white p-0"
                                            onClick={toggleChat}
                                        >
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Header>

                        <Card.Body className="chatbot-messages p-0">
                            <div className="messages-container">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                                    >
                                        <div className="message-bubble">
                                            <p className="mb-1">{message.text}</p>
                                            <small className="message-time">
                                                {formatTime(message.timestamp)}
                                            </small>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="message bot-message">
                                        <div className="message-bubble typing-indicator">
                                            <div className="typing-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </Card.Body>

                        <Card.Footer className="chatbot-footer p-2">
                            <Container fluid>
                                <Form onSubmit={handleSendMessage}>
                                    <Row className="g-2">
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Type your message..."
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                className="chatbot-input"
                                            />
                                        </Col>
                                        <Col xs="auto">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="chatbot-send-btn"
                                                disabled={!inputMessage.trim()}
                                            >
                                                <i className="fas fa-paper-plane"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card.Footer>
                    </Card>
                </div>
            )}

            {/* Chat Toggle Button */}
            <div className="chatbot-toggle" onClick={toggleChat}>
                <div className="chatbot-icon">
                    {isOpen ? (
                        <i className="fas fa-times"></i>
                    ) : (
                        <>
                            {/* <i className="fas fa-comments"></i> */}
                                <i class="fa-solid fa-robot"></i>
                            {unreadCount > 0 && (
                                <Badge
                                    bg="danger"
                                    className="chatbot-badge"
                                    pill
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatBot;