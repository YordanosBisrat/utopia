'use client';

import React, { useEffect, useRef } from 'react';
import './style.css';

export default function GameMainPage() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent React StrictMode from initializing WebGL engine twice
    if (initialized.current) return;
    initialized.current = true;

    // Dynamically boot your client-side Three.js game engine
    import('./main.js').catch((err) => {
      console.error('Failed to load Three.js game engine:', err);
    });
  }, []);

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#05080c',
      }}
    >
      {/* 3D WebGL Canvas */}
      <canvas id="webgl-canvas" style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Atmospheric Vignette */}
      <div id="vignette-overlay" />

      {/* Controls HUD */}
      <div id="hud-controls">
        <span>[A / D] Move</span>
        <span>[W / S] Depth</span>
        <span>[C] Crouch / Sneak</span>
        <span>[Shift] Sprint</span>
        <span>[E] Interact / Talk</span>
      </div>

      {/* Stealth Eye & Detection Meter */}
      <div id="stealth-meter-container" className="hidden">
        <div id="stealth-eye-icon">◉</div>
        <div id="stealth-bar-frame">
          <div id="stealth-bar-fill" />
        </div>
      </div>

      <div id="detection-flash" />

      {/* Sluice / Winch Interaction Prompt */}
      <div id="interaction-prompt" className="hidden">
        <div className="prompt-key">E</div>
        <div id="prompt-label">Turn Winch</div>
        <div id="prompt-progress-bar">
          <div id="prompt-progress-fill" />
        </div>
      </div>

      {/* Dialogue Modal */}
      <div id="dialogue-container" className="hidden">
        <div id="dialogue-avatar-box">
          <div id="dialogue-avatar" />
        </div>
        <div id="dialogue-content">
          <div id="dialogue-speaker">Ras Alula</div>
          <div id="dialogue-body" />
          <div id="dialogue-choices" className="hidden" />
          <div id="dialogue-prompt">Press [E] to continue ►</div>
        </div>
      </div>

      {/* Start of Game Mission Briefing Modal */}
      <div id="instructions-backdrop">
        <div id="instructions-modal">
          <div id="instructions-header">
            <div className="instructions-badge">ACT I : SCOUT RECONNAISSANCE</div>
            <h2>Kidane Mehret Pass</h2>
            <p className="instructions-subtitle">March 1, 1896 — The eve of the Battle of Adwa</p>
          </div>

          <div id="instructions-grid">
            <div className="instruction-card danger-card">
              <div className="instruction-icon">🔦</div>
              <div className="instruction-text">
                <h4>Avoid the Sentry Searchlight</h4>
                <p>
                  Italian outposts sweep the ravine with high-powered lanterns.{' '}
                  <strong>Do not step into the moving yellow beam</strong> while standing or running, or the alarm will sound!
                </p>
              </div>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon">🛡️</div>
              <div className="instruction-text">
                <h4>Use Sangar Rock Cover</h4>
                <p>
                  Hold <strong>[C]</strong> to crouch behind low basalt stone walls. As long as you are crouching inside a cover zone, the searchlight will pass harmlessly over you.
                </p>
              </div>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon">⚙️</div>
              <div className="instruction-text">
                <h4>Empress Taytu&apos;s Stratagem</h4>
                <p>
                  Approach the wooden winch stand at the flooded gulch and <strong>Hold [E]</strong> to raise the sluice gate and drain the water, cutting enemy supplies.
                </p>
              </div>
            </div>
          </div>

          <div id="instructions-footer">
            <button id="start-game-btn" type="button">
              Begin Reconnaissance ➔
            </button>
            <span className="key-hint">Press [Space] or [Enter] to Start</span>
          </div>
        </div>
      </div>

      {/* Historical Codex & Level Completion Modal */}
      <div id="codex-backdrop" className="hidden">
        <div id="codex-modal">
          <div id="codex-visual-col">
            <div id="codex-image-frame">
              <div id="codex-image" />
            </div>
            <div id="codex-meta">
              <span className="meta-label">ARCHIVE REFERENCE</span>
              <span className="meta-value">ETH-MIL-1896-ADWA</span>
              <span className="meta-label">RECORD DATE</span>
              <span className="meta-value">1 March 1896 (Yekatit 23, 1888)</span>
            </div>
          </div>

          <div id="codex-text-col">
            <div id="codex-header">
              <div id="codex-badge">MISSION COMPLETE</div>
              <h2 id="codex-title">The Battle of Adwa</h2>
              <div id="codex-tags">
                <span className="tag">Tactical Scout</span>
                <span className="tag">Kidane Mehret Pass</span>
                <span className="tag">Empress Taytu Stratagem</span>
              </div>
            </div>

            <div id="codex-body">
              <p>
                By severing the Endeyeyus water supply and confirming that General Albertone&apos;s brigade was separated from the main Italian column, your intelligence allowed Ethiopian forces under{' '}
                <strong>Emperor Menelik II</strong> and <strong>Ras Alula</strong> to execute a decisive encirclement.
              </p>
              <p>
                Adwa remains a watershed victory: the decisive defense of sovereignty that halted colonial expansion in the Horn of Africa.
              </p>
            </div>

            <div id="codex-footer">
              <button id="codex-close-btn" type="button">
                Continue to Act II ➔
              </button>
              <span id="codex-esc-hint">Press [ESC] to Dismiss</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
