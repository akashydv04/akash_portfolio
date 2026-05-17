import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layout } from 'lucide-react';

const VersionSwitcher = ({ version, onSwitch }) => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const isHolo = version === 'holo';

  // Robust click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handlePick = (v) => {
    onSwitch(v);
    setExpanded(false);
  };

  return (
    <div className="version-switcher" ref={containerRef}>
      {/* Main pill trigger */}
      <button
        className={`vs-pill ${isHolo ? 'vs-pill-holo' : 'vs-pill-classic'}`}
        onClick={() => setExpanded(e => !e)}
        aria-label="Switch portfolio version"
        style={{ pointerEvents: 'auto', userSelect: 'none' }}
      >
        {isHolo ? <Zap size={14} /> : <Layout size={14} />}
        <span>{isHolo ? 'HOLO MODE' : 'CLASSIC'}</span>
        <span className="vs-arrow" style={{ marginLeft: '4px' }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="vs-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ pointerEvents: 'auto' }}
          >
            <p className="vs-label">Choose Experience</p>

            <button
              className={`vs-option ${!isHolo ? 'vs-active' : ''}`}
              onClick={() => handlePick('classic')}
              type="button"
            >
              <Layout size={15} />
              <div className="vs-opt-text">
                <span className="vs-opt-name">Classic</span>
                <span className="vs-opt-desc">Clean, minimal portfolio</span>
              </div>
              {!isHolo && <span className="vs-check">✓</span>}
            </button>

            <button
              className={`vs-option vs-option-holo ${isHolo ? 'vs-active' : ''}`}
              onClick={() => handlePick('holo')}
              type="button"
            >
              <Zap size={15} />
              <div className="vs-opt-text">
                <span className="vs-opt-name">Holographic ✦</span>
                <span className="vs-opt-desc">3D sci-fi command terminal</span>
              </div>
              {isHolo && <span className="vs-check">✓</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VersionSwitcher;
