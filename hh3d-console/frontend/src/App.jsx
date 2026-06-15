import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Play, Square, Trash2, Shield, Settings, Server, Terminal, 
  Layers, Power, CheckCircle, AlertTriangle, Info, RefreshCw, Eye, EyeOff
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';
const WS_URL = 'ws://localhost:3000';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [logs, setLogs] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [proxyType, setProxyType] = useState('None');
  const [proxyHost, setProxyHost] = useState('');
  const [proxyPort, setProxyPort] = useState('');
  const [proxyUsername, setProxyUsername] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');
  const [headless, setHeadless] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
  const [friendSearch, setFriendSearch] = useState('');
  const [settingsTab, setSettingsTab] = useState('general');
  const [logFilter, setLogFilter] = useState('all');

  // Tool settings state
  const [generalVipMode, setGeneralVipMode] = useState(false);
  const [autoDiemDanh, setAutoDiemDanh] = useState(true);
  const [autoThiLuyen, setAutoThiLuyen] = useState(true);
  const [autoPhucLoi, setAutoPhucLoi] = useState(true);
  const [autoClaimDailyTurns, setAutoClaimDailyTurns] = useState(true);
  const [autoHoangVuc, setAutoHoangVuc] = useState(true);
  const [autoMeCung, setAutoMeCung] = useState(true);
  const [autoKhoangMach, setAutoKhoangMach] = useState(true);
  const [autoDoThach, setAutoDoThach] = useState(true);
  const [autoBiCanh, setAutoBiCanh] = useState(true);
  const [autoTienDuyen, setAutoTienDuyen] = useState(true);
  const [autoHoatDongNgay, setAutoHoatDongNgay] = useState(true);
  const [autoLuyenDan, setAutoLuyenDan] = useState(true);
  const [luyenDanAutoStart, setLuyenDanAutoStart] = useState(true);
  const [luyenDanMinStars, setLuyenDanMinStars] = useState('4');
  const [luyenDanAutoDecompose, setLuyenDanAutoDecompose] = useState(true);
  const [luyenDanAutoTune, setLuyenDanAutoTune] = useState(true);
  const [luyenDanAutoUse, setLuyenDanAutoUse] = useState(true);
  const [luyenDanAutoInvite, setLuyenDanAutoInvite] = useState(false);
  const [luyenDanWaitInviteSeconds, setLuyenDanWaitInviteSeconds] = useState('60');
  const [luyenDanAutoAcceptInvite, setLuyenDanAutoAcceptInvite] = useState(false);
  const [luyenDanAcceptAllInvites, setLuyenDanAcceptAllInvites] = useState(true);
  const [luyenDanAutoLeave, setLuyenDanAutoLeave] = useState(false);
  const [khoangmach_auto_takeover, setKhoangmachAutoTakeover] = useState(false);
  const [khoangmach_auto_takeover_rotation, setKhoangmachAutoTakeoverRotation] = useState(false);
  const [khoangmach_reward_mode, setKhoangmachRewardMode] = useState('any');
  const [khoangmach_reward_time, setKhoangmachRewardTime] = useState('max');
  const [khoangmach_use_buff, setKhoangmachUseBuff] = useState(false);
  const [khoangmach_fast_attack, setKhoangmachFastAttack] = useState(false);
  const [khoangmach_check_interval, setKhoangmachCheckInterval] = useState('5');
  const [khoangmach_leave_mine, setKhoangmachLeaveMine] = useState(false);
  const [khoangmach_outer_notification, setKhoangmachOuterNotification] = useState(false);
  const [diceRollChoice, setDiceRollChoice] = useState('tai');
  const [tienduyenChoice, setTienduyenChoice] = useState('5');
  const [hoangvucMaximizeDamage, setHoangvucMaximizeDamage] = useState(false);
  const [selfSchedule_h, setSelfScheduleH] = useState('0');
  const [selfSchedule_m, setSelfScheduleM] = useState('30');
  const [luyenDanSelectedFriendIds, setLuyenDanSelectedFriendIds] = useState('');
  const [khoangmach_selected_mine, setKhoangmachSelectedMine] = useState('');

  const fetchSettings = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/profiles/${id}/settings`);
      if (res.ok) {
        const data = await res.json();
        setGeneralVipMode(data.generalVipMode === 'true' || data.generalVipMode === true);
        setAutoDiemDanh(data.autoDiemDanh !== 'false' && data.autoDiemDanh !== false && data.autoDiemDanh !== '0' && data.autoDiemDanh !== 0);
        setAutoThiLuyen(data.autoThiLuyen !== 'false' && data.autoThiLuyen !== false && data.autoThiLuyen !== '0' && data.autoThiLuyen !== 0);
        setAutoPhucLoi(data.autoPhucLoi !== 'false' && data.autoPhucLoi !== false && data.autoPhucLoi !== '0' && data.autoPhucLoi !== 0);
        setAutoClaimDailyTurns(data.autoClaimDailyTurns !== 'false' && data.autoClaimDailyTurns !== false && data.autoClaimDailyTurns !== '0' && data.autoClaimDailyTurns !== 0);
        setAutoHoangVuc(data.autoHoangVuc !== 'false' && data.autoHoangVuc !== false && data.autoHoangVuc !== '0' && data.autoHoangVuc !== 0);
        setAutoMeCung(data.autoMeCung !== 'false' && data.autoMeCung !== false && data.autoMeCung !== '0' && data.autoMeCung !== 0);
        setAutoKhoangMach(data.autoKhoangMach !== 'false' && data.autoKhoangMach !== false && data.autoKhoangMach !== '0' && data.autoKhoangMach !== 0);
        setAutoDoThach(data.autoDoThach !== 'false' && data.autoDoThach !== false && data.autoDoThach !== '0' && data.autoDoThach !== 0);
        setAutoBiCanh(data.autoBiCanh !== 'false' && data.autoBiCanh !== false && data.autoBiCanh !== '0' && data.autoBiCanh !== 0);
        setAutoTienDuyen(data.autoTienDuyen !== 'false' && data.autoTienDuyen !== false && data.autoTienDuyen !== '0' && data.autoTienDuyen !== 0);
        setAutoHoatDongNgay(data.autoHoatDongNgay !== 'false' && data.autoHoatDongNgay !== false && data.autoHoatDongNgay !== '0' && data.autoHoatDongNgay !== 0);
        setAutoLuyenDan(data.autoLuyenDan !== 'false' && data.autoLuyenDan !== false && data.autoLuyenDan !== '0' && data.autoLuyenDan !== 0);
        
        setLuyenDanAutoStart(data.luyenDanAutoStart !== 'false' && data.luyenDanAutoStart !== false);
        setLuyenDanMinStars(data.luyenDanMinStars || '4');
        setLuyenDanAutoDecompose(data.luyenDanAutoDecompose !== 'false' && data.luyenDanAutoDecompose !== false);
        setLuyenDanAutoTune(data.luyenDanAutoTune !== 'false' && data.luyenDanAutoTune !== false);
        setLuyenDanAutoUse(data.luyenDanAutoUse !== 'false' && data.luyenDanAutoUse !== false);
        setLuyenDanAutoInvite(data.luyenDanAutoInvite === 'true' || data.luyenDanAutoInvite === true);
        setLuyenDanWaitInviteSeconds(data.luyenDanWaitInviteSeconds || '60');
        setLuyenDanAutoAcceptInvite(data.luyenDanAutoAcceptInvite === 'true' || data.luyenDanAutoAcceptInvite === true);
        setLuyenDanAcceptAllInvites(data.luyenDanAcceptAllInvites !== 'false' && data.luyenDanAcceptAllInvites !== false);
        setLuyenDanAutoLeave(data.luyenDanAutoLeave === 'true' || data.luyenDanAutoLeave === true);
        
        setKhoangmachAutoTakeover(data.khoangmach_auto_takeover === 'true' || data.khoangmach_auto_takeover === true);
        setKhoangmachAutoTakeoverRotation(data.khoangmach_auto_takeover_rotation === 'true' || data.khoangmach_auto_takeover_rotation === true);
        setKhoangmachRewardMode(data.khoangmach_reward_mode || 'any');
        setKhoangmachRewardTime(data.khoangmach_reward_time || 'max');
        setKhoangmachUseBuff(data.khoangmach_use_buff === 'true' || data.khoangmach_use_buff === true);
        setKhoangmachFastAttack(data.khoangmach_fast_attack === 'true' || data.khoangmach_fast_attack === true);
        setKhoangmachCheckInterval(data.khoangmach_check_interval || '5');
        setKhoangmachLeaveMine(data.khoangmach_leave_mine === 'true' || data.khoangmach_leave_mine === true);
        setKhoangmachOuterNotification(data.khoangmach_outer_notification === 'true' || data.khoangmach_outer_notification === true);
        
        setDiceRollChoice(data['dice-roll-choice'] || 'tai');
        setTienduyenChoice(data['tienduyen-choice'] || '5');
        setHoangvucMaximizeDamage(data.hoangvucMaximizeDamage === 'true' || data.hoangvucMaximizeDamage === true);
        setSelfScheduleH(data.selfSchedule_h || '0');
        setSelfScheduleM(data.selfSchedule_m || '30');
        setLuyenDanSelectedFriendIds(data.luyenDanSelectedFriendIds || '');
        setKhoangmachSelectedMine(data.khoangmach_selected_mine || '');
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  const terminalEndRef = useRef(null);
  const wsRef = useRef(null);

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/profiles`);
      const data = await res.json();
      setProfiles(data);
    } catch (e) {
      console.error('Error fetching profiles:', e);
    }
  };

  // Connect WebSockets for real-time logs & status sync
  const connectWS = () => {
    if (wsRef.current) wsRef.current.close();
    
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      console.log('WS Connection established');
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'LOG') {
        const { profileId, level, text, timestamp } = msg.data;
        setLogs(prev => {
          const profileLogs = prev[profileId] || [];
          return {
            ...prev,
            [profileId]: [...profileLogs, { level, text, timestamp }].slice(-500) // keep last 500 logs
          };
        });
      } else if (msg.type === 'STATUS') {
        const { id } = msg.data;
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...msg.data } : p));
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      console.log('WS Connection closed, retrying in 3s...');
      setTimeout(connectWS, 3000);
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
    };
  };

  useEffect(() => {
    fetchProfiles();
    connectWS();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Auto scroll terminal to bottom on new logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, selectedId]);

  const selectedProfile = profiles.find(p => p.id === selectedId);

  // Sync edit form when selected profile changes
  useEffect(() => {
    if (selectedProfile) {
      setFormName(selectedProfile.name);
      setProxyType(selectedProfile.proxyType || 'None');
      setProxyHost(selectedProfile.proxyHost || '');
      setProxyPort(selectedProfile.proxyPort || '');
      setProxyUsername(selectedProfile.proxyUsername || '');
      setProxyPassword(selectedProfile.proxyPassword || '');
      setHeadless(selectedProfile.headless || false);
      fetchSettings(selectedProfile.id);
    }
  }, [selectedId, profiles]);

  useEffect(() => {
    setActiveTab('logs');
    setSettingsTab('general');
    setLogFilter('all');
  }, [selectedId]);

  // Handle profile creation
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!formName) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          proxyType,
          proxyHost,
          proxyPort,
          proxyUsername,
          proxyPassword
        })
      });
      const newProf = await res.json();
      setProfiles(prev => [...prev, newProf]);
      setSelectedId(newProf.id);
      setShowCreate(false);
      resetForm();
    } catch (err) {
      alert('Tạo profile thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      // Update profile
      const res = await fetch(`${API_BASE}/profiles/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          proxyType,
          proxyHost,
          proxyPort,
          proxyUsername,
          proxyPassword,
          headless
        })
      });
      const updated = await res.json();

      // Update settings
      await fetch(`${API_BASE}/profiles/${selectedId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generalVipMode,
          autoDiemDanh,
          autoThiLuyen,
          autoPhucLoi,
          autoClaimDailyTurns,
          autoHoangVuc,
          autoMeCung,
          autoKhoangMach,
          autoDoThach,
          autoBiCanh,
          autoTienDuyen,
          autoHoatDongNgay,
          autoLuyenDan,
          luyenDanAutoStart,
          luyenDanMinStars,
          luyenDanAutoDecompose,
          luyenDanAutoTune,
          luyenDanAutoUse,
          luyenDanAutoInvite,
          luyenDanWaitInviteSeconds,
          luyenDanAutoAcceptInvite,
          luyenDanAcceptAllInvites,
          luyenDanAutoLeave,
          khoangmach_auto_takeover,
          khoangmach_auto_takeover_rotation,
          khoangmach_reward_mode,
          khoangmach_reward_time,
          khoangmach_use_buff,
          khoangmach_fast_attack,
          khoangmach_check_interval,
          khoangmach_leave_mine,
          khoangmach_outer_notification,
          'dice-roll-choice': diceRollChoice,
          'tienduyen-choice': tienduyenChoice,
          hoangvucMaximizeDamage,
          selfSchedule_h,
          selfSchedule_m,
          luyenDanSelectedFriendIds,
          khoangmach_selected_mine
        })
      });

      setProfiles(prev => prev.map(p => p.id === selectedId ? updated : p));
      alert('Đã cập nhật cấu hình profile và cài đặt tool!');
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile delete
  const handleDeleteProfile = async () => {
    if (!selectedId || !confirm('Bạn có chắc chắn muốn xóa profile này? Mọi cookie lưu trữ sẽ bị xóa sạch.')) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/profiles/${selectedId}`, { method: 'DELETE' });
      setProfiles(prev => prev.filter(p => p.id !== selectedId));
      setSelectedId(null);
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start profile Chrome
  const handleStart = async (runHeadless) => {
    if (!selectedId) return;
    setLoading(true);
    try {
      // First save configuration to ensure latest options are used
      await fetch(`${API_BASE}/profiles/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          proxyType,
          proxyHost,
          proxyPort,
          proxyUsername,
          proxyPassword,
          headless: runHeadless
        })
      });

      const res = await fetch(`${API_BASE}/profiles/${selectedId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headless: runHeadless })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      fetchProfiles();
    } catch (err) {
      alert('Khởi chạy thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start profile Firefox cleanly (bypass Cloudflare)
  const handleStartClean = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      // First save configuration to ensure latest options are used
      await fetch(`${API_BASE}/profiles/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          proxyType,
          proxyHost,
          proxyPort,
          proxyUsername,
          proxyPassword,
          headless: false
        })
      });

      const res = await fetch(`${API_BASE}/profiles/${selectedId}/start-clean`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      fetchProfiles();
    } catch (err) {
      alert('Khởi chạy sạch thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stop profile Chrome
  const handleStop = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profiles/${selectedId}/stop`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      fetchProfiles();
    } catch (err) {
      alert('Dừng thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle headless mode (show/hide browser)
  const handleToggleHeadless = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profiles/${selectedId}/toggle-headless`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      fetchProfiles();
    } catch (err) {
      alert('Chuyển đổi chế độ ẩn/hiện thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh current game page
  const handleRefreshPage = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profiles/${selectedId}/refresh`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (err) {
      alert('Tải lại trang thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormName('');
    setProxyType('None');
    setProxyHost('');
    setProxyPort('');
    setProxyUsername('');
    setProxyPassword('');
    setHeadless(false);
  };

  const clearLogs = () => {
    if (selectedId) {
      setLogs(prev => ({ ...prev, [selectedId]: [] }));
    }
  };

  // Stats calculation
  const totalProfiles = profiles.length;
  const runningProfiles = profiles.filter(p => p.status === 'Running').length;
  const stoppedProfiles = totalProfiles - runningProfiles;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <Layers className="text-cyan-400" size={24} />
            HH3D <span>Console</span>
          </div>
          <div className="server-status">
            <span className={`status-dot ${wsConnected ? 'online' : 'offline'}`}></span>
            {wsConnected ? 'Backend Connected' : 'Connecting to Server...'}
          </div>
        </div>

        <div className="sidebar-content">
          <div className="section-title">Danh sách Profile ({totalProfiles})</div>
          <div className="profile-list">
            {profiles.map(p => (
              <div 
                key={p.id} 
                className={`profile-item ${selectedId === p.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedId(p.id);
                  setShowCreate(false);
                }}
              >
                <div className="profile-info">
                  <div className="profile-name">{p.name}</div>
                  <div className="profile-meta">
                    {p.proxyType !== 'None' ? (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Shield size={10} />
                        {p.proxyHost}:{p.proxyPort}
                      </span>
                    ) : (
                      <span className="text-slate-500">No Proxy</span>
                    )}
                  </div>
                </div>
                <span className={`badge ${p.status === 'Running' ? 'running' : 'stopped'}`}>
                  {p.status === 'Running' ? 'Live' : 'Off'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedId(null);
              setShowCreate(true);
              resetForm();
            }}
          >
            <Plus size={18} />
            Tạo Profile Mới
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="main-content">
        {/* Header Stats */}
        <div className="header">
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <span className="stat-val text-white">{totalProfiles}</span>
              <span className="stat-label">Tổng Profile</span>
            </div>
            <div className="stat-card glass-panel" style={{ borderLeft: '3px solid var(--accent-green)' }}>
              <span className="stat-val text-emerald-400" style={{ color: 'var(--accent-green)' }}>{runningProfiles}</span>
              <span className="stat-label">Đang Chạy</span>
            </div>
            <div className="stat-card glass-panel">
              <span className="stat-val text-slate-400">{stoppedProfiles}</span>
              <span className="stat-label">Tạm Dừng</span>
            </div>
          </div>
          
          <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={fetchProfiles}>
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>

        {/* Content Workspace */}
        {showCreate ? (
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div className="panel-header">
              <h3 className="panel-title">Tạo Profile Trình Duyệt Mới</h3>
            </div>
            <form onSubmit={handleCreateProfile} className="panel-body">
              <div className="form-group">
                <label>Tên Gợi Nhớ (Ví dụ: Acc phụ 1)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)} 
                  placeholder="Nhập tên tài khoản..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Loại Proxy</label>
                <select 
                  className="select-field" 
                  value={proxyType} 
                  onChange={e => setProxyType(e.target.value)}
                >
                  <option value="None">Không sử dụng Proxy (Chạy IP mạng nhà)</option>
                  <option value="HTTP">HTTP Proxy</option>
                  <option value="SOCKS5">SOCKS5 Proxy</option>
                </select>
              </div>

              {proxyType !== 'None' && (
                <>
                  <div className="inline-form-row">
                    <div className="form-group">
                      <label>Proxy Host (IP / Domain)</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={proxyHost} 
                        onChange={e => setProxyHost(e.target.value)}
                        placeholder="192.168.1.10"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Proxy Port</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={proxyPort} 
                        onChange={e => setProxyPort(e.target.value)}
                        placeholder="8080"
                        required
                      />
                    </div>
                  </div>

                  <div className="inline-form-row">
                    <div className="form-group">
                      <label>Proxy Username (Nếu có)</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={proxyUsername} 
                        onChange={e => setProxyUsername(e.target.value)}
                        placeholder="user_proxy"
                      />
                    </div>
                    <div className="form-group">
                      <label>Proxy Password (Nếu có)</label>
                      <input 
                        type="password" 
                        className="input-field" 
                        value={proxyPassword} 
                        onChange={e => setProxyPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Tạo Profile
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        ) : selectedProfile ? (
          <div className="console-workspace-tabbed" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
            {/* Tab Header */}
            <div className="tabs-header glass-panel" style={{ display: 'flex', padding: '10px 20px', gap: '12px', alignItems: 'center' }}>
              <button 
                className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'logs' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  color: activeTab === 'logs' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: activeTab === 'logs' ? 'rgba(0, 240, 255, 0.3)' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onClick={() => setActiveTab('logs')}
              >
                Màn hình Terminal Logs
              </button>
              <button 
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'settings' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  color: activeTab === 'settings' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: activeTab === 'settings' ? 'rgba(0, 240, 255, 0.3)' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onClick={() => setActiveTab('settings')}
              >
                Cấu hình Proxy & Profile
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Trạng thái:</span>
                <span className={`badge ${selectedProfile.status === 'Running' ? 'running' : 'stopped'}`}>
                  {selectedProfile.status === 'Running' ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            {/* Tab Body */}
            {activeTab === 'logs' ? (
              <div className="tab-content-logs" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px', height: 'calc(100% - 70px)' }}>
                {/* Clean inline toolbar for controls */}
                <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', marginRight: '12px' }}>Điều khiển {selectedProfile.name}:</span>
                  {selectedProfile.status === 'Running' ? (
                    <>
                      <button className="btn btn-danger" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleStop} disabled={loading}>
                        <Square size={16} />
                        Dừng Trình Duyệt (Stop)
                      </button>
                      {selectedProfile.isRunningHeadless ? (
                        <button className="btn btn-secondary" style={{ width: 'auto', borderColor: '#00f0ff', color: '#00f0ff', padding: '10px 20px' }} onClick={handleToggleHeadless} disabled={loading}>
                          <Eye size={16} />
                          Hiện Trình Duyệt (Show)
                        </button>
                      ) : (
                        <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleToggleHeadless} disabled={loading}>
                          <EyeOff size={16} />
                          Ẩn Trình Duyệt (Hide)
                        </button>
                      )}
                      <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleRefreshPage} disabled={loading}>
                        <RefreshCw size={16} />
                        Tải Lại Trang (Refresh)
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => handleStart(false)} disabled={loading}>
                        <Play size={16} />
                        Chạy Trực Quan (Headful)
                      </button>
                      <button className="btn btn-secondary" style={{ width: 'auto', borderColor: '#06b6d4', color: '#06b6d4', padding: '10px 20px' }} onClick={handleStartClean} disabled={loading}>
                        <Eye size={16} />
                        Đăng Nhập Sạch (Vượt CF)
                      </button>
                      <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => handleStart(true)} disabled={loading}>
                        <EyeOff size={16} />
                        Chạy Ngầm (Headless)
                      </button>
                    </>
                  )}
                </div>

                {/* Log screen takes full remaining height */}
                <div className="glass-panel terminal-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div className="terminal-header">
                    <div className="terminal-title">
                      <Terminal size={16} />
                      CONSOLE_TERMINAL://{selectedProfile.name}
                    </div>
                    <div className="terminal-actions">
                      <button className="terminal-btn" onClick={clearLogs} title="Xóa logs màn hình">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="terminal-screen" style={{ flex: 1, margin: '16px', overflowY: 'auto' }}>
                    {(logs[selectedId] || []).length === 0 ? (
                      <span className="text-slate-600 italic">Chưa có log hệ thống. Vui lòng bấm chạy Profile...</span>
                    ) : (
                      (logs[selectedId] || []).map((log, idx) => (
                        <div key={idx} className="log-entry">
                          <span className="log-time">[{log.timestamp}]</span>
                          <span className={`log-badge ${log.level}`}>{log.level}</span>
                          <span className={`log-text ${log.level}`}>{log.text}</span>
                        </div>
                      ))
                    )}
                    <div ref={terminalEndRef}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hh3d-settings-layout" style={{ height: 'calc(100vh - 180px)' }}>
                {/* LEFT: Vertical Tab Sidebar */}
                <div className="hh3d-settings-tabs">
                  {[
                    { id: 'general', icon: '⚙️', label: 'Chung & Nhiệm Vụ' },
                    { id: 'profile', icon: '🔌', label: 'Kết Nối & Profile' },
                    { id: 'khoangmach', icon: '⛏️', label: 'Khoáng Mạch' },
                    { id: 'luyendan', icon: '🧪', label: 'Luyện Đan' },
                    { id: 'log', icon: '📋', label: 'Lịch Sử Log' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`hh3d-settings-tab ${settingsTab === tab.id ? 'active' : ''}`}
                      onClick={() => setSettingsTab(tab.id)}
                    >
                      <span className="tab-icon">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* RIGHT: Content per tab */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden', flex: 1 }}>
                  <div className="hh3d-settings-content" style={{ flex: 1, minHeight: 0 }}>
                    {settingsTab === 'general' && (
                      <div className="hh3d-section">
                        <div className="hh3d-section-title">⚙️ Cấu hình chung</div>
                        <div className="hh3d-option" style={{ background: 'rgba(0, 240, 255, 0.03)', borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                          <div className="hh3d-option-label">
                            <span className="hh3d-option-title" style={{ color: 'var(--accent-cyan)' }}>Kích hoạt Chế độ VIP (generalVipMode)</span>
                            <span className="hh3d-option-desc">Mở các chức năng nhận lượt, claim thưởng dành riêng cho VIP</span>
                          </div>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={generalVipMode} 
                              onChange={e => setGeneralVipMode(e.target.checked)} 
                              disabled={selectedProfile.status === 'Running'}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="hh3d-section-title" style={{ marginTop: '10px' }}>✅ Nhiệm vụ hàng ngày</div>
                        <div className="hh3d-toggles-grid">
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Điểm Danh</span>
                              <span className="hh3d-option-desc">Điểm danh ngày nhận quà</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoDiemDanh} onChange={e => setAutoDiemDanh(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Thí Luyen</span>
                              <span className="hh3d-option-desc">Khiêu chiến thí luyện tối đa</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoThiLuyen} onChange={e => setAutoThiLuyen(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Phúc Lợi</span>
                              <span className="hh3d-option-desc">Nhận quà phúc lợi & điểm năng động</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoPhucLoi} onChange={e => setAutoPhucLoi(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Nhận Trận Văn (VIP)</span>
                              <span className="hh3d-option-desc">Nhận trận văn khắc trận hàng ngày</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoClaimDailyTurns} onChange={e => setAutoClaimDailyTurns(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Hoang Vực</span>
                              <span className="hh3d-option-desc">Tự động khiêu chiến hoàng vực</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoHoangVuc} onChange={e => setAutoHoangVuc(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Mê Cung</span>
                              <span className="hh3d-option-desc">Tự tìm đường & nhận quà mê cung</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoMeCung} onChange={e => setAutoMeCung(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Đổ Thạch</span>
                              <span className="hh3d-option-desc">Tham gia lắc xúc xắc đổ thạch</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoDoThach} onChange={e => setAutoDoThach(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Bí Cảnh</span>
                              <span className="hh3d-option-desc">Tự tham gia bí cảnh tông môn</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoBiCanh} onChange={e => setAutoBiCanh(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự Tiên Duyên</span>
                              <span className="hh3d-option-desc">Nhận tiên duyên & tặng hoa bạn bè</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoTienDuyen} onChange={e => setAutoTienDuyen(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="hh3d-option">
                            <div className="hh3d-option-label">
                              <span className="hh3d-option-title">Tự H.Động Ngày</span>
                              <span className="hh3d-option-desc">Tự động hoàn thành năng động ngày</span>
                            </div>
                            <label className="switch">
                              <input type="checkbox" checked={autoHoatDongNgay} onChange={e => setAutoHoatDongNgay(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                              <span className="slider"></span>
                            </label>
                          </div>
                        </div>

                        <div className="hh3d-section-title" style={{ marginTop: '10px' }}>📅 Hẹn giờ & Cấu hình phụ</div>
                        <div className="hh3d-inline-row">
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Lựa chọn Đổ Thạch</label>
                            <select 
                              className="select-field" 
                              value={diceRollChoice} 
                              onChange={e => setDiceRollChoice(e.target.value)}
                              disabled={selectedProfile.status === 'Running'}
                            >
                              <option value="tai">Tài</option>
                              <option value="xiu">Xỉu</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Lựa chọn Tiên Duyên & Số người Tặng Hoa</label>
                            <select 
                              className="select-field" 
                              value={tienduyenChoice} 
                              onChange={e => setTienduyenChoice(e.target.value)}
                              disabled={selectedProfile.status === 'Running'}
                            >
                              <option value="1">Lựa chọn 1</option>
                              <option value="2">Lựa chọn 2</option>
                              <option value="3">Lựa chọn 3</option>
                              <option value="4">Lựa chọn 4</option>
                              <option value="5">Lựa chọn 5</option>
                            </select>
                          </div>
                        </div>

                        <div className="hh3d-option">
                          <div className="hh3d-option-label">
                            <span className="hh3d-option-title">Tối ưu Sát thương Hoang Vực</span>
                            <span className="hh3d-option-desc">Tự động chọn skill để đạt sát thương cao nhất</span>
                          </div>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={hoangvucMaximizeDamage} 
                              onChange={e => setHoangvucMaximizeDamage(e.target.checked)} 
                              disabled={selectedProfile.status === 'Running'}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="form-group">
                          <label>Hẹn giờ chạy (Bắt đầu sau hh:mm)</label>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                              type="number" 
                              className="input-field" 
                              style={{ textAlign: 'center' }} 
                              value={selfSchedule_h} 
                              onChange={e => setSelfScheduleH(e.target.value)}
                              placeholder="Hour (0-23)"
                              min="0" max="23"
                              disabled={selectedProfile.status === 'Running'}
                            />
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>:</span>
                            <input 
                              type="number" 
                              className="input-field" 
                              style={{ textAlign: 'center' }} 
                              value={selfSchedule_m} 
                              onChange={e => setSelfScheduleM(e.target.value)}
                              placeholder="Minute (0-59)"
                              min="0" max="59"
                              disabled={selectedProfile.status === 'Running'}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {settingsTab === 'profile' && (
                      <div className="hh3d-section">
                        <div className="hh3d-section-title">🔌 Kết nối & Cấu hình Profile</div>
                        
                        <div className="form-group">
                          <label>Tên Profile</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={formName} 
                            onChange={e => setFormName(e.target.value)} 
                            disabled={selectedProfile.status === 'Running'}
                          />
                        </div>

                        <div className="form-group">
                          <label>Loại Proxy</label>
                          <select 
                            className="select-field" 
                            value={proxyType} 
                            onChange={e => setProxyType(e.target.value)}
                            disabled={selectedProfile.status === 'Running'}
                          >
                            <option value="None">Không Proxy (Mạng nhà)</option>
                            <option value="HTTP">HTTP Proxy</option>
                            <option value="SOCKS5">SOCKS5 Proxy</option>
                          </select>
                        </div>

                        {proxyType !== 'None' && (
                          <>
                            <div className="hh3d-inline-row">
                              <div className="form-group" style={{ flex: 2 }}>
                                <label>IP / Host</label>
                                <input 
                                  type="text" 
                                  className="input-field" 
                                  value={proxyHost} 
                                  onChange={e => setProxyHost(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                />
                              </div>
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Cổng Port</label>
                                <input 
                                  type="number" 
                                  className="input-field" 
                                  value={proxyPort} 
                                  onChange={e => setProxyPort(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                />
                              </div>
                            </div>

                            <div className="hh3d-inline-row">
                              <div className="form-group">
                                <label>Proxy User</label>
                                <input 
                                  type="text" 
                                  className="input-field" 
                                  value={proxyUsername} 
                                  onChange={e => setProxyUsername(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                />
                              </div>
                              <div className="form-group">
                                <label>Proxy Pass</label>
                                <input 
                                  type="password" 
                                  className="input-field" 
                                  value={proxyPassword} 
                                  onChange={e => setProxyPassword(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="hh3d-option">
                          <div className="hh3d-option-label">
                            <span className="hh3d-option-title">Mặc định chạy ngầm</span>
                            <span className="hh3d-option-desc">Tự động ẩn Firefox khi bấm Start</span>
                          </div>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={headless} 
                              onChange={e => setHeadless(e.target.checked)} 
                              disabled={selectedProfile.status === 'Running'}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    )}

                    {settingsTab === 'khoangmach' && (
                      <div className="hh3d-section">
                        <div className="hh3d-section-title">⛏️ Cấu hình Khoáng Mạch</div>
                        
                        <div className="hh3d-option" style={{ background: 'rgba(249, 115, 22, 0.03)', borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                          <div className="hh3d-option-label">
                            <span className="hh3d-option-title" style={{ color: 'var(--accent-orange)' }}>Kích hoạt Khoáng Mạch</span>
                            <span className="hh3d-option-desc">Cho phép tự động quản lý cướp/giữ/nhận quà mỏ khoáng</span>
                          </div>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={autoKhoangMach} 
                              onChange={e => setAutoKhoangMach(e.target.checked)} 
                              disabled={selectedProfile.status === 'Running'} 
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        {autoKhoangMach && (
                          <>
                            <div className="hh3d-toggles-grid">
                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Động Cướp Mỏ</span>
                                  <span className="hh3d-option-desc">Tấn công chiếm lại mỏ khi bị chiếm</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={khoangmach_auto_takeover} onChange={e => setKhoangmachAutoTakeover(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Xoay Vòng Mỏ</span>
                                  <span className="hh3d-option-desc">Tự luân chuyển các mỏ đã lưu</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={khoangmach_auto_takeover_rotation} onChange={e => setKhoangmachAutoTakeoverRotation(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Động Bơm Buff</span>
                                  <span className="hh3d-option-desc">Bơm tài nguyên tăng tốc mỏ</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={khoangmach_use_buff} onChange={e => setKhoangmachUseBuff(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Chế Độ Tấn Công Nhanh</span>
                                  <span className="hh3d-option-desc">Bỏ qua một số bước chờ hoạt ảnh</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={khoangmach_fast_attack} onChange={e => setKhoangmachFastAttack(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Rời mỏ nhận thưởng</span>
                                  <span className="hh3d-option-desc">Rời mỏ khi đủ điều kiện buff/thời gian</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={khoangmach_leave_mine} onChange={e => setKhoangmachLeaveMine(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Báo ngoại tông vào mỏ</span>
                                  <span className="hh3d-option-desc">Gửi thông báo khi có ngoại tông xâm nhập</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={khoangmach_outer_notification} onChange={e => setKhoangmachOuterNotification(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>
                            </div>

                            <div className="hh3d-inline-row">
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Chế độ nhận thưởng (% Buff)</label>
                                <select 
                                  className="select-field" 
                                  value={khoangmach_reward_mode} 
                                  onChange={e => setKhoangmachRewardMode(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                >
                                  <option value="any">Bất kỳ</option>
                                  <option value="110">110%</option>
                                  <option value="100">100%</option>
                                  <option value="20">20%</option>
                                </select>
                              </div>

                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Thời gian đạt tối thiểu</label>
                                <select 
                                  className="select-field" 
                                  value={khoangmach_reward_time} 
                                  onChange={e => setKhoangmachRewardTime(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                >
                                  <option value="max">Đạt tối đa</option>
                                  <option value="20">20 phút</option>
                                  <option value="10">10 phút</option>
                                  <option value="4">4 phút</option>
                                  <option value="2">2 phút</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Chu kỳ quét mỏ (phút)</label>
                              <input 
                                type="number" 
                                className="input-field" 
                                value={khoangmach_check_interval} 
                                onChange={e => setKhoangmachCheckInterval(e.target.value)}
                                disabled={selectedProfile.status === 'Running'}
                              />
                            </div>

                            <div className="form-group">
                              <label>Mỏ khoáng sản muốn cướp / giữ</label>
                              {selectedProfile.metadata?.mines && selectedProfile.metadata.mines.length > 0 ? (
                                <select 
                                  className="select-field" 
                                  value={khoangmach_selected_mine} 
                                  onChange={e => setKhoangmachSelectedMine(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                >
                                  <option value="">-- Chọn mỏ --</option>
                                  {selectedProfile.metadata.mines.map(m => {
                                    const valStr = JSON.stringify({ id: m.id, type: m.type });
                                    return (
                                      <option key={m.id} value={valStr}>
                                        [{m.type === 'gold' ? 'VÀNG' : m.type === 'silver' ? 'BẠC' : 'ĐỒNG'}] {m.name || `Mỏ ID ${m.id}`}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-glass)', borderRadius: '6px' }}>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    ⚠️ Chưa có dữ liệu danh sách mỏ. Hãy chạy profile này ở chế độ Hiện (Headful) ít nhất 1 lần để quét và đồng bộ danh sách mỏ từ game, hoặc nhập thủ công JSON cấu hình mỏ:
                                  </p>
                                  <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder='Ví dụ: {"id":12,"type":"gold"}' 
                                    value={khoangmach_selected_mine} 
                                    onChange={e => setKhoangmachSelectedMine(e.target.value)}
                                    disabled={selectedProfile.status === 'Running'}
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {settingsTab === 'luyendan' && (
                      <div className="hh3d-section">
                        <div className="hh3d-section-title">🧪 Cấu hình Luyện Đan</div>

                        <div className="hh3d-option" style={{ background: 'rgba(34, 197, 94, 0.03)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                          <div className="hh3d-option-label">
                            <span className="hh3d-option-title" style={{ color: 'var(--accent-green)' }}>Kích hoạt Luyện Đan</span>
                            <span className="hh3d-option-desc">Cho phép tự động quản lý phòng luyện đan, phân giải & cắn thuốc</span>
                          </div>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={autoLuyenDan} 
                              onChange={e => setAutoLuyenDan(e.target.checked)} 
                              disabled={selectedProfile.status === 'Running'} 
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        {autoLuyenDan && (
                          <>
                            <div className="hh3d-toggles-grid">
                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Bắt Đầu Mẻ Mới</span>
                                  <span className="hh3d-option-desc">Tự click bắt đầu khi sẵn sàng</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoStart} onChange={e => setLuyenDanAutoStart(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Phân Giải Đan Thừa</span>
                                  <span className="hh3d-option-desc">Tự động phân giải đan phẩm thấp</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoDecompose} onChange={e => setLuyenDanAutoDecompose(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Lọc Thuộc Tính (Tune)</span>
                                  <span className="hh3d-option-desc">Tự động thay đổi thuộc tính đan</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoTune} onChange={e => setLuyenDanAutoTune(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Sử Dụng Đan Dược</span>
                                  <span className="hh3d-option-desc">Tự động cắn đan dược thu hoạch</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoUse} onChange={e => setLuyenDanAutoUse(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Mời Bạn Bè</span>
                                  <span className="hh3d-option-desc">Gửi lời mời bạn bè vào phòng</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoInvite} onChange={e => setLuyenDanAutoInvite(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Nhận Lời Mời</span>
                                  <span className="hh3d-option-desc">Đồng ý lời mời vào phòng của bạn bè</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoAcceptInvite} onChange={e => setLuyenDanAutoAcceptInvite(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Nhận Mọi Lời Mời</span>
                                  <span className="hh3d-option-desc">Chấp nhận lời mời từ bất kỳ ai</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAcceptAllInvites} onChange={e => setLuyenDanAcceptAllInvites(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div className="hh3d-option">
                                <div className="hh3d-option-label">
                                  <span className="hh3d-option-title">Tự Rời Phòng Khi Xong</span>
                                  <span className="hh3d-option-desc">Rời phòng sau khi mẻ đan kết thúc</span>
                                </div>
                                <label className="switch">
                                  <input type="checkbox" checked={luyenDanAutoLeave} onChange={e => setLuyenDanAutoLeave(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                                  <span className="slider"></span>
                                </label>
                              </div>
                            </div>

                            <div className="hh3d-inline-row">
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Số sao tối thiểu (luyenDanMinStars)</label>
                                <select 
                                  className="select-field" 
                                  value={luyenDanMinStars} 
                                  onChange={e => setLuyenDanMinStars(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                >
                                  <option value="1">1 Sao</option>
                                  <option value="2">2 Sao</option>
                                  <option value="3">3 Sao</option>
                                  <option value="4">4 Sao</option>
                                  <option value="5">5 Sao</option>
                                </select>
                              </div>

                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Thời gian chờ mời (giây)</label>
                                <input 
                                  type="number" 
                                  className="input-field" 
                                  value={luyenDanWaitInviteSeconds} 
                                  onChange={e => setLuyenDanWaitInviteSeconds(e.target.value)}
                                  disabled={selectedProfile.status === 'Running'}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Chọn bạn bè hỗ trợ (Mời / Nhận lời mời)</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  Đã chọn: {luyenDanSelectedFriendIds ? luyenDanSelectedFriendIds.split(',').filter(Boolean).length : 0} người
                                </span>
                              </label>
                              
                              {selectedProfile.metadata?.friends && selectedProfile.metadata.friends.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                                  <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Tìm kiếm bạn bè..." 
                                    value={friendSearch} 
                                    onChange={e => setFriendSearch(e.target.value)}
                                    style={{ padding: '6px 10px', fontSize: '13px' }}
                                  />
                                  <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {selectedProfile.metadata.friends
                                      .filter(f => !friendSearch || (f.display_name || '').toLowerCase().includes(friendSearch.toLowerCase()) || String(f.user_id).includes(friendSearch))
                                      .map(f => {
                                        const uids = luyenDanSelectedFriendIds ? luyenDanSelectedFriendIds.split(',').filter(Boolean) : [];
                                        const isChecked = uids.includes(String(f.user_id));
                                        return (
                                          <label key={f.user_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', userSelect: 'none' }}>
                                            <input 
                                              type="checkbox" 
                                              checked={isChecked} 
                                              disabled={selectedProfile.status === 'Running'}
                                              onChange={e => {
                                                let newIds = [...uids];
                                                if (e.target.checked) {
                                                  newIds.push(String(f.user_id));
                                                } else {
                                                  newIds = newIds.filter(id => id !== String(f.user_id));
                                                }
                                                setLuyenDanSelectedFriendIds(newIds.join(','));
                                              }}
                                            />
                                            <span>{f.display_name} (ID: {f.user_id})</span>
                                          </label>
                                        );
                                      })}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-glass)', borderRadius: '6px', marginTop: '6px' }}>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    ⚠️ Chưa có dữ liệu bạn bè được đồng bộ. Hãy khởi chạy profile này ở chế độ Hiện (Headful) ít nhất 1 lần để tải danh sách bạn bè từ game, hoặc nhập thủ công các ID (cách nhau bằng dấu phẩy):
                                  </p>
                                  <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Ví dụ: 12345,67890" 
                                    value={luyenDanSelectedFriendIds} 
                                    onChange={e => setLuyenDanSelectedFriendIds(e.target.value)}
                                    disabled={selectedProfile.status === 'Running'}
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {settingsTab === 'log' && (
                      <div className="hh3d-log-panel">
                        <div className="hh3d-log-toolbar">
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Bộ lọc log:</span>
                          <select 
                            className="select-field" 
                            style={{ width: 'auto', padding: '4px 10px', fontSize: '12px', height: 'auto' }}
                            value={logFilter}
                            onChange={e => setLogFilter(e.target.value)}
                          >
                            <option value="all">Tất cả ({ (logs[selectedId] || []).length })</option>
                            <option value="info">Thông tin (Info)</option>
                            <option value="success">Thành công (Success)</option>
                            <option value="warning">Cảnh báo (Warning)</option>
                            <option value="error">Lỗi (Error)</option>
                          </select>
                          <button 
                            className="btn btn-secondary" 
                            style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', marginLeft: 'auto' }} 
                            onClick={clearLogs}
                          >
                            <Trash2 size={12} style={{ marginRight: '4px' }} />
                            Xóa Logs
                          </button>
                        </div>
                        <div className="hh3d-log-screen">
                          {((logs[selectedId] || []).filter(log => logFilter === 'all' || log.level === logFilter)).length === 0 ? (
                            <span className="text-slate-600 italic">Chưa có log hệ thống. Vui lòng bấm chạy Profile...</span>
                          ) : (
                            ((logs[selectedId] || []).filter(log => logFilter === 'all' || log.level === logFilter)).map((log, idx) => (
                              <div key={idx} className="hh3d-log-line">
                                <span className="log-time" style={{ color: '#64748b' }}>[{log.timestamp}]</span>
                                <span className={`log-badge ${log.level}`}>{log.level}</span>
                                <span className={`log-text ${log.level}`}>{log.text}</span>
                              </div>
                            ))
                          )}
                          <div ref={terminalEndRef}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {settingsTab !== 'log' && (
                    <div className="hh3d-settings-footer">
                      <button 
                        className="btn btn-primary" 
                        style={{ width: 'auto' }} 
                        onClick={handleUpdateProfile} 
                        disabled={loading || selectedProfile.status === 'Running'}
                      >
                        💾 Lưu Toàn Bộ Cấu Hình
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ width: 'auto', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }} 
                        onClick={handleDeleteProfile} 
                        disabled={loading || selectedProfile.status === 'Running'}
                      >
                        🗑️ Xóa Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel empty-state" style={{ flex: 1 }}>
            <Terminal className="empty-icon" size={48} />
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>HH3D Multi-Account Console</h3>
            <p style={{ maxWidth: '400px', fontSize: '14px' }}>
              Chào mừng bạn đến với bảng điều khiển tự động hóa. Hãy tạo một Profile trình duyệt hoặc chọn profile có sẵn bên trái để khởi chạy.
            </p>

            <div className="guide-box">
              <h4>💡 Hướng dẫn vận hành nhanh:</h4>
              <ol>
                <li>Click <code>Tạo Profile Mới</code> bên dưới thanh menu trái.</li>
                <li>Điền tên gợi nhớ, cấu hình Proxy (nếu có), bấm tạo.</li>
                <li>Nhấn <code>Chạy Trực Quan (Start Headful)</code> để mở trình duyệt Chrome thật lên.</li>
                <li>**Đăng nhập thủ công tài khoản game** trên trang web vừa hiện ra, tích chọn các tính năng auto.</li>
                <li>Tắt trình duyệt đi. Từ nay, bạn chỉ cần nhấn <code>Chạy Ngầm (Start Headless)</code> để chạy ẩn danh siêu nhẹ máy!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
