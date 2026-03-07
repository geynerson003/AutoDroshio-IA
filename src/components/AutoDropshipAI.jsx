import { useState, useEffect, useRef } from "react";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #08090d;
    --bg2:      #0d0f17;
    --bg3:      #12151f;
    --surface:  #181c28;
    --surface2: #1e2333;
    --border:   rgba(255,255,255,0.07);
    --border2:  rgba(255,255,255,0.12);
    --text:     #e8eaf2;
    --muted:    #6b7280;
    --muted2:   #9ca3af;
    --accent:   #6366f1;
    --accent2:  #818cf8;
    --green:    #10b981;
    --red:      #ef4444;
    --orange:   #f59e0b;
    --cyan:     #06b6d4;
    --pink:     #ec4899;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
    --r:  8px;
    --r2: 12px;
    --r3: 16px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --glow: 0 0 40px rgba(99,102,241,0.15);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 4px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow-y: auto; position: relative; z-index: 10;
  }
  .sidebar-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 32px; height: 32px; border-radius: var(--r);
    background: linear-gradient(135deg, var(--accent), #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; box-shadow: 0 0 20px rgba(99,102,241,0.4);
  }
  .logo-text { font-family: var(--font-display); font-weight: 800; font-size: 15px; letter-spacing: -0.3px; }
  .logo-text span { color: var(--accent2); }

  .nav-section { padding: 12px 10px 4px; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 0 8px 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: var(--r); cursor: pointer;
    font-size: 13.5px; font-weight: 400; color: var(--muted2);
    transition: all 0.15s; margin-bottom: 1px;
  }
  .nav-item:hover { background: var(--surface); color: var(--text); }
  .nav-item.active {
    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1));
    color: var(--accent2); font-weight: 500;
    box-shadow: inset 0 0 0 1px rgba(99,102,241,0.2);
  }
  .nav-item .icon { font-size: 15px; width: 20px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--accent); color: white;
    font-size: 10px; font-weight: 700; padding: 1px 6px;
    border-radius: 10px; min-width: 18px; text-align: center;
  }
  .nav-badge.green { background: var(--green); }
  .nav-badge.orange { background: var(--orange); }

  .sidebar-footer {
    margin-top: auto; padding: 14px 14px 16px;
    border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: var(--r);
    cursor: pointer; transition: background 0.15s;
  }
  .user-card:hover { background: var(--surface); }
  .avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .user-info .name { font-size: 12.5px; font-weight: 500; }
  .user-info .plan { font-size: 11px; color: var(--accent2); }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
  .topbar {
    height: 58px; min-height: 58px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    padding: 0 24px; gap: 12px;
    background: var(--bg2);
  }
  .topbar-title { font-family: var(--font-display); font-weight: 700; font-size: 17px; flex: 1; }
  .topbar-title span { color: var(--muted); font-weight: 400; font-size: 14px; margin-left: 6px; }
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: var(--r); border: none;
    font-family: var(--font-body); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), #7c3aed);
    color: white; box-shadow: 0 2px 12px rgba(99,102,241,0.35);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.5); }
  .btn-secondary {
    background: var(--surface); color: var(--muted2);
    border: 1px solid var(--border2);
  }
  .btn-secondary:hover { background: var(--surface2); color: var(--text); }
  .btn-ghost { background: transparent; color: var(--muted2); }
  .btn-ghost:hover { background: var(--surface); color: var(--text); }
  .btn-sm { padding: 5px 11px; font-size: 12px; }
  .btn-green { background: linear-gradient(135deg, #059669, #10b981); color: white; box-shadow: 0 2px 12px rgba(16,185,129,0.3); }
  .btn-green:hover { transform: translateY(-1px); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }

  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* CARDS */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 20px;
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-family: var(--font-display); font-weight: 700; font-size: 15px; }
  .card-subtitle { font-size: 12.5px; color: var(--muted); margin-top: 2px; }

  /* STATS GRID */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 18px 20px;
    position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), #a855f7);
  }
  .stat-card.green::before { background: linear-gradient(90deg, var(--green), #34d399); }
  .stat-card.orange::before { background: linear-gradient(90deg, var(--orange), #fbbf24); }
  .stat-card.cyan::before { background: linear-gradient(90deg, var(--cyan), #67e8f9); }
  .stat-label { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
  .stat-value { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin: 6px 0 4px; }
  .stat-delta { font-size: 12px; }
  .delta-up { color: var(--green); }
  .delta-down { color: var(--red); }
  .stat-icon { position: absolute; top: 16px; right: 16px; font-size: 22px; opacity: 0.25; }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted);
    border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg3); }

  /* BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 500;
  }
  .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .badge-green { background: rgba(16,185,129,0.12); color: #34d399; }
  .badge-red { background: rgba(239,68,68,0.12); color: #f87171; }
  .badge-orange { background: rgba(245,158,11,0.12); color: #fbbf24; }
  .badge-blue { background: rgba(99,102,241,0.12); color: var(--accent2); }
  .badge-cyan { background: rgba(6,182,212,0.12); color: #67e8f9; }
  .badge-gray { background: rgba(107,114,128,0.15); color: var(--muted2); }

  /* PROGRESS */
  .progress { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

  /* SCORE RING */
  .score-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }

  /* GRID LAYOUTS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-1-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }
  .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

  /* PRODUCT CARDS */
  .product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .product-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r3); overflow: hidden; cursor: pointer;
    transition: all 0.2s;
  }
  .product-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--glow); }
  .product-thumb {
    height: 140px; background: var(--bg3);
    display: flex; align-items: center; justify-content: center;
    font-size: 48px; position: relative;
  }
  .product-score-badge {
    position: absolute; top: 8px; right: 8px;
    background: var(--bg); border: 1px solid var(--border2);
    border-radius: 6px; padding: 3px 7px; font-size: 11px;
    font-weight: 700; font-family: var(--font-display);
  }
  .product-info { padding: 12px 14px 14px; }
  .product-name { font-weight: 600; font-size: 13px; margin-bottom: 6px; line-height: 1.4; }
  .product-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .product-price { font-family: var(--font-display); font-weight: 800; color: var(--green); }
  .product-margin { font-size: 11.5px; color: var(--muted2); }

  /* CHART BAR */
  .chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 80px; padding-top: 10px; }
  .chart-bar { flex: 1; border-radius: 4px 4px 0 0; transition: all 0.3s; cursor: pointer; min-width: 12px; }
  .chart-bar:hover { opacity: 0.8; }
  .chart-labels { display: flex; gap: 6px; margin-top: 5px; }
  .chart-lbl { flex: 1; text-align: center; font-size: 10px; color: var(--muted); min-width: 12px; }

  /* MINI SPARKLINE */
  .sparkline { display: flex; align-items: flex-end; gap: 2px; height: 28px; }
  .spark-bar { flex: 1; border-radius: 2px; background: var(--accent); opacity: 0.6; min-width: 3px; }

  /* CAMPAIGN CARD */
  .campaign-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 16px; margin-bottom: 10px;
    cursor: pointer; transition: all 0.15s;
  }
  .campaign-card:hover { border-color: var(--border2); }
  .campaign-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .campaign-emoji { font-size: 22px; }
  .campaign-name { font-weight: 600; font-size: 13.5px; }
  .campaign-platform { font-size: 11.5px; color: var(--muted); }
  .campaign-metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .campaign-metric { text-align: center; }
  .cm-val { font-family: var(--font-display); font-weight: 700; font-size: 14px; }
  .cm-lbl { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1px; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px); z-index: 100;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.15s;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 18px; padding: 28px; max-width: 560px; width: 90%;
    box-shadow: 0 20px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.2s;
  }
  .modal-lg { max-width: 720px; }
  .modal-title { font-family: var(--font-display); font-weight: 800; font-size: 20px; margin-bottom: 6px; }
  .modal-sub { font-size: 13.5px; color: var(--muted2); margin-bottom: 22px; }
  .modal-footer { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }

  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12.5px; font-weight: 500; color: var(--muted2); margin-bottom: 6px; display: block; }
  .form-input {
    width: 100%; background: var(--bg3); border: 1px solid var(--border2);
    border-radius: var(--r); padding: 9px 13px; color: var(--text);
    font-family: var(--font-body); font-size: 13.5px;
    transition: border-color 0.15s; outline: none;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-select {
    width: 100%; background: var(--bg3); border: 1px solid var(--border2);
    border-radius: var(--r); padding: 9px 13px; color: var(--text);
    font-family: var(--font-body); font-size: 13.5px; cursor: pointer;
  }
  .form-textarea {
    width: 100%; background: var(--bg3); border: 1px solid var(--border2);
    border-radius: var(--r); padding: 9px 13px; color: var(--text);
    font-family: var(--font-body); font-size: 13.5px; resize: vertical;
    min-height: 80px; outline: none; transition: border-color 0.15s;
  }
  .form-textarea:focus { border-color: var(--accent); }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: var(--bg3); border-radius: var(--r2); padding: 4px; margin-bottom: 20px; }
  .tab {
    flex: 1; padding: 7px 14px; border-radius: var(--r); cursor: pointer;
    font-size: 13px; font-weight: 500; text-align: center; color: var(--muted);
    transition: all 0.15s;
  }
  .tab.active { background: var(--surface2); color: var(--text); }

  /* LOADER */
  .loader { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 60px; }
  .spinner {
    width: 36px; height: 36px; border: 3px solid var(--surface2);
    border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  .loader-text { color: var(--muted2); font-size: 14px; }
  .ai-typing { display: flex; gap: 4px; align-items: center; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1.2s ease-in-out infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  /* TOGGLE */
  .toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .toggle-track {
    width: 36px; height: 20px; border-radius: 10px; background: var(--surface2);
    position: relative; transition: background 0.2s;
  }
  .toggle-track.on { background: var(--accent); }
  .toggle-thumb {
    width: 14px; height: 14px; border-radius: 50%; background: white;
    position: absolute; top: 3px; left: 3px; transition: transform 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .toggle-track.on .toggle-thumb { transform: translateX(16px); }

  /* NOTIFICATION */
  .notif-container { position: fixed; bottom: 24px; right: 24px; z-index: 200; display: flex; flex-direction: column; gap: 8px; }
  .notif {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--r2); padding: 12px 16px;
    display: flex; align-items: center; gap: 12px; min-width: 280px;
    box-shadow: var(--shadow); animation: slideLeft 0.3s;
    font-size: 13.5px;
  }
  .notif-icon { font-size: 18px; }
  .notif.success { border-left: 3px solid var(--green); }
  .notif.error { border-left: 3px solid var(--red); }
  .notif.info { border-left: 3px solid var(--accent); }

  /* ACTIVITY FEED */
  .activity-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .activity-text { font-size: 13px; line-height: 1.5; }
  .activity-time { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* FULFILLMENT */
  .order-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .order-row:last-child { border-bottom: none; }
  .order-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }

  /* OPTIMIZATION */
  .rule-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 14px 16px;
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 10px;
  }
  .rule-icon { font-size: 20px; width: 36px; text-align: center; }
  .rule-info { flex: 1; }
  .rule-name { font-size: 13.5px; font-weight: 600; margin-bottom: 2px; }
  .rule-desc { font-size: 12px; color: var(--muted2); }

  /* ANIMATIONS */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { transform: scale(0.7); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: countUp 0.4s ease both; }

  .skeleton {
    background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%);
    background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--r);
  }

  /* ONBOARDING */
  .onboarding {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-body);
  }
  .onboard-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 20px; padding: 40px; max-width: 460px; width: 90%;
    box-shadow: 0 20px 80px rgba(0,0,0,0.5);
    animation: slideUp 0.3s;
  }
  .onboard-logo { font-family: var(--font-display); font-weight: 800; font-size: 26px; margin-bottom: 6px; }
  .onboard-logo span { color: var(--accent2); }
  .onboard-tagline { color: var(--muted2); font-size: 14px; margin-bottom: 32px; }
  .step-indicator { display: flex; gap: 6px; margin-bottom: 28px; }
  .step-dot { height: 3px; flex: 1; border-radius: 2px; background: var(--surface2); transition: background 0.3s; }
  .step-dot.done { background: var(--accent); }

  /* CONNECT CARDS */
  .connect-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 14px 16px;
    display: flex; align-items: center; gap: 14px; margin-bottom: 10px;
    cursor: pointer; transition: all 0.15s;
  }
  .connect-card:hover { border-color: var(--border2); }
  .connect-card.connected { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.05); }
  .connect-logo { width: 36px; height: 36px; border-radius: var(--r); background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .connect-info { flex: 1; }
  .connect-name { font-size: 13.5px; font-weight: 600; }
  .connect-desc { font-size: 12px; color: var(--muted); }

  /* NUMBER HIGHLIGHTS */
  .num-green { color: var(--green); font-weight: 700; }
  .num-red { color: var(--red); font-weight: 700; }
  .num-accent { color: var(--accent2); font-weight: 700; }

  /* METRIC BOX */
  .metric-box {
    background: var(--bg3); border-radius: var(--r2);
    padding: 14px 16px; text-align: center;
  }
  .metric-box .val { font-family: var(--font-display); font-size: 22px; font-weight: 800; margin-bottom: 3px; }
  .metric-box .lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }

  /* AI PULSE */
  .ai-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1));
    border: 1px solid rgba(99,102,241,0.25);
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px;
    color: var(--accent2); font-weight: 500;
  }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 18px; }
  .section-title { font-family: var(--font-display); font-weight: 800; font-size: 22px; }
  .section-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }

  /* EMPTY STATE */
  .empty { text-align: center; padding: 60px 20px; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-family: var(--font-display); font-weight: 700; font-size: 18px; margin-bottom: 8px; }
  .empty-sub { font-size: 13.5px; color: var(--muted2); max-width: 300px; margin: 0 auto 20px; line-height: 1.6; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  /* FLEX UTILS */
  .flex { display: flex; }
  .flex-center { display: flex; align-items: center; }
  .gap-4 { gap: 4px; } .gap-8 { gap: 8px; } .gap-10 { gap: 10px; } .gap-12 { gap: 12px; } .gap-16 { gap: 16px; }
  .ml-auto { margin-left: auto; }
  .mb-4 { margin-bottom: 4px; } .mb-8 { margin-bottom: 8px; } .mb-12 { margin-bottom: 12px; }
  .mb-16 { margin-bottom: 16px; } .mb-20 { margin-bottom: 20px; } .mb-24 { margin-bottom: 24px; }
  .text-sm { font-size: 12.5px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--muted); }
  .text-muted2 { color: var(--muted2); }
  .text-accent { color: var(--accent2); }
  .text-green { color: var(--green); }
  .text-red { color: var(--red); }
  .text-orange { color: var(--orange); }
  .font-bold { font-weight: 700; }
  .font-display { font-family: var(--font-display); }

  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rounded { border-radius: var(--r); }
  .tag { background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 3px 8px; font-size: 11.5px; color: var(--muted2); }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    emoji: "🧦",
    name: "Bamboo Compression Socks 3-Pack",
    cost: 4.8,
    price: 24.99,
    margin: 80.8,
    score: 94,
    trend: "↑",
    volume: 18400,
    engagement: 9.2,
    status: "active",
    supplier: "CJ Dropshipping",
    tags: ["Health", "Wellness"],
  },
  {
    id: 2,
    emoji: "💡",
    name: "LED Strip Light RGB Bluetooth 5M",
    cost: 6.2,
    price: 29.99,
    margin: 79.3,
    score: 91,
    trend: "↑",
    volume: 32100,
    engagement: 8.7,
    status: "active",
    supplier: "AliExpress",
    tags: ["Home", "Decor"],
  },
  {
    id: 3,
    emoji: "🎮",
    name: "Wireless Phone Game Controller",
    cost: 8.5,
    price: 39.99,
    margin: 78.7,
    score: 88,
    trend: "↑",
    volume: 15200,
    engagement: 7.9,
    status: "published",
    supplier: "CJ Dropshipping",
    tags: ["Gaming", "Tech"],
  },
  {
    id: 4,
    emoji: "🐾",
    name: "Smart Auto Pet Feeder WiFi",
    cost: 12.3,
    price: 59.99,
    margin: 79.5,
    score: 85,
    trend: "→",
    volume: 9800,
    engagement: 8.4,
    status: "research",
    supplier: "AliExpress",
    tags: ["Pets", "Smart Home"],
  },
  {
    id: 5,
    emoji: "🌿",
    name: "Portable Neck Massager EMS",
    cost: 9.1,
    price: 44.99,
    margin: 79.8,
    score: 82,
    trend: "↑",
    volume: 11600,
    engagement: 9.6,
    status: "active",
    supplier: "CJ Dropshipping",
    tags: ["Health", "Wellness"],
  },
  {
    id: 6,
    emoji: "📦",
    name: "Magnetic Cable Organizer Desk Set",
    cost: 3.4,
    price: 17.99,
    margin: 81.1,
    score: 79,
    trend: "→",
    volume: 7200,
    engagement: 6.3,
    status: "published",
    supplier: "AliExpress",
    tags: ["Office", "Organization"],
  },
];

const CAMPAIGNS = [
  {
    id: 1,
    name: "Compression Socks — Summer 2025",
    product: "🧦 Bamboo Compression Socks",
    status: "active",
    budget: 45,
    spend: 32.8,
    revenue: 194.4,
    roas: 5.93,
    ctr: 3.42,
    cpc: 0.48,
    conversions: 7,
    impressions: 68400,
  },
  {
    id: 2,
    name: "LED Strip — Home Decor Bundle",
    product: "💡 LED Strip Light RGB",
    status: "active",
    budget: 60,
    spend: 48.2,
    revenue: 178.5,
    roas: 3.7,
    ctr: 2.18,
    cpc: 0.72,
    conversions: 6,
    impressions: 52300,
  },
  {
    id: 3,
    name: "Game Controller — Gaming Audience",
    product: "🎮 Wireless Game Controller",
    status: "paused",
    budget: 30,
    spend: 29.7,
    revenue: 61.8,
    roas: 2.08,
    ctr: 1.45,
    cpc: 1.1,
    conversions: 2,
    impressions: 27000,
  },
  {
    id: 4,
    name: "Pet Feeder — Pet Owner Targeting",
    product: "🐾 Smart Pet Feeder",
    status: "draft",
    budget: 50,
    spend: 0,
    revenue: 0,
    roas: 0,
    ctr: 0,
    cpc: 0,
    conversions: 0,
    impressions: 0,
  },
  {
    id: 5,
    name: "Neck Massager — Pain Relief",
    product: "🌿 Portable Neck Massager",
    status: "active",
    budget: 40,
    spend: 38.5,
    revenue: 154.8,
    roas: 4.02,
    ctr: 2.87,
    cpc: 0.62,
    conversions: 4,
    impressions: 44200,
  },
];

const ORDERS = [
  {
    id: "#4821",
    customer: "Sarah M.",
    product: "🧦 Compression Socks",
    amount: 24.99,
    cost: 4.8,
    profit: 20.19,
    status: "shipped",
    tracking: "YT1234567890CN",
    time: "2 hours ago",
  },
  {
    id: "#4820",
    customer: "James K.",
    product: "💡 LED Strip Light",
    amount: 29.99,
    cost: 6.2,
    profit: 23.79,
    status: "processing",
    tracking: null,
    time: "3 hours ago",
  },
  {
    id: "#4819",
    customer: "Linda R.",
    product: "🌿 Neck Massager",
    amount: 44.99,
    cost: 9.1,
    profit: 35.89,
    status: "delivered",
    tracking: "YT9876543210CN",
    time: "1 day ago",
  },
  {
    id: "#4818",
    customer: "Tom C.",
    product: "🧦 Compression Socks",
    amount: 24.99,
    cost: 4.8,
    profit: 20.19,
    status: "shipped",
    tracking: "YT1122334455CN",
    time: "1 day ago",
  },
  {
    id: "#4817",
    customer: "Maria L.",
    product: "🎮 Game Controller",
    amount: 39.99,
    cost: 8.5,
    profit: 31.49,
    status: "delivered",
    tracking: "YT5544332211CN",
    time: "2 days ago",
  },
  {
    id: "#4816",
    customer: "David W.",
    product: "💡 LED Strip Light",
    amount: 29.99,
    cost: 6.2,
    profit: 23.79,
    status: "shipped",
    tracking: "YT6677889900CN",
    time: "2 days ago",
  },
];

const ACTIVITIES = [
  {
    type: "success",
    icon: "🚀",
    text: 'Campaign "Compression Socks — Summer" scaled budget +20% (ROAS 5.93)',
    time: "12 min ago",
  },
  {
    type: "info",
    icon: "🤖",
    text: "AI found 3 new trending products in Health & Wellness category",
    time: "1 hour ago",
  },
  {
    type: "success",
    icon: "📦",
    text: "Order #4821 fulfilled automatically via CJ Dropshipping",
    time: "2 hours ago",
  },
  {
    type: "warning",
    icon: "⚠️",
    text: "Game Controller campaign CTR below 1.5% threshold — paused automatically",
    time: "3 hours ago",
  },
  {
    type: "success",
    icon: "✨",
    text: "AI generated product page for Smart Pet Feeder (title, description, FAQ)",
    time: "4 hours ago",
  },
  {
    type: "info",
    icon: "🔄",
    text: "Inventory sync completed — 6 products updated across Shopify store",
    time: "5 hours ago",
  },
  {
    type: "success",
    icon: "💰",
    text: "New order #4820 received — $29.99 — auto-fulfillment in progress",
    time: "5 hours ago",
  },
];

const REVENUE_DATA = [
  28, 44, 38, 62, 55, 70, 84, 78, 95, 88, 102, 118, 96, 128,
];
const WEEK_DATA = [120, 180, 145, 210, 260, 240, 290];
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt$ = (n) => `$${n.toFixed(2)}`;
const fmtK = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString());

function ScoreRing({ score, size = 44 }) {
  const color = score >= 85 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444";
  const r = 16,
    circ = 2 * Math.PI * r,
    dash = circ * (score / 100);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="4"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
      />
      <text
        x="22"
        y="22"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="10"
        fontWeight="800"
        fontFamily="Syne, sans-serif"
        style={{ transform: "rotate(90deg)", transformOrigin: "22px 22px" }}
      >
        {score}
      </text>
    </svg>
  );
}

function Sparkline({ data, color = "#6366f1" }) {
  const max = Math.max(...data);
  return (
    <div className="sparkline">
      {data.map((v, i) => (
        <div
          key={i}
          className="spark-bar"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: 0.5 + 0.5 * (v / max),
          }}
        />
      ))}
    </div>
  );
}

function MiniChart({ data, labels, color = "#6366f1" }) {
  const max = Math.max(...data);
  return (
    <>
      <div className="chart-bars">
        {data.map((v, i) => (
          <div
            key={i}
            className="chart-bar"
            style={{
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(180deg, ${color}cc, ${color}44)`,
            }}
          />
        ))}
      </div>
      <div className="chart-labels">
        {labels.map((l, i) => (
          <span key={i} className="chart-lbl">
            {l}
          </span>
        ))}
      </div>
    </>
  );
}

function Toggle({ on, onChange }) {
  return (
    <div className="toggle" onClick={() => onChange(!on)}>
      <div className={`toggle-track ${on ? "on" : ""}`}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState({ email: "", name: "", store: "" });
  const [connecting, setConnecting] = useState("");

  const steps = ["Account", "Integrations", "Launch"];

  async function connect(service) {
    setConnecting(service);
    await new Promise((r) => setTimeout(r, 1800));
    setConnecting("");
  }

  return (
    <div className="onboarding">
      <style>{CSS}</style>
      <div className="onboard-card">
        <div className="onboard-logo">
          Auto<span>Dropship</span> AI
        </div>
        <div className="onboard-tagline">
          Set up your AI-powered dropshipping store in minutes
        </div>
        <div className="step-indicator">
          {steps.map((s, i) => (
            <div key={i} className={`step-dot ${i <= step ? "done" : ""}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="animate-in">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="Alex Johnson"
                value={vals.name}
                onChange={(e) => setVals({ ...vals, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="alex@company.com"
                value={vals.email}
                onChange={(e) => setVals({ ...vals, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input
                className="form-input"
                placeholder="My Awesome Store"
                value={vals.store}
                onChange={(e) => setVals({ ...vals, store: e.target.value })}
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => setStep(1)}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in">
            <p className="text-sm text-muted2 mb-16">
              Connect your store and ad account to enable full automation.
            </p>
            {[
              {
                id: "shopify",
                emoji: "🛒",
                name: "Shopify",
                desc: "Connect your Shopify store",
              },
              {
                id: "meta",
                emoji: "📘",
                name: "Meta Ads",
                desc: "Facebook & Instagram advertising",
              },
              {
                id: "cj",
                emoji: "📦",
                name: "CJ Dropshipping",
                desc: "Auto fulfillment provider",
              },
            ].map((s) => (
              <div
                key={s.id}
                className={`connect-card ${connecting === s.id ? "connected" : ""}`}
                onClick={() => connect(s.id)}
              >
                <div className="connect-logo">{s.emoji}</div>
                <div className="connect-info">
                  <div className="connect-name">{s.name}</div>
                  <div className="connect-desc">{s.desc}</div>
                </div>
                {connecting === s.id ? (
                  <div
                    className="spinner"
                    style={{ width: 18, height: 18, borderWidth: 2 }}
                  />
                ) : (
                  <button className="btn btn-secondary btn-sm">Connect</button>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => setStep(0)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🚀</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 22,
                marginBottom: 8,
              }}
            >
              You're all set!
            </div>
            <p
              className="text-sm text-muted2"
              style={{ marginBottom: 24, lineHeight: 1.6 }}
            >
              AutoDropship AI is ready. Our AI will start researching winning
              products immediately.
            </p>
            <div
              style={{
                background: "var(--bg3)",
                borderRadius: "var(--r2)",
                padding: "14px 16px",
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              {[
                "AI scanning 50,000+ products now",
                "Shopify store connected",
                "Meta Ads account linked",
                "Auto-fulfillment ready",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ color: "var(--green)" }}>✓</span> {t}
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={onDone}
            >
              Launch Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card green animate-in">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$4,284</div>
          <div className="stat-delta delta-up">↑ 23.4% vs last week</div>
        </div>
        <div
          className="stat-card animate-in"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="stat-icon">📦</div>
          <div className="stat-label">Orders Today</div>
          <div className="stat-value">24</div>
          <div className="stat-delta delta-up">↑ 8 vs yesterday</div>
        </div>
        <div
          className="stat-card orange animate-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="stat-icon">🎯</div>
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-value">3</div>
          <div className="stat-delta text-muted">2 paused · 1 draft</div>
        </div>
        <div
          className="stat-card cyan animate-in"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="stat-icon">📈</div>
          <div className="stat-label">Avg. ROAS</div>
          <div className="stat-value">4.55x</div>
          <div className="stat-delta delta-up">↑ 0.8 this week</div>
        </div>
      </div>

      <div className="grid-2-1 mb-20">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue — Last 14 Days</div>
              <div className="card-subtitle">
                Daily gross revenue from all stores
              </div>
            </div>
            <span className="badge badge-green">Live</span>
          </div>
          <MiniChart
            data={REVENUE_DATA}
            labels={REVENUE_DATA.map((_, i) =>
              i % 2 === 0 ? `D${i + 1}` : "",
            )}
            color="#10b981"
          />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Net Profit</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 800,
                color: "var(--green)",
              }}
            >
              $1,847
            </div>
            <div className="text-sm text-muted" style={{ marginBottom: 16 }}>
              this month
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <div className="metric-box" style={{ flex: 1 }}>
                <div className="val">63%</div>
                <div className="lbl">Margin</div>
              </div>
              <div className="metric-box" style={{ flex: 1 }}>
                <div className="val">$77</div>
                <div className="lbl">Avg Order</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Ad Spend</div>
            <div className="ai-badge">🤖 AI Optimizing</div>
          </div>
          <MiniChart data={WEEK_DATA} labels={WEEK_LABELS} color="#6366f1" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div>
              <div className="text-xs text-muted">Total Spend</div>
              <div style={{ fontWeight: 700 }}>$1,245</div>
            </div>
            <div>
              <div className="text-xs text-muted">Total Revenue</div>
              <div style={{ fontWeight: 700, color: "var(--green)" }}>
                $5,676
              </div>
            </div>
            <div>
              <div className="text-xs text-muted">Net ROAS</div>
              <div style={{ fontWeight: 700, color: "var(--accent2)" }}>
                4.55x
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Activity Feed</div>
          </div>
          <div>
            {ACTIVITIES.slice(0, 5).map((a, i) => (
              <div key={i} className="activity-item">
                <div
                  className="activity-dot"
                  style={{
                    background:
                      a.type === "success"
                        ? "var(--green)"
                        : a.type === "warning"
                          ? "var(--orange)"
                          : "var(--accent)",
                  }}
                />
                <div>
                  <div className="activity-text">
                    {a.icon} {a.text}
                  </div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-20" />

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Top Products</div>
            <div className="card-subtitle">Performance this month</div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Margin</th>
                <th>Ad ROAS</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.filter((p) => p.status !== "research").map((p) => (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {p.name}
                        </div>
                        <div className="text-xs text-muted">{p.supplier}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="num-green">
                      {fmt$(p.price * Math.floor(Math.random() * 20 + 10))}
                    </span>
                  </td>
                  <td>{Math.floor(Math.random() * 20 + 5)}</td>
                  <td>
                    <span style={{ color: "var(--green)", fontWeight: 600 }}>
                      {p.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className="num-accent">
                      {(Math.random() * 3 + 2).toFixed(2)}x
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${p.status === "active" ? "green" : p.status === "published" ? "blue" : "gray"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT RESEARCH ─────────────────────────────────────────────────────────
function ProductResearch({ onNotif }) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("discovered");
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);

  async function startResearch() {
    setLoading(true);
    setProgress(0);
    const steps = [
      "Scanning TikTok trends...",
      "Analyzing Amazon Best Sellers...",
      "Checking AliExpress hot products...",
      "Running AI scoring engine...",
      "Filtering top performers...",
    ];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setProgress((i + 1) * 20);
    }
    setLoading(false);
    onNotif({ type: "success", text: "✨ Found 3 new winning products!" });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="section-title">Product Research AI</div>
          <div className="section-sub">
            Automated product discovery powered by AI trend analysis
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={startResearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />{" "}
              Scanning...
            </>
          ) : (
            "🔍 Run AI Research"
          )}
        </button>
      </div>

      {loading && (
        <div className="card mb-20">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div className="ai-typing">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
            <span className="text-sm text-accent">
              AI scanning 50,000+ products across platforms...
            </span>
          </div>
          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg,var(--accent),#a855f7)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            {["TikTok", "Amazon", "AliExpress", "AI Score", "Filter"].map(
              (l, i) => (
                <span
                  key={i}
                  className="text-xs"
                  style={{
                    color:
                      progress >= (i + 1) * 20
                        ? "var(--accent2)"
                        : "var(--muted)",
                  }}
                >
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { l: "Products Found", v: "6", icon: "🔍" },
          { l: "High Score (>80)", v: "4", icon: "⭐" },
          { l: "Avg Margin", v: "79.9%", icon: "💰" },
          { l: "Avg Search Vol", v: "15.7K", icon: "📊" },
        ].map((s, i) => (
          <div
            key={i}
            className="card"
            style={{ textAlign: "center", padding: "16px 12px" }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {s.v}
            </div>
            <div className="text-xs text-muted">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {["discovered", "active", "paused"].map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
            style={{ textTransform: "capitalize" }}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="product-grid">
        {PRODUCTS.filter((p) =>
          tab === "discovered"
            ? true
            : tab === "active"
              ? p.status === "active"
              : p.status === "published",
        ).map((p) => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => setSelected(p)}
          >
            <div className="product-thumb">
              <span style={{ fontSize: 56 }}>{p.emoji}</span>
              <div
                className="product-score-badge"
                style={{
                  color:
                    p.score >= 85
                      ? "var(--green)"
                      : p.score >= 70
                        ? "var(--orange)"
                        : "var(--red)",
                }}
              >
                {p.score}/100
              </div>
            </div>
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-meta">
                <div className="product-price">${p.price}</div>
                <div className="product-margin">
                  {p.margin.toFixed(1)}% margin
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1, fontSize: 11, color: "var(--muted)" }}>
                  <div>Search Vol</div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--text)",
                      fontSize: 12,
                    }}
                  >
                    {fmtK(p.volume)}/mo
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: 11, color: "var(--muted)" }}>
                  <div>Engagement</div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--text)",
                      fontSize: 12,
                    }}
                  >
                    {p.engagement}/10
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: 11, color: "var(--muted)" }}>
                  <div>Trend</div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: p.trend === "↑" ? "var(--green)" : "var(--muted2)",
                      fontSize: 14,
                    }}
                  >
                    {p.trend}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  View
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNotif({
                      type: "success",
                      text: `🤖 Generating page for ${p.name}...`,
                    });
                  }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 52 }}>{selected.emoji}</div>
              <div style={{ flex: 1 }}>
                <div className="modal-title">{selected.name}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <span
                    className={`badge badge-${selected.score >= 85 ? "green" : selected.score >= 70 ? "orange" : "red"}`}
                  >
                    Score: {selected.score}
                  </span>
                  <span className="badge badge-blue">{selected.supplier}</span>
                  {selected.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ScoreRing score={selected.score} size={52} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                ["Cost Price", fmt$(selected.cost)],
                ["Sale Price", fmt$(selected.price)],
                ["Margin", `${selected.margin.toFixed(1)}%`],
                ["Monthly Searches", fmtK(selected.volume)],
              ].map(([l, v]) => (
                <div key={l} className="metric-box">
                  <div className="val">{v}</div>
                  <div className="lbl">{l}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelected(null);
                  onNotif({
                    type: "success",
                    text: "🤖 AI is generating full product page...",
                  });
                }}
              >
                🤖 Generate Full Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI CONTENT GENERATOR ─────────────────────────────────────────────────────
function ContentGenerator({ onNotif }) {
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [content, setContent] = useState(null);

  const steps = [
    "Analyzing product...",
    "Generating title & description...",
    "Creating FAQ...",
    "Writing ad copy...",
    "Optimizing for SEO...",
    "Processing images...",
  ];

  async function generate() {
    setGenerating(true);
    setContent(null);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    setContent({
      title: `${product.name} — Premium Quality | Free Shipping`,
      description: `Transform your daily routine with our best-selling ${product.name}. Engineered with premium materials and designed for maximum comfort, this product delivers results you can feel from day one.\n\nJoin 10,000+ satisfied customers who have already made the switch. Whether you're at home, at the office, or on the go — this is the upgrade you've been waiting for.`,
      benefits: [
        "Premium quality materials — built to last",
        "Free worldwide shipping on all orders",
        "30-day money-back guarantee",
        "Eco-friendly & sustainable packaging",
        "Trusted by 10,000+ happy customers",
      ],
      faq: [
        [
          "How long does shipping take?",
          "Standard delivery: 7-14 business days. Express: 3-5 days.",
        ],
        [
          "Is there a return policy?",
          "Yes! Full refund within 30 days, no questions asked.",
        ],
        [
          "What's the product made of?",
          "High-grade sustainable materials, rigorously tested for safety.",
        ],
      ],
      adCopy: `🔥 GOING VIRAL: Everyone's switching to ${product.name}!\n\n✅ ${product.margin.toFixed(0)}% of customers said it changed their life\n⭐ 4.9 stars — 10,000+ reviews\n🚚 FREE shipping this week only\n\nShop now before we run out → Link in bio`,
    });
    setGenerating(false);
    onNotif({
      type: "success",
      text: "✨ Product page generated successfully!",
    });
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">AI Content Generator</div>
          <div className="section-sub">
            Generate complete, conversion-optimized product pages with AI
          </div>
        </div>
        <div className="ai-badge">🤖 GPT-4o Powered</div>
      </div>

      <div className="grid-1-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title mb-16">Select Product</div>
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              onClick={() => setProduct(p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: "var(--r2)",
                cursor: "pointer",
                marginBottom: 6,
                background:
                  product.id === p.id ? "rgba(99,102,241,0.12)" : "var(--bg3)",
                border: `1px solid ${product.id === p.id ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
              }}
            >
              <span style={{ fontSize: 20 }}>{p.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </div>
                <div className="text-xs text-muted">
                  Score: {p.score} · {p.margin.toFixed(0)}% margin
                </div>
              </div>
              {product.id === p.id && (
                <span style={{ color: "var(--accent2)", fontSize: 14 }}>✓</span>
              )}
            </div>
          ))}
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 12 }}
            onClick={generate}
            disabled={generating}
          >
            {generating ? (
              <>
                <div
                  className="spinner"
                  style={{ width: 14, height: 14, borderWidth: 2 }}
                />{" "}
                Generating...
              </>
            ) : (
              "✨ Generate Content"
            )}
          </button>
        </div>

        <div className="card">
          {generating && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div className="ai-typing">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
                <span className="text-accent" style={{ fontSize: 13 }}>
                  {steps[step]}
                </span>
              </div>
              <div className="progress mb-16">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((step + 1) / steps.length) * 100}%`,
                    background: "linear-gradient(90deg,var(--accent),#a855f7)",
                  }}
                />
              </div>
              {steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      color:
                        i < step
                          ? "var(--green)"
                          : i === step
                            ? "var(--accent2)"
                            : "var(--muted)",
                      fontSize: 14,
                    }}
                  >
                    {i < step ? "✓" : i === step ? "⟳" : "○"}
                  </span>
                  <span
                    style={{
                      color: i <= step ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          )}
          {!generating && !content && (
            <div className="empty">
              <div className="empty-icon">✨</div>
              <div className="empty-title">Ready to Generate</div>
              <div className="empty-sub">
                Select a product and click "Generate Content" to create an
                AI-powered product page
              </div>
            </div>
          )}
          {content && (
            <div className="animate-in">
              <div style={{ marginBottom: 14 }}>
                <div className="form-label">Optimized Title</div>
                <div
                  style={{
                    background: "var(--bg3)",
                    borderRadius: "var(--r)",
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {content.title}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div className="form-label">Description</div>
                <div
                  style={{
                    background: "var(--bg3)",
                    borderRadius: "var(--r)",
                    padding: "10px 12px",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {content.description}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div className="form-label">Key Benefits</div>
                <div
                  style={{
                    background: "var(--bg3)",
                    borderRadius: "var(--r)",
                    padding: "10px 12px",
                  }}
                >
                  {content.benefits.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        padding: "3px 0",
                        fontSize: 12.5,
                      }}
                    >
                      <span style={{ color: "var(--green)" }}>✓</span>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div className="form-label">Ad Copy</div>
                <div
                  style={{
                    background: "var(--bg3)",
                    borderRadius: "var(--r)",
                    padding: "10px 12px",
                    fontSize: 12.5,
                    lineHeight: 1.7,
                    whiteSpace: "pre-line",
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  {content.adCopy}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }}>
                  📋 Copy All
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() =>
                    onNotif({
                      type: "success",
                      text: "🛒 Published to Shopify store!",
                    })
                  }
                >
                  🛒 Publish to Store
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STORE AUTOMATION ─────────────────────────────────────────────────────────
function StoreAutomation({ onNotif }) {
  const [syncing, setSyncing] = useState(false);

  async function sync() {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSyncing(false);
    onNotif({ type: "success", text: "🔄 Store synced — 6 products updated!" });
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Store Automation</div>
          <div className="section-sub">
            Shopify integration — auto publish, sync inventory & pricing
          </div>
        </div>
        <button className="btn btn-secondary" onClick={sync} disabled={syncing}>
          {syncing ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />{" "}
              Syncing...
            </>
          ) : (
            "🔄 Sync All"
          )}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          {
            icon: "🛒",
            name: "Shopify Store",
            status: "Connected",
            detail: "mystore.myshopify.com",
            color: "green",
          },
          {
            icon: "📦",
            name: "Products",
            status: "6 Active",
            detail: "2 syncing pending",
            color: "blue",
          },
          {
            icon: "💵",
            name: "Pricing Rules",
            status: "Auto",
            detail: "2.5x markup active",
            color: "orange",
          },
        ].map((c) => (
          <div
            key={c.name}
            className="card"
            style={{ display: "flex", gap: 14, alignItems: "center" }}
          >
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div>
                <span className={`badge badge-${c.color}`}>{c.status}</span>
              </div>
              <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                {c.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-20">
        <div className="card-header">
          <div className="card-title">Published Products</div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              onNotif({
                type: "info",
                text: "📦 Auto-publishing new products...",
              })
            }
          >
            + Add Product
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Shopify Status</th>
                <th>Cost</th>
                <th>Sale Price</th>
                <th>Inventory</th>
                <th>Last Sync</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${p.status === "active" ? "green" : p.status === "published" ? "blue" : "gray"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="text-muted2">{fmt$(p.cost)}</td>
                  <td className="num-green">{fmt$(p.price)}</td>
                  <td>∞</td>
                  <td className="text-muted2 text-sm">2 min ago</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm">Edit</button>
                      <button className="btn btn-danger btn-sm">Pause</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title mb-16">Automation Settings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            [
              "Auto-publish new products",
              "Publish approved products to Shopify automatically",
              true,
            ],
            [
              "Dynamic pricing",
              "Adjust prices based on competitor analysis",
              false,
            ],
            ["Inventory sync", "Sync stock levels every 30 minutes", true],
            [
              "Auto price markup",
              "Apply 2.5x markup to all new products",
              true,
            ],
          ].map(([name, desc, on], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{name}</div>
                <div className="text-sm text-muted">{desc}</div>
              </div>
              <Toggle
                on={on}
                onChange={() =>
                  onNotif({
                    type: "info",
                    text: `${on ? "Disabled" : "Enabled"}: ${name}`,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADS GENERATOR ────────────────────────────────────────────────────────────
function AdsGenerator({ onNotif }) {
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [adPreview, setAdPreview] = useState(null);

  async function generateAds() {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 2200));
    setCreating(false);
    setAdPreview(true);
    onNotif({ type: "success", text: "🎨 3 ad variations created with AI!" });
  }

  const adVariants = [
    {
      hook: "🔥 Everyone's talking about this...",
      copy: "The product that sold 10,000 units in 3 days. Limited stock — order yours now!",
      cta: "Shop Now",
      score: 94,
    },
    {
      hook: "😍 I can't believe I waited so long...",
      copy: "After trying every brand out there, this is the ONLY one that actually works. See why.",
      cta: "Learn More",
      score: 88,
    },
    {
      hook: "⚡ Flash Sale — 48 Hours Only",
      copy: "Get yours before the price goes back up. Free shipping on all orders. 30-day guarantee.",
      cta: "Claim Offer",
      score: 91,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">AI Ads Generator</div>
          <div className="section-sub">
            Create high-converting ad creatives with AI copywriting
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Ad Campaign
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Create Ad Campaign</div>
            <div className="modal-sub">
              Configure your campaign and let AI generate everything
            </div>
            <div className="form-group">
              <label className="form-label">Select Product</label>
              <select className="form-select">
                {PRODUCTS.map((p) => (
                  <option key={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Campaign Objective</label>
              <select className="form-select">
                <option>Conversions</option>
                <option>Traffic</option>
                <option>Engagement</option>
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Daily Budget (USD)</label>
                <input className="form-input" defaultValue="30" type="number" />
              </div>
              <div className="form-group">
                <label className="form-label">Target Country</label>
                <select className="form-select">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Target Audience (AI Suggested)
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  "Health enthusiasts",
                  "Online shoppers 25-44",
                  "Wellness products",
                  "Fitness & lifestyle",
                ].map((t) => (
                  <span
                    key={t}
                    className="tag"
                    style={{ cursor: "pointer", borderColor: "var(--accent)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={creating}
                onClick={() => {
                  setShowModal(false);
                  generateAds();
                }}
              >
                {creating ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: 14, height: 14, borderWidth: 2 }}
                    />
                    Generating...
                  </>
                ) : (
                  "🤖 Generate with AI"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {creating && (
        <div className="card mb-20">
          <div className="loader" style={{ padding: "30px" }}>
            <div style={{ position: "relative" }}>
              <div className="spinner" style={{ width: 40, height: 40 }} />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤖
              </span>
            </div>
            <div className="text-sm text-muted">
              AI generating ad variations, targeting & creatives...
            </div>
          </div>
        </div>
      )}

      {adPreview && (
        <div className="mb-24 animate-in">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div className="ai-badge">✨ AI Generated Variations</div>
            <span className="text-sm text-muted">
              3 variations ready to launch
            </span>
          </div>
          <div className="grid-3">
            {adVariants.map((v, i) => (
              <div
                key={i}
                className="card"
                style={{
                  borderColor:
                    i === 0 ? "rgba(99,102,241,0.3)" : "var(--border)",
                }}
              >
                {i === 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--accent2)",
                      fontWeight: 700,
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ⭐ Best Predicted
                  </div>
                )}
                <div
                  style={{
                    background: "var(--bg3)",
                    borderRadius: "var(--r2)",
                    padding: "16px",
                    marginBottom: 12,
                    minHeight: 120,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginBottom: 6,
                    }}
                  >
                    SPONSORED
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}
                  >
                    {v.hook}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--muted2)",
                      lineHeight: 1.5,
                    }}
                  >
                    {v.copy}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span
                      style={{
                        background: "var(--accent)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {v.cta}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span className="text-xs text-muted">AI Score</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: v.score >= 90 ? "var(--green)" : "var(--accent2)",
                    }}
                  >
                    {v.score}/100
                  </span>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%" }}
                  onClick={() =>
                    onNotif({
                      type: "success",
                      text: `🚀 Variation ${i + 1} launched on Meta Ads!`,
                    })
                  }
                >
                  Launch This Ad
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Active Ad Sets</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ad Name</th>
                <th>Product</th>
                <th>Status</th>
                <th>Daily Budget</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>ROAS</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>
                    {c.name.split("—")[0]}
                  </td>
                  <td>{c.product}</td>
                  <td>
                    <span
                      className={`badge badge-${c.status === "active" ? "green" : c.status === "paused" ? "orange" : "gray"}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{fmt$(c.budget)}</td>
                  <td>{fmtK(c.impressions)}</td>
                  <td>{c.ctr}%</td>
                  <td>
                    {c.roas > 0 ? (
                      <span className="num-green">{c.roas}x</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm">Edit</button>
                      <button className="btn btn-danger btn-sm">Pause</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADS AUTOMATION ───────────────────────────────────────────────────────────
function AdsAutomation({ onNotif }) {
  const [launching, setLaunching] = useState(null);

  async function launchCampaign(id) {
    setLaunching(id);
    await new Promise((r) => setTimeout(r, 2000));
    setLaunching(null);
    onNotif({ type: "success", text: "🚀 Campaign launched on Meta Ads!" });
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Ads Automation</div>
          <div className="section-sub">
            Meta Ads integration — auto-create and launch campaigns
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge badge-green">Meta Ads Connected</span>
          <button className="btn btn-primary btn-sm">Sync from Meta</button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { l: "Total Ad Spend", v: "$1,245", icon: "💸", color: "" },
          { l: "Total Revenue", v: "$5,676", icon: "💰", color: "green" },
          { l: "Overall ROAS", v: "4.55x", icon: "📈", color: "" },
          { l: "Active Ads", v: "11", icon: "🎯", color: "cyan" },
        ].map((s) => (
          <div
            key={s.l}
            className={`stat-card ${s.color}`}
            style={{ textAlign: "center", padding: "16px 12px" }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {s.v}
            </div>
            <div className="text-xs text-muted">{s.l}</div>
          </div>
        ))}
      </div>

      {CAMPAIGNS.map((c) => (
        <div key={c.id} className="campaign-card">
          <div className="campaign-header">
            <div className="campaign-emoji">{c.product.split(" ")[0]}</div>
            <div style={{ flex: 1 }}>
              <div className="campaign-name">{c.name}</div>
              <div className="campaign-platform">Meta Ads · {c.product}</div>
            </div>
            <span
              className={`badge badge-${c.status === "active" ? "green" : c.status === "paused" ? "orange" : "gray"}`}
            >
              {c.status}
            </span>
            {c.status === "draft" && (
              <button
                className="btn btn-green btn-sm"
                disabled={launching === c.id}
                onClick={() => launchCampaign(c.id)}
              >
                {launching === c.id ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: 12, height: 12, borderWidth: 2 }}
                    />
                    Launching...
                  </>
                ) : (
                  "🚀 Launch"
                )}
              </button>
            )}
            {c.status !== "draft" && (
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-secondary btn-sm">Edit</button>
                <button className="btn btn-danger btn-sm">
                  {c.status === "active" ? "Pause" : "Resume"}
                </button>
              </div>
            )}
          </div>
          <div className="campaign-metrics">
            {[
              ["Budget", fmt$(c.budget) + "/d"],
              ["Spend", fmt$(c.spend)],
              ["Revenue", fmt$(c.revenue)],
              ["ROAS", c.roas ? c.roas + "x" : "—"],
              ["CTR", c.ctr ? c.ctr + "%" : "—"],
            ].map(([l, v]) => (
              <div key={l} className="campaign-metric">
                <div
                  className="cm-val"
                  style={{
                    color:
                      l === "ROAS" && c.roas >= 3
                        ? "var(--green)"
                        : l === "Revenue"
                          ? "var(--green)"
                          : "",
                  }}
                >
                  {v}
                </div>
                <div className="cm-lbl">{l}</div>
              </div>
            ))}
          </div>
          {c.status === "active" && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span className="text-xs text-muted">Budget used today</span>
                <span className="text-xs text-muted">
                  {fmt$(c.spend)} / {fmt$(c.budget)}
                </span>
              </div>
              <div className="progress">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((c.spend / c.budget) * 100, 100)}%`,
                    background:
                      c.roas >= 3
                        ? "linear-gradient(90deg,var(--green),#34d399)"
                        : "linear-gradient(90deg,var(--accent),#7c3aed)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── AUTO FULFILLMENT ─────────────────────────────────────────────────────────
function AutoFulfillment({ onNotif }) {
  const [processing, setProcessing] = useState(null);

  async function fulfill(id) {
    setProcessing(id);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(null);
    onNotif({
      type: "success",
      text: "📦 Order fulfilled via CJ Dropshipping!",
    });
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Auto Fulfillment</div>
          <div className="section-sub">
            Automated order processing via CJ Dropshipping & AliExpress
          </div>
        </div>
        <div className="ai-badge">🤖 Auto-fulfilling orders</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { l: "Orders Today", v: "24", icon: "📦" },
          { l: "Fulfilled", v: "21", icon: "✅", color: "green" },
          { l: "Processing", v: "3", icon: "⟳", color: "orange" },
          { l: "Avg Fulfillment", v: "4.2 hrs", icon: "⚡" },
        ].map((s) => (
          <div
            key={s.l}
            className={`stat-card ${s.color || ""}`}
            style={{ padding: "16px 20px" }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.l}</div>
            <div className="stat-value" style={{ fontSize: 24 }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-20">
        <div className="card">
          <div className="card-title mb-16">Supplier Status</div>
          {[
            {
              name: "CJ Dropshipping",
              emoji: "📦",
              status: "Connected",
              orders: 18,
              time: "2-3 days",
            },
            {
              name: "AliExpress",
              emoji: "🏪",
              status: "Connected",
              orders: 6,
              time: "5-7 days",
            },
          ].map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                <div className="text-xs text-muted">
                  {s.orders} orders · Avg {s.time} shipping
                </div>
              </div>
              <span className="badge badge-green">{s.status}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title mb-16">Fulfillment Rules</div>
          {[
            ["Primary provider", "CJ Dropshipping"],
            ["Fallback provider", "AliExpress"],
            ["Auto-fulfill", "Enabled"],
            ["Notify customer", "On ship"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
                fontSize: 13,
              }}
            >
              <span className="text-muted">{k}</span>
              <span style={{ fontWeight: 600, color: "var(--accent2)" }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Orders</div>
          <span className="badge badge-blue">{ORDERS.length} orders</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Sale</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: "var(--accent2)" }}>
                    {o.id}
                  </td>
                  <td>{o.customer}</td>
                  <td>{o.product}</td>
                  <td>{fmt$(o.amount)}</td>
                  <td className="text-muted2">{fmt$(o.cost)}</td>
                  <td className="num-green">{fmt$(o.profit)}</td>
                  <td>
                    <span
                      className={`badge badge-${o.status === "delivered" ? "green" : o.status === "shipped" ? "cyan" : o.status === "processing" ? "orange" : "gray"}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="text-sm">
                    {o.tracking ? (
                      <span
                        className="text-accent"
                        style={{ fontSize: 11, fontFamily: "monospace" }}
                      >
                        {o.tracking.slice(0, 12)}...
                      </span>
                    ) : (
                      "Pending"
                    )}
                  </td>
                  <td>
                    {o.status === "processing" && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={processing === o.id}
                        onClick={() => fulfill(o.id)}
                      >
                        {processing === o.id ? (
                          <>
                            <div
                              className="spinner"
                              style={{ width: 12, height: 12, borderWidth: 2 }}
                            />
                            ...
                          </>
                        ) : (
                          "Fulfill"
                        )}
                      </button>
                    )}
                    {o.status !== "processing" && (
                      <button className="btn btn-ghost btn-sm">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AI OPTIMIZATION ──────────────────────────────────────────────────────────
function AIOptimization({ onNotif }) {
  const [analyzing, setAnalyzing] = useState(false);

  async function analyze() {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setAnalyzing(false);
    onNotif({
      type: "success",
      text: "🤖 AI optimization complete — 2 actions taken!",
    });
  }

  const rules = [
    {
      icon: "📈",
      name: "Auto Scale Budget",
      desc: "Scale +20% when ROAS > 3.0 for 3 consecutive days",
      active: true,
      triggered: 3,
    },
    {
      icon: "⏸️",
      name: "Pause Low CTR",
      desc: "Pause ad set if CTR < 0.8% after 48 hours",
      active: true,
      triggered: 1,
    },
    {
      icon: "🔄",
      name: "Rotate Creatives",
      desc: "Swap creatives when frequency exceeds 3.5",
      active: true,
      triggered: 2,
    },
    {
      icon: "🛑",
      name: "Kill Loss Campaigns",
      desc: "Pause if ROAS < 0.5 for 3 days — immediate alert",
      active: true,
      triggered: 0,
    },
    {
      icon: "🎯",
      name: "Lookalike Expansion",
      desc: "Create 2% LAL when 1% LAL ROAS > 4.0",
      active: false,
      triggered: 0,
    },
    {
      icon: "💰",
      name: "Bid Optimizer",
      desc: "Reduce bid by 15% when CPC exceeds 2x benchmark",
      active: true,
      triggered: 4,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">AI Optimization Engine</div>
          <div className="section-sub">
            Automated campaign optimization — scale winners, cut losers
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={analyze}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />{" "}
              Analyzing...
            </>
          ) : (
            "🤖 Run AI Analysis"
          )}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { l: "Actions This Week", v: "12", icon: "⚡" },
          { l: "Budget Scaled", v: "+$85", icon: "📈", color: "green" },
          { l: "Ads Paused", v: "3", icon: "⏸️", color: "orange" },
          { l: "Revenue Saved", v: "$340", icon: "💰", color: "green" },
        ].map((s) => (
          <div
            key={s.l}
            className={`stat-card ${s.color || ""}`}
            style={{ padding: "16px 20px" }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.l}</div>
            <div className="stat-value" style={{ fontSize: 24 }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {analyzing && (
        <div className="card mb-20">
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <div className="ai-typing">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
            <div className="text-sm text-accent" style={{ marginBottom: 12 }}>
              AI analyzing 5 campaigns, 11 ad sets, 22 creatives...
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
              }}
            >
              {[
                "Scanning ROAS trends",
                "Evaluating CTR performance",
                "Checking budget efficiency",
              ].map((t, i) => (
                <div key={i} className="metric-box">
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🔍</div>
                  <div className="lbl">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid-2 mb-20">
        <div className="card">
          <div className="card-title mb-16">🏆 Winning Ads</div>
          {CAMPAIGNS.filter((c) => c.roas >= 3.5).map((c) => (
            <div
              key={c.id}
              style={{
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "var(--r2)",
                padding: "12px 14px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {c.name.split("—")[0]}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "var(--green)",
                    fontSize: 16,
                  }}
                >
                  {c.roas}x ROAS
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: 12,
                  color: "var(--muted2)",
                }}
              >
                <span>Spend: {fmt$(c.spend)}</span>
                <span>Revenue: {fmt$(c.revenue)}</span>
                <span>Conv: {c.conversions}</span>
              </div>
              <button
                className="btn btn-green btn-sm"
                style={{ marginTop: 8 }}
                onClick={() =>
                  onNotif({
                    type: "success",
                    text: `📈 Scaling budget for ${c.name.split("—")[0]}`,
                  })
                }
              >
                📈 Scale +20%
              </button>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title mb-16">⚠️ Underperforming Ads</div>
          {CAMPAIGNS.filter((c) => c.roas > 0 && c.roas < 3).map((c) => (
            <div
              key={c.id}
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "var(--r2)",
                padding: "12px 14px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {c.name.split("—")[0]}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "var(--orange)",
                    fontSize: 16,
                  }}
                >
                  {c.roas}x ROAS
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted2)" }}>
                CTR: {c.ctr}% · CPC: {fmt$(c.cpc)}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    onNotif({
                      type: "info",
                      text: "🔄 Rotating ad creatives...",
                    })
                  }
                >
                  Rotate Creatives
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onNotif({ type: "info", text: "⏸️ Ad set paused." })
                  }
                >
                  Pause
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Optimization Rules</div>
        </div>
        {rules.map((r, i) => (
          <div key={i} className="rule-card">
            <div className="rule-icon">{r.icon}</div>
            <div className="rule-info">
              <div className="rule-name">{r.name}</div>
              <div className="rule-desc">{r.desc}</div>
            </div>
            {r.triggered > 0 && (
              <span className="badge badge-blue" style={{ marginRight: 10 }}>
                {r.triggered}x triggered
              </span>
            )}
            <Toggle
              on={r.active}
              onChange={() =>
                onNotif({
                  type: "info",
                  text: `${r.active ? "Disabled" : "Enabled"}: ${r.name}`,
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function Analytics({ onNotif }) {
  const [range, setRange] = useState("7d");

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Analytics & Insights</div>
          <div className="section-sub">
            Real-time performance data across all campaigns and products
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["24h", "7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              className={`btn ${range === r ? "btn-secondary" : "btn-ghost"} btn-sm`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              onNotif({ type: "info", text: "📊 Generating PDF report..." })
            }
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="stats-grid mb-20">
        {[
          { l: "Gross Revenue", v: "$4,284", d: "+23.4%", up: true },
          { l: "Net Profit", v: "$1,847", d: "+18.2%", up: true },
          { l: "Ad Spend", v: "$1,245", d: "+5.1%", up: false },
          { l: "ROAS", v: "4.55x", d: "+0.8", up: true },
        ].map((s, i) => (
          <div
            key={i}
            className={`stat-card ${i === 1 || i === 3 ? "green" : ""}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="stat-label">{s.l}</div>
            <div className="stat-value">{s.v}</div>
            <div className={`stat-delta ${s.up ? "delta-up" : "delta-down"}`}>
              {s.up ? "↑" : "↓"} {s.d}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-20">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue vs Ad Spend</div>
            <span className="badge badge-green">+{range}</span>
          </div>
          <MiniChart
            data={REVENUE_DATA}
            labels={REVENUE_DATA.map((_, i) =>
              i % 3 === 0 ? `D${i + 1}` : "",
            )}
            color="#10b981"
          />
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "var(--green)",
                }}
              />
              <span className="text-xs text-muted">Revenue</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "var(--accent)",
                }}
              />
              <span className="text-xs text-muted">Ad Spend</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Campaign Performance</div>
          </div>
          <div>
            {CAMPAIGNS.filter((c) => c.roas > 0).map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {c.name.split("—")[0].trim()}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: c.roas >= 3.5 ? "var(--green)" : "var(--orange)",
                      fontSize: 13,
                    }}
                  >
                    {c.roas}x
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((c.roas / 6) * 100, 100)}%`,
                      background:
                        c.roas >= 3.5
                          ? "linear-gradient(90deg,var(--green),#34d399)"
                          : "linear-gradient(90deg,var(--orange),#fbbf24)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-20">
        <div className="card-header">
          <div className="card-title">Product Performance Matrix</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Avg Order Value</th>
                <th>Margin %</th>
                <th>Ad ROAS</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <span>{p.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="num-green">
                    ${(p.price * (5 + i * 3)).toFixed(2)}
                  </td>
                  <td>{5 + i * 3}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <span style={{ color: "var(--green)", fontWeight: 600 }}>
                      {p.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td>{(2.5 + Math.random() * 3).toFixed(2)}x</td>
                  <td>
                    <div style={{ width: 60 }}>
                      <Sparkline
                        data={[40, 55, 48, 62, 58, 70, p.score]}
                        color={p.trend === "↑" ? "#10b981" : "#6366f1"}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-3">
        {[
          {
            title: "Best Day to Run Ads",
            icon: "📅",
            insight:
              "Friday & Saturday show 34% higher ROAS across all campaigns. Consider increasing weekend budgets.",
            action: "Optimize Schedule",
          },
          {
            title: "Top Converting Audience",
            icon: "🎯",
            insight:
              "Women 28-40 interested in Health & Wellness convert 2.8x better than broad audiences.",
            action: "Create Lookalike",
          },
          {
            title: "AI Prediction",
            icon: "🔮",
            insight:
              "Based on current trajectory, you'll hit $10K/month revenue within 6 weeks if you scale top campaigns.",
            action: "View Forecast",
          },
        ].map((ins, i) => (
          <div
            key={i}
            className="card"
            style={{
              background: "linear-gradient(135deg,var(--surface),var(--bg3))",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{ins.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              {ins.title}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--muted2)",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              {ins.insight}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() =>
                onNotif({
                  type: "info",
                  text: `💡 ${ins.title}: Taking action...`,
                })
              }
            >
              {ins.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ onNotif }) {
  return (
    <div>
      <div className="section-title mb-8">Settings</div>
      <div className="section-sub mb-24">
        Manage your account, integrations and automation preferences
      </div>
      <div className="grid-2">
        <div>
          <div className="card mb-16">
            <div className="card-title mb-16">Account</div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" defaultValue="Alex Johnson" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" defaultValue="alex@mystore.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input
                className="form-input"
                defaultValue="Premium Dropship Co."
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                onNotif({ type: "success", text: "✓ Profile saved!" })
              }
            >
              Save Changes
            </button>
          </div>
          <div className="card">
            <div className="card-title mb-16">Subscription</div>
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.1))",
                border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: "var(--r2)",
                padding: "16px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Pro Plan</div>
                  <div className="text-sm text-muted">
                    $99/month · renews Jan 1
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 22,
                    color: "var(--accent2)",
                  }}
                >
                  $99
                </span>
              </div>
            </div>
            {[
              ["Products researched", "247 / 500"],
              ["Campaigns active", "3 / 25"],
              ["Stores connected", "1 / 10"],
              ["API calls", "18,420 / 50,000"],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <span className="text-muted">{l}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 14 }}
              onClick={() =>
                onNotif({
                  type: "info",
                  text: "↗ Redirecting to upgrade page...",
                })
              }
            >
              Upgrade to Enterprise
            </button>
          </div>
        </div>
        <div>
          <div className="card mb-16">
            <div className="card-title mb-16">Integrations</div>
            {[
              {
                emoji: "🛒",
                name: "Shopify",
                status: "Connected",
                detail: "mystore.myshopify.com",
              },
              {
                emoji: "📘",
                name: "Meta Ads",
                status: "Connected",
                detail: "Act. #123456789",
              },
              {
                emoji: "📦",
                name: "CJ Dropshipping",
                status: "Connected",
                detail: "Premium partner",
              },
              {
                emoji: "🏪",
                name: "AliExpress",
                status: "Connected",
                detail: "Standard access",
              },
              {
                emoji: "📧",
                name: "SendGrid Email",
                status: "Not connected",
                detail: "Email notifications",
              },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 22 }}>{s.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                    {s.name}
                  </div>
                  <div className="text-xs text-muted">{s.detail}</div>
                </div>
                <span
                  className={`badge badge-${s.status === "Connected" ? "green" : "gray"}`}
                >
                  {s.status}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    onNotif({ type: "info", text: `Configuring ${s.name}...` })
                  }
                >
                  {s.status === "Connected" ? "Manage" : "Connect"}
                </button>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title mb-16">Notifications</div>
            {[
              ["New winning product found", true],
              ["Campaign auto-scaled", true],
              ["Order received", true],
              ["Ad paused (low performance)", true],
              ["Weekly performance report", false],
            ].map(([n, on], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ flex: 1, fontSize: 13 }}>{n}</div>
                <Toggle
                  on={on}
                  onChange={() =>
                    onNotif({
                      type: "info",
                      text: `Notification preference updated`,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Overview",
    items: [{ id: "dashboard", icon: "⬛", label: "Dashboard" }],
  },
  {
    section: "Automation",
    items: [
      { id: "research", icon: "🔍", label: "Product Research", badge: "4" },
      { id: "content", icon: "✨", label: "Content Generator", badge: null },
      { id: "store", icon: "🛒", label: "Store Automation", badge: null },
    ],
  },
  {
    section: "Advertising",
    items: [
      { id: "ads-gen", icon: "🎨", label: "Ads Generator", badge: null },
      {
        id: "ads-auto",
        icon: "🚀",
        label: "Ads Automation",
        badge: "3",
        badgeColor: "green",
      },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        id: "fulfillment",
        icon: "📦",
        label: "Auto Fulfillment",
        badge: "3",
        badgeColor: "orange",
      },
      { id: "optimize", icon: "🤖", label: "AI Optimization", badge: null },
    ],
  },
  {
    section: "Insights",
    items: [
      { id: "analytics", icon: "📊", label: "Analytics", badge: null },
      { id: "settings", icon: "⚙️", label: "Settings", badge: null },
    ],
  },
];

const PAGE_TITLES = {
  dashboard: "Dashboard",
  research: "Product Research",
  content: "Content Generator",
  store: "Store Automation",
  "ads-gen": "Ads Generator",
  "ads-auto": "Ads Automation",
  fulfillment: "Auto Fulfillment",
  optimize: "AI Optimization",
  analytics: "Analytics",
  settings: "Settings",
};

export default function AutoDropshipAI() {
  const [onboarded, setOnboarded] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [notifs, setNotifs] = useState([]);

  function addNotif(n) {
    const id = Date.now();
    setNotifs((prev) => [...prev, { ...n, id }]);
    setTimeout(
      () => setNotifs((prev) => prev.filter((x) => x.id !== id)),
      4000,
    );
  }

  const pages = {
    dashboard: <Dashboard />,
    research: <ProductResearch onNotif={addNotif} />,
    content: <ContentGenerator onNotif={addNotif} />,
    store: <StoreAutomation onNotif={addNotif} />,
    "ads-gen": <AdsGenerator onNotif={addNotif} />,
    "ads-auto": <AdsAutomation onNotif={addNotif} />,
    fulfillment: <AutoFulfillment onNotif={addNotif} />,
    optimize: <AIOptimization onNotif={addNotif} />,
    analytics: <Analytics onNotif={addNotif} />,
    settings: <Settings onNotif={addNotif} />,
  };

  if (!onboarded)
    return (
      <>
        <style>{CSS}</style>
        <Onboarding onDone={() => setOnboarded(true)} />
      </>
    );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🚀</div>
            <div className="logo-text">
              Auto<span>Dropship</span>
              <br />
              <span
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                }}
              >
                AI Platform v1.0
              </span>
            </div>
          </div>

          <div style={{ padding: "8px 10px 0" }}>
            {NAV.map((sec) => (
              <div key={sec.section} className="nav-section">
                <div className="nav-label">{sec.section}</div>
                {sec.items.map((item) => (
                  <div
                    key={item.id}
                    className={`nav-item ${page === item.id ? "active" : ""}`}
                    onClick={() => setPage(item.id)}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`nav-badge ${item.badgeColor || ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08))",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "var(--r2)",
                padding: "10px 12px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent2)",
                  marginBottom: 2,
                }}
              >
                🤖 AI Running
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                Scanning products & optimizing 3 campaigns
              </div>
            </div>
            <div className="user-card">
              <div className="avatar">AJ</div>
              <div className="user-info">
                <div className="name">Alex Johnson</div>
                <div className="plan">Pro Plan · $99/mo</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {PAGE_TITLES[page]}
              <span>AutoDropship AI</span>
            </div>
            <div className="ai-badge" style={{ marginRight: 4 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--green)",
                  boxShadow: "0 0 6px var(--green)",
                }}
              />
              All Systems Live
            </div>
            <button className="btn btn-ghost btn-sm">🔔</button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                addNotif({
                  type: "success",
                  text: "🤖 AI automation cycle triggered!",
                })
              }
            >
              ⚡ Run Automation
            </button>
          </div>

          <div className="content">{pages[page]}</div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="notif-container">
          {notifs.map((n) => (
            <div key={n.id} className={`notif ${n.type || "info"}`}>
              <span className="notif-icon">
                {n.type === "success" ? "✅" : n.type === "error" ? "❌" : "ℹ️"}
              </span>
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
