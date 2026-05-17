import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layout } from 'lucide-react';

const VersionSwitcher = ({ version, onSwitch }) => {
  const [expanded, setExpanded] = useState(false);
  const isHolo = version === 'holo';

  // Auto-collapse after pick
  const handlePick = (v) => {
    onSwitch(v);
    setExpanded(false);
  };

  return (
    <div className="version-switcher">
      {/* Main pill trigger */}
      <motion.button
        className={`vs-pill ${isHolo ? 'vs-pill-holo' : 'vs-pill-classic'}`}
        onClick={() => setExpanded(e => !e)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Switch portfolio version"
      >
        {isHolo ? <Zap size={14} /> : <Layout size={14} />}
        <span>{isHolo ? 'HOLO MODE' : 'CLASSIC'}</span>
        <span className="vs-arrow">{expanded ? '▲' : '▼'}</span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="vs-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            <p className="vs-label">Choose Experience</p>

            <button
              className={`vs-option ${!isHolo ? 'vs-active' : ''}`}
              onClick={() => handlePick('classic')}
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
