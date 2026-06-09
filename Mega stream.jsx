import { useState, useEffect, useRef } from "react";

// ─── TMDB API CONFIGURATION ────────────────────────────────────────────────
const TMDB_API_KEY = "ab456618944e64cf0ff6be1b1afbe8fd"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";

// ─── ICONS COMPONENTS ───────────────────────────────────────────────────────
const PlayIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const StarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);
const XIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ArrowLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);
const ServerIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);
const FireIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#ff2a54">
    <path d="M12 2c0 0-2 4-2 7 0 1.1.9 2 2 2s2-.9 2-2c0-.5-.1-1-.3-1.4C15.5 9 17 11.3 17 14c0 2.8-2.2 5-5 5s-5-2.2-5-5c0-4 3.5-8 5-12z"/>
  </svg>
);
const HeartIcon = ({ size = 18, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ff2a54" : "none"} stroke={filled ? "#ff2a54" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const LayersIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const AlertIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ExternalLinkIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ─── CSS GLOBAL STYLES (INJECTED) ──────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif; }
  
  :root {
    --bg-main: #06070d;
    --bg-nav: rgba(6, 7, 13, 0.85);
    --bg-surface: #11131f;
    --bg-surface-hover: #171a2b;
    --accent: #ff2a54;
    --accent-hover: #e01b43;
    --accent-glow: rgba(255, 42, 84, 0.35);
    --text-primary: #ffffff;
    --text-secondary: #94a3b8;
    --text-muted: #475569;
    --border: rgba(255, 255, 255, 0.06);
    --radius-lg: 16px;
    --radius-md: 12px;
    --transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body { background: var(--bg-main); color: var(--text-primary); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-main); }
  ::-webkit-scrollbar-thumb { background: #222538; border-radius: 20px; }
  ::-webkit-scrollbar-thumb:hover { background: #2f3452; }

  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); background: var(--bg-nav); border-bottom: 1px solid var(--border); padding: 0 2.5rem; height: 72px; display: flex; align-items: center; justify-content: space-between; }
  .logo { font-size: 1.5rem; font-weight: 900; color: var(--accent); letter-spacing: -0.5px; cursor: pointer; text-shadow: 0 0 20px var(--accent-glow); }
  .logo span { color: white; }
  .nav-links { display: flex; gap: 0.5rem; }
  .nav-link { background: none; border: none; color: var(--text-secondary); font-size: 0.95rem; font-weight: 700; padding: 0.6rem 1.1rem; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
  .nav-link:hover, .nav-link.active { color: var(--text-primary); background: rgba(255,255,255,0.05); }
  .nav-link.active { color: var(--accent); background: rgba(255, 42, 84, 0.1); }
  .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; cursor: pointer; border: 2px solid rgba(255, 42, 84, 0.3); }

  .hero { position: relative; height: 75vh; min-height: 550px; display: flex; align-items: flex-end; overflow: hidden; background: #000; }
  .hero-bg { position: absolute; inset: 0; }
  .hero-img { width: 100%; height: 100%; object-fit: cover; object-position: center 15%; opacity: 0.45; }
  .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg-main) 0%, rgba(6,7,13,0.3) 70%, transparent 100%); }
  .hero-gradient-left { position: absolute; inset: 0; background: linear-gradient(to right, var(--bg-main) 0%, rgba(6,7,13,0.5) 50%, transparent 100%); }
  .hero-content { position: relative; z-index: 2; padding: 0 4rem 4rem; max-width: 800px; text-align: left; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 42, 84, 0.16); border: 1px solid rgba(255, 42, 84, 0.3); color: var(--accent); font-size: 0.8rem; font-weight: 700; padding: 6px 14px; border-radius: 30px; margin-bottom: 1.25rem; }
  .hero-title { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 900; line-height: 1.2; margin-bottom: 1.25rem; color: #fff; }
  .hero-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; }
  .hero-rating { display: flex; align-items: center; gap: 5px; color: #f59e0b; }
  .hero-desc { font-size: 1rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  .btn { display: inline-flex; align-items: center; gap: 10px; border: none; border-radius: var(--radius-md); font-size: 0.95rem; font-weight: 700; cursor: pointer; padding: 0.85rem 1.8rem; transition: var(--transition); }
  .btn-primary { background: var(--accent); color: white; box-shadow: 0 4px 20px rgba(255, 42, 84, 0.3); }
  .btn-primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(255, 42, 84, 0.5); }
  .btn-secondary { background: rgba(255,255,255,0.08); color: white; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08); }
  .btn-secondary:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }

  .search-wrapper { position: relative; z-index: 10; padding: 0 3.5rem; margin-top: -32px; margin-bottom: 3.5rem; }
  .search-container { max-width: 750px; margin: 0 auto; position: relative; }
  .search-input { width: 100%; background: rgba(17, 19, 31, 0.92); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 1.1rem 1.1rem 1.1rem 3.8rem; font-size: 1.05rem; color: var(--text-primary); outline: none; transition: var(--transition); box-shadow: 0 10px 40px rgba(0,0,0,0.5); text-align: right; direction: rtl; }
  .search-input:focus { border-color: rgba(255, 42, 84, 0.5); box-shadow: 0 10px 40px rgba(255, 42, 84, 0.15); }
  .search-icon { position: absolute; left: 1.35rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary); pointer-events: none; }
  .search-clear { position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.06); border: none; color: var(--text-secondary); cursor: pointer; border-radius: 50%; padding: 6px; display: flex; }
  
  .search-results { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: rgba(17, 19, 31, 0.98); backdrop-filter: blur(30px); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,0.8); max-height: 400px; overflow-y: auto; z-index: 110; padding: 0.5rem; }
  .search-result-item { display: flex; align-items: center; gap: 14px; padding: 12px; cursor: pointer; border-radius: 12px; transition: var(--transition); direction: rtl; }
  .search-result-item:hover { background: rgba(255,255,255,0.05); }
  .search-result-poster { width: 45px; height: 64px; object-fit: cover; border-radius: 8px; flex-shrink: 0; background: var(--bg-surface); }
  .search-result-info { flex: 1; min-width: 0; text-align: right; }
  .search-result-title { font-size: 0.95rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
  .search-result-meta { font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; display: flex; align-items: center; gap: 8px; justify-content: flex-start; }

  .section { padding: 0 3.5rem; margin-bottom: 4rem; }
  .section-header { display: flex; align-items: center; justify-content: flex-end; margin-bottom: 1.5rem; }
  .section-title { font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px; border-right: 4px solid var(--accent); padding-right: 12px; text-align: right; direction: rtl; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 1.75rem; }

  .card { position: relative; border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-surface); cursor: pointer; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s; aspect-ratio: 2/3; border: 1px solid rgba(255,255,255,0.02); }
  .card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(255, 42, 84, 0.15); border-color: rgba(255, 42, 84, 0.25); }
  .card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .card:hover .card-img { transform: scale(1.05); }
  .card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6, 7, 13, 0.95) 0%, rgba(6, 7, 13, 0.3) 60%, transparent 100%); }
  .card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.1rem; text-align: right; }
  .card-title { font-size: 0.95rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; color: #fff; }
  .card-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; font-weight: 600; direction: rtl; }
  .rating-badge { display: flex; align-items: center; gap: 4px; color: #f59e0b; }
  .genre-badge { color: var(--text-secondary); background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; }
  
  .play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); pointer-events: none; z-index: 3; }
  .card:hover .play-overlay { opacity: 1; }
  .play-btn-circle { width: 50px; height: 50px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px var(--accent-glow); transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .card:hover .play-btn-circle { transform: scale(1); }

  .skeleton-bg { background: linear-gradient(90deg, #11131f 25%, #1d2033 50%, #11131f 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite linear; border-radius: var(--radius-lg); aspect-ratio: 2/3; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .page-detail { min-height: 100vh; padding-top: 72px; padding-bottom: 4rem; }
  .detail-hero { position: relative; height: 35vh; overflow: hidden; width: 100%; }
  .detail-hero-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.15; filter: blur(4px); }
  .detail-hero-grad { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, var(--bg-main) 95%); }
  .detail-content { padding: 0 3.5rem; max-width: 1200px; margin: -180px auto 0; position: relative; z-index: 5; }
  
  .player-container { width: 100%; border-radius: 20px; overflow: hidden; background: #000; margin-bottom: 2rem; aspect-ratio: 16/9; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.05); }
  .player-iframe { width: 100%; height: 100%; border: none; display: block; }

  /* ─── PLAYER LOADING STATE ─── */
  .player-loading {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; background: #0a0b14; gap: 1rem; z-index: 2;
  }
  .player-spinner {
    width: 48px; height: 48px; border: 3px solid rgba(255,42,84,0.2);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .player-loading-text { color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; }

  /* ─── PLAYER ERROR / BLOCKED STATE ─── */
  .player-error {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; background: #0a0b14;
    gap: 1rem; padding: 2rem; text-align: center; z-index: 2;
  }
  .player-error-icon { color: var(--accent); opacity: 0.7; }
  .player-error-title { font-size: 1.1rem; font-weight: 800; color: #fff; }
  .player-error-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; max-width: 380px; direction: rtl; }
  .player-error-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem; }
  .btn-open-tab {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: white; border: none;
    padding: 0.7rem 1.4rem; border-radius: 10px; font-size: 0.88rem;
    font-weight: 700; cursor: pointer; transition: var(--transition);
    text-decoration: none;
  }
  .btn-open-tab:hover { background: var(--accent-hover); transform: translateY(-1px); }
  .btn-try-next {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.06); color: white; border: 1px solid var(--border);
    padding: 0.7rem 1.4rem; border-radius: 10px; font-size: 0.88rem;
    font-weight: 700; cursor: pointer; transition: var(--transition);
  }
  .btn-try-next:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

  .control-panel { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 18px; padding: 1.25rem; margin-bottom: 2rem; }
  .panel-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; }
  
  .server-row { display: flex; gap: 0.65rem; flex-wrap: wrap; }
  .server-btn { display: flex; align-items: center; gap: 8px; padding: 0.6rem 1.1rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--text-secondary); font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: var(--transition); }
  .server-btn:hover { border-color: rgba(255, 42, 84, 0.4); color: white; }
  .server-btn.active { border-color: var(--accent); background: rgba(255, 42, 84, 0.15); color: var(--accent); }
  
  .seasons-wrapper { margin-top: 2.5rem; margin-bottom: 2rem; text-align: right; direction: rtl; }
  .seasons-header-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; justify-content: flex-start; border-right: 3px solid var(--accent); padding-right: 10px; }
  .seasons-list { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 10px; }
  .season-tab { background: #1a1d2e; border: 1px solid var(--border); border-radius: 10px; padding: 0.65rem 1.3rem; font-size: 0.88rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; transition: var(--transition); white-space: nowrap; }
  .season-tab.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 4px 15px var(--accent-glow); }
  
  .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 1.25rem; text-align: right; direction: rtl; }
  .episode-card { background: #131524; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; cursor: pointer; transition: var(--transition); display: flex; flex-direction: column; }
  .episode-card:hover { border-color: var(--accent); transform: translateY(-4px); }
  .episode-card.active { border-color: var(--accent); background: rgba(255, 42, 84, 0.05); }
  .episode-thumb-container { position: relative; width: 100%; aspect-ratio: 16/9; background: #0b0c13; overflow: hidden; }
  .episode-thumb { width: 100%; height: 100%; object-fit: cover; }
  .episode-play-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); }
  .episode-card:hover .episode-play-overlay, .episode-card.active .episode-play-overlay { opacity: 1; }
  .episode-mini-play { width: 36px; height: 36px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; }
  .episode-badge { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.75); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: var(--accent); }
  .episode-meta-info { padding: 1rem; flex: 1; }
  .episode-name { font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .episode-overview { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  .action-btn { display: flex; align-items: center; gap: 8px; padding: 0.65rem 1.2rem; border-radius: 12px; border: 1px solid var(--border); background: rgba(255,255,255,0.03); color: var(--text-secondary); font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: var(--transition); }
  .action-btn.liked { color: var(--accent); border-color: rgba(255, 42, 84, 0.3); background: rgba(255, 42, 84, 0.08); }
  .detail-desc { font-size: 1.05rem; line-height: 1.8; color: rgba(255,255,255,0.75); border-right: 4px solid var(--accent); padding-right: 1.25rem; margin-top: 2rem; margin-bottom: 2.5rem; text-align: right; direction: rtl; }

  .footer { border-top: 1px solid var(--border); padding: 3rem 2rem; text-align: center; margin-top: 6rem; color: var(--text-muted); font-size: 0.85rem; }
  .footer-brand { color: var(--text-secondary); font-weight: 700; }
  
  .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 999; background: rgba(11, 13, 23, 0.95); backdrop-filter: blur(30px); border-top: 1px solid var(--border); padding: 0.65rem 0; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); }
  .mobile-nav-items { display: flex; justify-content: space-around; }
  .mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; color: var(--text-secondary); font-size: 0.75rem; font-weight: 700; cursor: pointer; }
  .mobile-nav-item.active { color: var(--accent); }

  @media(max-width: 900px) {
    .navbar { padding: 0 1.5rem; }
    .hero-content { padding: 0 1.5rem 3rem; }
    .section, .search-wrapper, .detail-content { padding: 0 1.5rem; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 1.25rem; }
  }
  @media(max-width: 768px) {
    .nav-links { display: none; }
    .mobile-nav { display: block; }
    .footer { padding-bottom: 6rem; }
    .panel-row { flex-direction: column; align-items: stretch; }
    .server-row { justify-content: center; }
    .action-btn { justify-content: center; }
  }
`;

// ─── MOVIE CARD SUB-COMPONENT ──────────────────────────────────────────────
const MovieCard = ({ movie, onPlay }) => {
  const isMovie = movie.title ? true : false;
  const title = isMovie ? movie.title : movie.name;
  const releaseDate = isMovie ? movie.release_date : movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  return (
    <div className="card" onClick={() => onPlay(movie)}>
      <img
        className="card-img"
        src={movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
        alt={title}
        loading="lazy"
      />
      <div className="card-overlay" />
      <div className="play-overlay">
        <div className="play-btn-circle">
          <PlayIcon size={18} />
        </div>
      </div>
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-meta">
          <div className="rating-badge">
            <StarIcon size={12} /> {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
          </div>
          <span className="genre-badge">{year}</span>
        </div>
      </div>
    </div>
  );
};

// ─── COMPACT GRID GENERATOR ────────────────────────────────────────────────
const MovieGrid = ({ title, movies, onPlay, loading }) => {
  if (!loading && (!movies || movies.length === 0)) return null;
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">{title}</div>
      </div>
      <div className="grid">
        {loading
          ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton-bg" />)
          : movies.map(m => <MovieCard key={m.id} movie={m} onPlay={onPlay} />)
        }
      </div>
    </div>
  );
};

// ─── SMART PLAYER with load detection & fallback ───────────────────────────
const SmartPlayer = ({ src, iframeKey, onTryNext, hasNext, directUrl }) => {
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const timerRef = useRef(null);

  useEffect(() => {
    setStatus("loading");
    // Most blocked iframes never fire onLoad, so we use a timeout as detection.
    // If the iframe loads correctly it will call handleLoad before timeout fires.
    timerRef.current = setTimeout(() => {
      // Still loading after 10s → assume blocked
      setStatus(prev => prev === "loading" ? "error" : prev);
    }, 10000);
    return () => clearTimeout(timerRef.current);
  }, [iframeKey]);

  const handleLoad = () => {
    clearTimeout(timerRef.current);
    // A blank white page often still fires onLoad from about:blank inside iframe.
    // We trust the load but keep the error fallback button visible via "ready" state.
    setStatus("ready");
  };

  const handleError = () => {
    clearTimeout(timerRef.current);
    setStatus("error");
  };

  return (
    <div className="player-container">
      {/* Always render iframe so it can attempt to load */}
      <iframe
        key={iframeKey}
        className="player-iframe"
        src={src}
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        scrolling="no"
        title="ELS Stream Engine"
        referrerPolicy="no-referrer"
        sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-fullscreen"
        onLoad={handleLoad}
        onError={handleError}
        style={{ opacity: status === "ready" ? 1 : 0, position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {status === "loading" && (
        <div className="player-loading">
          <div className="player-spinner" />
          <div className="player-loading-text">جاري تحميل المشغل...</div>
        </div>
      )}

      {status === "error" && (
        <div className="player-error">
          <div className="player-error-icon"><AlertIcon size={48} /></div>
          <div className="player-error-title">تعذّر تشغيل هذا الخادم</div>
          <div className="player-error-desc">
            قد يكون الخادم محجوباً في متصفحك أو يتطلب فتحه في تبويب جديد.
            جرّب خادماً آخر أو افتح الرابط مباشرةً.
          </div>
          <div className="player-error-actions">
            <a className="btn-open-tab" href={directUrl} target="_blank" rel="noreferrer">
              <ExternalLinkIcon size={14} /> فتح في تبويب جديد
            </a>
            {hasNext && (
              <button className="btn-try-next" onClick={onTryNext}>
                ⚡ جرّب الخادم التالي
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ADVANCED DETAIL PAGE & SERIES EXTRACTION ──────────────────────────────
const DetailPage = ({ movie, onBack, onPlayEpisode }) => {
  const [server, setServer] = useState(0);
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("els_watchlist") || "[]"); } catch { return []; }
  });
  
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const isMovie = movie.title ? true : false;
  const title = isMovie ? movie.title : movie.name;
  const releaseDate = isMovie ? movie.release_date : movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const tmdbId = movie.id;
  
  const isLiked = watchlist.some(item => item.id === movie.id);

  const servers = [
    {
      name: "الخادم الأول",
      url: isMovie
        ? `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${activeSeason}&episode=${activeEpisode}`
    },
    {
      name: "الخادم الثاني",
      url: isMovie
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${activeSeason}/${activeEpisode}`
    },
    {
      name: "الخادم الثالث",
      url: isMovie
        ? `https://autoembed.cc/movie/tmdb/${tmdbId}`
        : `https://autoembed.cc/tv/tmdb/${tmdbId}-${activeSeason}-${activeEpisode}`
    },
    {
      name: "الخادم الرابع",
      url: isMovie
        ? `https://moviesapi.club/movie/${tmdbId}`
        : `https://moviesapi.club/tv/${tmdbId}-${activeSeason}-${activeEpisode}`
    },
    {
      name: "الخادم الخامس",
      url: isMovie
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${activeSeason}&e=${activeEpisode}`
    }
  ];

  // Fetch Full Series Data Stack
  useEffect(() => {
    if (!isMovie) {
      const fetchSeriesDetails = async () => {
        try {
          const res = await fetch(`${TMDB_BASE_URL}/tv/${movie.id}?api_key=${TMDB_API_KEY}&language=ar-EG`);
          const data = await res.json();
          if (data.seasons) {
            const validSeasons = data.seasons.filter(s => s.season_number > 0);
            setSeasons(validSeasons.length > 0 ? validSeasons : data.seasons);
            if (validSeasons.length > 0) setActiveSeason(validSeasons[0].season_number);
          }
        } catch (err) {
          console.error("Error fetching TV info:", err);
        }
      };
      fetchSeriesDetails();
    }
  }, [movie, isMovie]);

  // Fetch Season Episodes
  useEffect(() => {
    if (!isMovie && activeSeason) {
      const fetchSeasonEpisodes = async () => {
        setLoadingEpisodes(true);
        try {
          const res = await fetch(`${TMDB_BASE_URL}/tv/${movie.id}/season/${activeSeason}?api_key=${TMDB_API_KEY}&language=ar-EG`);
          const data = await res.json();
          setEpisodes(data.episodes || []);
        } catch (err) {
          console.error("Error loading episodes:", err);
        } finally {
          setLoadingEpisodes(false);
        }
      };
      fetchSeasonEpisodes();
    }
  }, [movie, isMovie, activeSeason]);

  const toggleWatchlist = () => {
    let updated = [...watchlist];
    if (isLiked) {
      updated = updated.filter(item => item.id !== movie.id);
    } else {
      updated.push(movie);
    }
    setWatchlist(updated);
    localStorage.setItem("els_watchlist", JSON.stringify(updated));
  };

  const handleEpisodeClick = (epNum) => {
    setActiveEpisode(epNum);
    if (onPlayEpisode) onPlayEpisode(movie, activeSeason, epNum);
    const playerContainer = document.querySelector(".player-container");
    if (playerContainer) playerContainer.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleTryNextServer = () => {
    setServer(prev => (prev + 1) % servers.length);
  };

  const iframeKey = `player-s${server}-sea${activeSeason}-ep${activeEpisode}-id${tmdbId}`;
  const currentServerUrl = servers[server].url;
  const hasNextServer = servers.length > 1;

  return (
    <div className="page-detail">
      <div className="detail-hero">
        <img className="detail-hero-img" src={`${TMDB_BACKDROP_URL}${movie.backdrop_path || movie.poster_path}`} alt="" />
        <div className="detail-hero-grad" />
      </div>
      
      <div className="detail-content">
        {/* ─── SMART PLAYER ─── */}
        <SmartPlayer
          src={currentServerUrl}
          iframeKey={iframeKey}
          onTryNext={handleTryNextServer}
          hasNext={hasNextServer}
          directUrl={currentServerUrl}
        />

        <div className="control-panel">
          <div className="panel-row">
            <div className="server-row">
              {servers.map((s, i) => (
                <button key={i} className={`server-btn ${server === i ? "active" : ""}`} onClick={() => setServer(i)}>
                  <ServerIcon size={14} />
                  {s.name}
                </button>
              ))}
            </div>
            
            <button className={`action-btn ${isLiked ? "liked" : ""}`} onClick={toggleWatchlist}>
              <HeartIcon size={16} filled={isLiked} />
              {isLiked ? "مسجل في قائمتك" : "إضافة إلى قائمتي"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={16} /> العودة للرئيسية
          </button>
          <div style={{ textAlign: "right" }}>
            <h1 style={{ fontWeight: 900, fontSize: "1.8rem", color: "#fff", marginBottom: "0.5rem" }}>
              {title} {!isMovie && ` - موسم ${activeSeason} (الحلقة ${activeEpisode})`}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "flex-end", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{isMovie ? "🎬 فيلم" : "📺 مسلسل / أنمي"}</span>
              <span>•</span>
              <span>{year}</span>
              <span>•</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontWeight: 700 }}>
                <StarIcon size={14} /> {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
              </div>
            </div>
          </div>
        </div>

        <p className="detail-desc">
          {movie.overview || "لا يوجد وصف مترجم لهذا العمل حالياً باللغة العربية. يمكنك بدء مشاهدة العمل مباشرة عبر مشغلات البث الذكية بالاعلى."}
        </p>

        {!isMovie && seasons.length > 0 && (
          <div className="seasons-wrapper">
            <div className="seasons-header-title">
              <LayersIcon size={18} />
              <span>فصول ومواسم العرض</span>
            </div>
            
            <div className="seasons-list">
              {seasons.map((s) => (
                <button
                  key={s.id}
                  className={`season-tab ${activeSeason === s.season_number ? "active" : ""}`}
                  onClick={() => { setActiveSeason(s.season_number); setActiveEpisode(1); }}
                >
                  {s.name || `الموسم ${s.season_number}`}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "2.5rem" }} className="seasons-header-title">
              <PlayIcon size={16} />
              <span>حلقات الموسم المتاحة ({episodes.length})</span>
            </div>

            <div className="episodes-grid">
              {loadingEpisodes ? (
                Array(4).fill(0).map((_, i) => <div key={i} style={{ aspectRatio: "16/10" }} className="skeleton-bg" />)
              ) : episodes.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>قريباً.. جاري الحشد ومزامنة خوادم الحلقات.</p>
              ) : (
                episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className={`episode-card ${activeEpisode === ep.episode_number ? "active" : ""}`}
                    onClick={() => handleEpisodeClick(ep.episode_number)}
                  >
                    <div className="episode-thumb-container">
                      <img
                        className="episode-thumb"
                        src={ep.still_path ? `${TMDB_IMAGE_URL}${ep.still_path}` : `${TMDB_IMAGE_URL}${movie.backdrop_path || movie.poster_path}`}
                        alt=""
                        loading="lazy"
                      />
                      <div className="episode-play-overlay">
                        <div className="episode-mini-play">
                          <PlayIcon size={12} />
                        </div>
                      </div>
                      <div className="episode-badge">الحلقة {ep.episode_number}</div>
                    </div>
                    <div className="episode-meta-info">
                      <div className="episode-name">{ep.name || `الحلقة ${ep.episode_number}`}</div>
                      <div className="episode-overview">{ep.overview || "لا يوجد ملخص متاح لهذه الحلقة."}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN APPLICATION LAYER ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const [trending, setTrending] = useState([]);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [arabicMovies, setArabicMovies] = useState([]);
  const [hollywoodMovies, setHollywoodMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [anime, setAnime] = useState([]);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [historyItems, setHistoryItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("els_history") || "[]"); } catch { return []; }
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  const fetchFromTMDB = async (endpoint, params = "") => {
    try {
      const res = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=ar-EG&${params}`);
      const data = await res.json();
      return data.results || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  useEffect(() => {
    const loadCoreData = async () => {
      setLoading(true);
      const dayTrending = await fetchFromTMDB("/trending/all/day");
      const normalized = dayTrending.map(m => ({ ...m, media_type: m.title ? "movie" : "tv" }));
      setTrending(normalized);
      setCarouselMovies(normalized.slice(0, 5));
      setLoading(false);
    };
    loadCoreData();
  }, []);

  useEffect(() => {
    if (carouselMovies.length === 0 || page === "detail") return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [carouselMovies, page]);

  useEffect(() => {
    const loadTabSpecificContent = async () => {
      setLoading(true);
      if (activeTab === "movies" && arabicMovies.length === 0) {
        const ar = await fetchFromTMDB("/discover/movie", "with_original_language=ar&sort_by=popularity.desc");
        const en = await fetchFromTMDB("/discover/movie", "with_original_language=en&sort_by=popularity.desc");
        setArabicMovies(ar);
        setHollywoodMovies(en);
      } else if (activeTab === "tvshows" && tvShows.length === 0) {
        const tv = await fetchFromTMDB("/discover/tv", "sort_by=popularity.desc");
        setTvShows(tv);
      } else if (activeTab === "anime" && anime.length === 0) {
        const ani = await fetchFromTMDB("/discover/tv", "with_original_language=ja&with_genres=16&sort_by=popularity.desc");
        setAnime(ani);
      } else if (activeTab === "watchlist") {
        try { setWatchlistItems(JSON.parse(localStorage.getItem("els_watchlist") || "[]")); } catch { setWatchlistItems([]); }
      }
      setLoading(false);
    };
    if (activeTab !== "home") loadTabSpecificContent();
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim() === "") { setSearchResults([]); return; }
    const debounce = setTimeout(() => {
      fetchFromTMDB("/search/multi", `query=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          const filtered = res.filter(m => (m.media_type === "movie" || m.media_type === "tv") && m.poster_path);
          setSearchResults(filtered);
        });
    }, 350);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handlePlay = (movie) => {
    setSelectedMovie(movie);
    setPage("detail");
    
    try {
      let currentHistory = JSON.parse(localStorage.getItem("els_history") || "[]");
      currentHistory = currentHistory.filter(h => h.id !== movie.id);
      currentHistory.unshift(movie);
      const croppedHistory = currentHistory.slice(0, 12);
      setHistoryItems(croppedHistory);
      localStorage.setItem("els_history", JSON.stringify(croppedHistory));
    } catch {}

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlayEpisodeHistory = (show, season, episode) => {
    try {
      let currentHistory = JSON.parse(localStorage.getItem("els_history") || "[]");
      currentHistory = currentHistory.filter(h => h.id !== show.id);
      currentHistory.unshift({ ...show, lastSeason: season, lastEpisode: episode });
      setHistoryItems(currentHistory);
      localStorage.setItem("els_history", JSON.stringify(currentHistory));
    } catch {}
  };

  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
    if (page === "detail") setPage("home");
  };

  const currentHero = carouselMovies[carouselIndex];

  return (
    <div>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => handleTabSelect("home")}>
          ELS<span>STREAM</span>
        </div>
        <div className="nav-links">
          {[
            ["home", "🏠 الرئيسية"],
            ["movies", "🎬 الأفلام"],
            ["tvshows", "📺 المسلسلات"],
            ["anime", "🎌 الأنمي"],
            ["watchlist", "❤️ قائمتي"]
          ].map(([id, text]) => (
            <button key={id} className={`nav-link ${activeTab === id && page !== "detail" ? "active" : ""}`} onClick={() => handleTabSelect(id)}>
              {text}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <div className="avatar">ELS</div>
        </div>
      </nav>

      {page === "detail" ? (
        <DetailPage movie={selectedMovie} onBack={() => setPage("home")} onPlayEpisode={handlePlayEpisodeHistory} />
      ) : (
        <>
          {activeTab === "home" && currentHero && (
            <div className="hero">
              <div className="hero-bg">
                <img className="hero-img" src={`${TMDB_BACKDROP_URL}${currentHero.backdrop_path || currentHero.poster_path}`} alt="" />
                <div className="hero-gradient" />
                <div className="hero-gradient-left" />
              </div>
              <div className="hero-content">
                <div className="hero-badge">
                  <FireIcon size={12} /> الأكثر مشاهدة اليوم
                </div>
                <h1 className="hero-title">{currentHero.title || currentHero.name}</h1>
                <div className="hero-meta">
                  <div className="hero-rating">
                    <StarIcon size={14} /> {currentHero.vote_average ? currentHero.vote_average.toFixed(1) : "0.0"}
                  </div>
                  <span>{currentHero.release_date || currentHero.first_air_date ? new Date(currentHero.release_date || currentHero.first_air_date).getFullYear() : ""}</span>
                </div>
                <p className="hero-desc">{currentHero.overview}</p>
                <button className="btn btn-primary" onClick={() => handlePlay(currentHero)}>
                  <PlayIcon size={16} /> شاهد العرض الآن
                </button>
              </div>
            </div>
          )}

          <div className="search-wrapper" ref={searchRef}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="ابحث هنا عن الفيلم، المسلسل أو الأنمي المفضل لديك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              />
              <span className="search-icon"><SearchIcon size={19} /></span>
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery("")}>
                  <XIcon size={12} />
                </button>
              )}
              {searchFocused && searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(m => (
                    <div key={m.id} className="search-result-item" onClick={() => handlePlay(m)}>
                      <img className="search-result-poster" src={`${TMDB_IMAGE_URL}${m.poster_path}`} alt="" />
                      <div className="search-result-info">
                        <div className="search-result-title">{m.title || m.name}</div>
                        <div className="search-result-meta">
                          <span>🌟 {m.vote_average ? m.vote_average.toFixed(1) : "0.0"}</span>
                          <span>|</span>
                          <span>{m.title ? "فيلم" : "مسلسل/أنمي"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {activeTab === "home" && (
            <>
              {historyItems.length > 0 && (
                <MovieGrid title="🕒 تابع المشاهدة مؤخراً" movies={historyItems} onPlay={handlePlay} loading={false} />
              )}
              <MovieGrid title="🔥 تريند ومقترحات اليوم العالمية" movies={trending} onPlay={handlePlay} loading={loading} />
            </>
          )}
          {activeTab === "movies" && (
            <>
              <MovieGrid title="🎬 الإنتاجات السينمائية العربية الحصرية" movies={arabicMovies} onPlay={handlePlay} loading={loading} />
              <MovieGrid title="🇺🇸 أفلام هوليوود الأجنبية المترجمة" movies={hollywoodMovies} onPlay={handlePlay} loading={loading} />
            </>
          )}
          {activeTab === "tvshows" && (
            <MovieGrid title="📺 أحدث المسلسلات العربية والعالمية كاملة الفصول" movies={tvShows} onPlay={handlePlay} loading={loading} />
          )}
          {activeTab === "anime" && (
            <MovieGrid title="🎌 مكتبة عوالم الأنمي والكرتون الياباني المترجم" movies={anime} onPlay={handlePlay} loading={loading} />
          )}
          {activeTab === "watchlist" && (
            <MovieGrid title="❤️ قائمة أعمالك المفضلة والمحفوظة" movies={watchlistItems} onPlay={handlePlay} loading={loading} />
          )}
        </>
      )}

      <footer className="footer">
        © 2026 <span className="footer-brand">ELS STREAM</span> — Ultra Streaming Infrastructure Server Core. Developed for High Performance UI.
      </footer>

      <div className="mobile-nav">
        <div className="mobile-nav-items">
          {[
            ["home", "🏠", "الرئيسية"],
            ["movies", "🎬", "أفلام"],
            ["tvshows", "📺", "مسلسلات"],
            ["anime", "🎌", "أنمي"],
            ["watchlist", "❤️", "مفضلتي"]
          ].map(([id, icon, text]) => (
            <button key={id} className={`mobile-nav-item ${activeTab === id && page !== "detail" ? "active" : ""}`} onClick={() => handleTabSelect(id)}>
              <span style={{ fontSize: "1.25rem" }}>{icon}</span>
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}