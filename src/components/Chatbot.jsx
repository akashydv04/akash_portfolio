import React, { useState, useEffect, useRef } from 'react';
import chatbotData from '../data/chatbotKnowledge.json';
import './Chatbot.css';

// Simple keyword matching utility
const matchKeyword = (query, keywords) => {
    const lower = query.toLowerCase();
    return keywords.some(k => lower.includes(k.toLowerCase()));
};

const getResponse = async (query) => {
    // Sanitize input to prevent injection
    const sanitized = query.replace(/[^a-zA-Z0-9 .,!?@\\-_/]/g, '').trim();
    if (!sanitized) return 'Please ask a question.';

    const lower = sanitized.toLowerCase();
    // Quick keyword answers (no API call)
    if (['about', 'who are you', 'introduce'].some(k => lower.includes(k))) {
        return `I am ${chatbotData.name}, a ${chatbotData.title}. ${chatbotData.summary}`;
    }
    if (['technology', 'tech stack', 'technologies', 'tools'].some(k => lower.includes(k))) {
        const skills = Object.entries(chatbotData.skills)
            .map(([cat, items]) => `${cat}: ${items.join(', ')}`)
            .join('\n');
        return `I work with the following technologies and tools:\n${skills}`;
    }
    if (['project', 'projects', 'show'].some(k => lower.includes(k))) {
        const projList = chatbotData.projects
            .map(p => `- ${p.title}: ${p.description} (Tech: ${p.tech.join(', ')})`)
            .join('\n');
        return `Here are some of my projects:\n${projList}`;
    }
    if (['experience', 'work', 'role'].some(k => lower.includes(k))) {
        const expList = chatbotData.experience
            .map(e => `- ${e.role} at ${e.company} (${e.period})`)
            .join('\n');
        return `My professional experience includes:\n${expList}`;
    }
    if (['contact', 'email', 'phone', 'linkedin', 'github'].some(k => lower.includes(k))) {
        const c = chatbotData.contact;
        return `You can reach me via:\nPhone: ${c.phone}\nEmail: ${c.email}\nLinkedIn: ${c.linkedin}\nGitHub: ${c.github}`;
    }
    if (['open', 'jobs', 'position', 'opportunity'].some(k => lower.includes(k))) {
        return 'I am open to new opportunities and would love to discuss how I can contribute to your team.';
    }
    if (['certification', 'certifications'].some(k => lower.includes(k))) {
        const certs = chatbotData.certifications
            .map(c => `- ${c.title} (${c.issuer})`)
            .join('\n');
        return `My certifications:\n${certs}`;
    }
    if (['achievement', 'achievements'].some(k => lower.includes(k))) {
        const ach = chatbotData.achievements.map(a => `- ${a}`).join('\n');
        return `Key achievements:\n${ach}`;
    }

    // Fallback to OpenAI for any other question
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: `You are an AI assistant for Akash Yadav. Use ONLY the following data to answer questions. If the answer cannot be derived, respond with: "This information is not available in my portfolio yet." Answer in first person, friendly, concise.` },
                    { role: 'user', content: sanitized },
                    { role: 'assistant', content: JSON.stringify(chatbotData) },
                ],
                temperature: 0,
                max_tokens: 300,
            }),
        });
        const data = await response.json();
        if (data?.choices?.[0]?.message?.content) {
            return data.choices[0].message.content.trim();
        }
        return 'This information is not available in my portfolio yet.';
    } catch (err) {
        console.error('OpenAI error:', err);
        return 'Sorry, there was an error processing your request.';
    }
};

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const lastSentRef = useRef(0);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const now = Date.now();
        // Simple rate limiting: 1 message per 2 seconds
        if (now - lastSentRef.current < 2000) {
            alert('Please wait a moment before sending another message.');
            return;
        }
        lastSentRef.current = now;
        const userMsg = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        setInput('');

        // If Tidio is already loaded and active, forward message to live chat
        if (window.tidioChatApi) {
            window.tidioChatApi.messageFromVisitor(userMsg.text);
            setLoading(false);
            return;
        }

        // Get response from AI (may be async)
        const responseText = await getResponse(userMsg.text);

        const isFallback = responseText === 'This information is not available in my portfolio yet.' ||
            responseText === 'Sorry, there was an error processing your request.';

        if (!isFallback) {
            const botReply = { sender: 'bot', text: responseText };
            setMessages(prev => [...prev, botReply]);
        }

        setLoading(false);

        // Inject Tidio live chat if fallback is triggered, but keep our UI
        if (isFallback) {
            setTimeout(() => {
                if (!document.getElementById('tidio-script')) {
                    const script = document.createElement('script');
                    script.src = '//code.tidio.co/hgajebiyweucprnlssqrggsd87pjnhfm.js';
                    script.id = 'tidio-script';
                    script.async = true;
                    // Listen for when Tidio is ready to hide its default UI
                    script.onload = () => {
                        // Polling to ensure API is ready since onload doesn't guarantee window.tidioChatApi is fully initialized
                        const checkTidio = setInterval(() => {
                            if (window.tidioChatApi) {
                                clearInterval(checkTidio);
                                window.tidioChatApi.on("ready", () => {
                                    window.tidioChatApi.hide();
                                    // Forward the initial question that triggered the fallback
                                    window.tidioChatApi.messageFromVisitor(userMsg.text);
                                });
                                // Listen for incoming messages from Tidio
                                window.tidioChatApi.on("messageFromOperator", (data) => {
                                    if (data.message && data.message.includes("If you still need help with your question")) {
                                        return;
                                    }
                                    setMessages(prev => [...prev, { sender: 'bot', text: data.message }]);
                                });
                            }
                        }, 200);
                    };
                    document.body.appendChild(script);
                }
            }, 800);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating button */}
            <button className="chatbot-toggle" onClick={() => setOpen(!open)} aria-label="Chat with Akash">
                {open ? '×' : '💬'}
            </button>

            {open && (
                <div className="chatbot-modal" role="dialog" aria-modal="true">
                    <div className="chatbot-header">
                        <h3>Ask Akash</h3>
                        <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
                    </div>
                    <div className="chatbot-body" id="chatbot-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.sender}`}> {msg.text} </div>
                        ))}
                        {loading && <div className="chat-message bot">Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <textarea
                            rows={1}
                            placeholder="Type your question..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSend} disabled={loading}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
