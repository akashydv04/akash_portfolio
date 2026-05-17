import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Bot } from 'lucide-react';

const GUIDE_MESSAGES = {
  idle: {
    text: "Welcome. My portfolio isn't just a list — it's an experience. Interact with the holographic nodes below to navigate.",
    subtitle: "SYSTEM ONLINE // AWAITING INPUT",
  },
  projects: {
    text: "Initializing project database. These are high-performance applications engineered for millions of users across Fintech.",
    subtitle: "SECTOR: WORK // LOADING...",
  },
  experience: {
    text: "Professional Journey sector unlocked. 5+ years of Android engineering across YC-backed startups and enterprise banking.",
    subtitle: "SECTOR: EXPERIENCE // TIMELINE ACTIVE",
  },
  skills: {
    text: "Technical Expertise array loaded. Kotlin, Jetpack Compose, Clean Architecture — all nodes operational.",
    subtitle: "SECTOR: SKILLS // DIAGNOSTICS RUNNING",
  },
  contact: {
    text: "Communication console active. Direct channel is open. Transmit your coordinates and project parameters.",
    subtitle: "SECTOR: CONTACT // CHANNEL OPEN",
  },
};

const VirtualGuide = ({ activeSection, isMuted, onToggleMute }) => {
  const [currentMessage, setCurrentMessage] = useState(GUIDE_MESSAGES.idle);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);
  const utteranceRef = useRef(null);
  const intervalRef = useRef(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const typeText = useCallback((text) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTyping(true);
    setDisplayText('');
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 28);
  }, []);

  const speak = useCallback((text) => {
    if (!synth || isMuted) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.85;
    utterance.volume = 0.7;

    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Microsoft') || v.lang === 'en-US'
    );
    if (preferred) utterance.voice = preferred;
    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [synth, isMuted]);

  useEffect(() => {
    const key = activeSection || 'idle';
    const msg = GUIDE_MESSAGES[key] || GUIDE_MESSAGES.idle;
    setCurrentMessage(msg);
    setIsPulsing(true);
    typeText(msg.text);
    speak(msg.text);
    const timer = setTimeout(() => setIsPulsing(false), 600);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSection]);

  useEffect(() => {
    if (isMuted && synth) synth.cancel();
  }, [isMuted]);

  return (
    <motion.div
      className="virtual-guide"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      {/* Avatar orb */}
      <div className={`guide-orb ${isPulsing ? 'pulsing' : ''}`}>
        <motion.div
          className="guide-orb-inner"
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              '0 0 20px rgba(0,245,255,0.4)',
              '0 0 50px rgba(0,245,255,0.8)',
              '0 0 20px rgba(0,245,255,0.4)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bot size={28} color="#00f5ff" />
        </motion.div>
        <div className="guide-orb-rings">
          {[1, 2, 3].map(r => (
            <motion.div
              key={r}
              className="orb-ring"
              style={{ width: 40 + r * 22, height: 40 + r * 22 }}
              animate={{ rotate: r % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 3 + r, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      </div>

      {/* Dialogue panel */}
      <div className="guide-panel">
        <div className="guide-header">
          <span className="guide-subtitle">{currentMessage.subtitle}</span>
          <button className="mute-btn" onClick={onToggleMute} aria-label="Toggle voice">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
        <div className="guide-text">
          <span className="guide-cursor-prefix">&gt; </span>
          {displayText}
          {isTyping && <span className="typing-cursor">█</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualGuide;
