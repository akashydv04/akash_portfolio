import React, { useState, useEffect, useRef } from 'react';
import * as webllm from "@mlc-ai/web-llm";
import chatbotData from '../data/chatbotKnowledge.json';
import './Chatbot.css';

// System Prompt for WebLLM and OpenAI
const systemPrompt = `You are an AI assistant for Akash Yadav. Use ONLY the following data to answer questions. If the answer cannot be derived, respond exactly with "This information is not available in my portfolio yet." Answer in first person, friendly, concise.\n\nData: ${JSON.stringify(chatbotData)}`;

// Simple keyword matching utility
const matchKeyword = (query, keywords) => {
    const lower = query.toLowerCase();
    return keywords.some(k => lower.includes(k.toLowerCase()));
};

const getOpenAIResponse = async (query) => {
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

    // Fallback to OpenAI for any other question if WebLLM is not ready or fails
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
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: sanitized }
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

let webLLMEngine = null;

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [webLLMStatus, setWebLLMStatus] = useState(''); // Loading status for WebLLM
    const lastSentRef = useRef(0);
    const messagesEndRef = useRef(null);

    // Initialize WebLLM when chatbot is opened for the first time
    useEffect(() => {
        const initWebLLM = async () => {
            if (open && !webLLMEngine) {
                try {
                    // Small local model suitable for simple Q&A based on system prompt.
                    // Llama-3-8B-Instruct-q4f32_1-MLC is the standard recommended lightweight. 
                    // To keep download size small, Llama-3-8B-Instruct is used initially. 
                    // However, considering browser constraints, Phi-3 can also be very fast.
                    const selectedModel = "Llama-3-8B-Instruct-q4f16_1-MLC";

                    setWebLLMStatus("Loading local AI engine (this happens once)...");
                    webLLMEngine = new webllm.MLCEngine();
                    webLLMEngine.setInitProgressCallback((report) => {
                        setWebLLMStatus(report.text);
                    });

                    await webLLMEngine.reload(selectedModel);
                    setWebLLMStatus(''); // clear status when done
                } catch (error) {
                    console.error("WebLLM initialization failed:", error);
                    setWebLLMStatus('');
                    webLLMEngine = null; // Mark as failed to fallback
                }
            }
        };
        initWebLLM();
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, webLLMStatus]);

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

        let responseText = '';

        try {
            // First check if WebLLM is loaded and ready
            if (webLLMEngine) {
                const request = {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages.map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text })),
                        { role: 'user', content: userMsg.text }
                    ],
                    temperature: 0.1, // Keep it deterministic
                    max_tokens: 300,
                };
                const reply = await webLLMEngine.chat.completions.create(request);
                responseText = reply.choices[0].message.content.trim();
            } else {
                // Throw to use fallback
                throw new Error("WebLLM not ready");
            }
        } catch (e) {
            console.log("WebLLM failed or not ready, falling back to OpenAI/Local Rules", e);
            // WebLLM failed / not loaded, fallback to Local Rules -> OpenAI
            responseText = await getOpenAIResponse(userMsg.text);
        }

        const isFallback =
            responseText === 'This information is not available in my portfolio yet.' ||
            responseText === 'Sorry, there was an error processing your request.';

        if (!isFallback) {
            const botReply = { sender: 'bot', text: responseText };
            setMessages(prev => [...prev, botReply]);
        } else {
            // Show a sensible fallback response to the user while Tidio connects in the background
            const botReply = { sender: 'bot', text: "I couldn't find an exact answer to that in my portfolio data, but let me check that directly with Akash for you..." };
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
                        {webLLMStatus && <div className="chat-message bot" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{webLLMStatus}</div>}
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
