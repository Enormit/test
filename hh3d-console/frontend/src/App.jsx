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
  const [khoangmach_use_buff, setKhoangmachUseBuff] = useState(false);
  const [khoangmach_fast_attack, setKhoangmachFastAttack] = useState(false);
  const [khoangmach_check_interval, setKhoangmachCheckInterval] = useState('5');
  const [diceRollChoice, setDiceRollChoice] = useState('tai');
  const [tienduyenChoice, setTienduyenChoice] = useState('5');
  const [hoangvucMaximizeDamage, setHoangvucMaximizeDamage] = useState(false);
  const [selfSchedule_h, setSelfScheduleH] = useState('0');
  const [selfSchedule_m, setSelfScheduleM] = useState('30');

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
        setKhoangmachUseBuff(data.khoangmach_use_buff === 'true' || data.khoangmach_use_buff === true);
        setKhoangmachFastAttack(data.khoangmach_fast_attack === 'true' || data.khoangmach_fast_attack === true);
        setKhoangmachCheckInterval(data.khoangmach_check_interval || '5');
        
        setDiceRollChoice(data['dice-roll-choice'] || 'tai');
        setTienduyenChoice(data['tienduyen-choice'] || '5');
        setHoangvucMaximizeDamage(data.hoangvucMaximizeDamage === 'true' || data.hoangvucMaximizeDamage === true);
        setSelfScheduleH(data.selfSchedule_h || '0');
        setSelfScheduleM(data.selfSchedule_m || '30');
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
        const { id, status } = msg.data;
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, status } : p));
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
          khoangmach_use_buff,
          khoangmach_fast_attack,
          khoangmach_check_interval,
          'dice-roll-choice': diceRollChoice,
          'tienduyen-choice': tienduyenChoice,
          hoangvucMaximizeDamage,
          selfSchedule_h,
          selfSchedule_m
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
                    <button className="btn btn-danger" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleStop} disabled={loading}>
                      <Square size={16} />
                      Dừng Trình Duyệt (Stop)
                    </button>
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
              <div className="tab-content-settings" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '20px', height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
                
                {/* Left Column: Profile & Proxy Config */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                  <h3 className="panel-title" style={{ fontSize: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>Kết Nối & Profile</h3>
                  
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
                      <div className="inline-form-row" style={{ display: 'flex', gap: '10px' }}>
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

                      <div className="inline-form-row" style={{ display: 'flex', gap: '10px' }}>
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

                  <div className="toggle-container">
                    <div className="toggle-label">
                      <span className="toggle-title">Mặc định chạy ngầm</span>
                      <span className="toggle-subtitle">Tự ẩn Firefox khi bấm Start</span>
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleUpdateProfile} 
                      disabled={loading || selectedProfile.status === 'Running'}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Settings size={16} />
                      Lưu Toàn Bộ Cấu Hình
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={handleDeleteProfile} 
                      disabled={loading || selectedProfile.status === 'Running'}
                      style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                      Xóa Profile Này
                    </button>
                  </div>
                </div>

                {/* Right Column: Detailed Userscript Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '4px' }}>
                  
                  {/* Category 1: Daily Tasks */}
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <h4 className="panel-title" style={{ fontSize: '15px', color: 'var(--accent-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} />
                      Nhiệm Vụ Hàng Ngày (Daily Quests)
                    </h4>
                    
                    <div className="toggle-container" style={{ marginBottom: '12px', background: 'rgba(0, 240, 255, 0.03)', border: '1px dashed rgba(0, 240, 255, 0.2)' }}>
                      <div className="toggle-label">
                        <span className="toggle-title" style={{ color: 'var(--accent-cyan)' }}>Kích hoạt Chế độ VIP (generalVipMode)</span>
                        <span className="toggle-subtitle">Mở các chức năng nhận lượt, claim thưởng dành riêng cho VIP</span>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Điểm Danh</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoDiemDanh} onChange={e => setAutoDiemDanh(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Thí Luyện</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoThiLuyen} onChange={e => setAutoThiLuyen(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Phúc Lợi</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoPhucLoi} onChange={e => setAutoPhucLoi(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Nhận Trận Văn (VIP)</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoClaimDailyTurns} onChange={e => setAutoClaimDailyTurns(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Hoang Vực</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoHoangVuc} onChange={e => setAutoHoangVuc(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Mê Cung</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoMeCung} onChange={e => setAutoMeCung(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Đổ Thạch</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoDoThach} onChange={e => setAutoDoThach(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Bí Cảnh</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoBiCanh} onChange={e => setAutoBiCanh(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Tiên Duyên</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoTienDuyen} onChange={e => setAutoTienDuyen(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự H.Động Ngày</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoHoatDongNgay} onChange={e => setAutoHoatDongNgay(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Alchemy Config */}
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <h4 className="panel-title" style={{ fontSize: '15px', color: 'var(--accent-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={16} />
                      Tự Động Luyện Đan (Alchemy Settings)
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Kích hoạt Luyện Đan</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoLuyenDan} onChange={e => setAutoLuyenDan(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Bắt Đầu Mẻ Mới</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoStart} onChange={e => setLuyenDanAutoStart(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Phân Giải Đan Thừa</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoDecompose} onChange={e => setLuyenDanAutoDecompose(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Lọc Thuộc Tính (Tune)</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoTune} onChange={e => setLuyenDanAutoTune(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Sử Dụng Đan Dược</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoUse} onChange={e => setLuyenDanAutoUse(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Mời Bạn Bè</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoInvite} onChange={e => setLuyenDanAutoInvite(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Nhận Lời Mời</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoAcceptInvite} onChange={e => setLuyenDanAutoAcceptInvite(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Nhận Mọi Lời Mời</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAcceptAllInvites} onChange={e => setLuyenDanAcceptAllInvites(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Rời Phòng Khi Xong</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={luyenDanAutoLeave} onChange={e => setLuyenDanAutoLeave(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="inline-form-row" style={{ display: 'flex', gap: '15px' }}>
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
                  </div>

                  {/* Category 3: Mining Config */}
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <h4 className="panel-title" style={{ fontSize: '15px', color: 'var(--accent-orange)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Server size={16} />
                      Tự Động Khoáng Mạch (Mining Settings)
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Kích hoạt Khoáng Mạch</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={autoKhoangMach} onChange={e => setAutoKhoangMach(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Động Cướp Mỏ</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={khoangmach_auto_takeover} onChange={e => setKhoangmachAutoTakeover(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Động Xoay Vòng Mỏ</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={khoangmach_auto_takeover_rotation} onChange={e => setKhoangmachAutoTakeoverRotation(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Tự Động Bơm Buff</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={khoangmach_use_buff} onChange={e => setKhoangmachUseBuff(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="toggle-container">
                        <div className="toggle-label"><span className="toggle-title">Chế Độ Tấn Công Nhanh</span></div>
                        <label className="switch">
                          <input type="checkbox" checked={khoangmach_fast_attack} onChange={e => setKhoangmachFastAttack(e.target.checked)} disabled={selectedProfile.status === 'Running'} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="inline-form-row" style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Chế độ nhận thưởng</label>
                        <select 
                          className="select-field" 
                          value={khoangmach_reward_mode} 
                          onChange={e => setKhoangmachRewardMode(e.target.value)}
                          disabled={selectedProfile.status === 'Running'}
                        >
                          <option value="any">Bất kỳ quặng nào</option>
                          <option value="high">Ưu tiên quặng cao</option>
                          <option value="buff">Chỉ quặng có buff</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Chu kỳ quét mỏ (phút)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={khoangmach_check_interval} 
                          onChange={e => setKhoangmachCheckInterval(e.target.value)}
                          disabled={selectedProfile.status === 'Running'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Other Settings & Timer */}
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <h4 className="panel-title" style={{ fontSize: '15px', color: '#a855f7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Power size={16} />
                      Cấu Hình Chi Tiết Khác (Timer & Dice)
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                      <div className="form-group">
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

                      <div className="form-group">
                        <label>Lựa chọn Tiên Duyên</label>
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

                    <div className="toggle-container" style={{ marginBottom: '16px' }}>
                      <div className="toggle-label">
                        <span className="toggle-title">Tối ưu Sát thương Hoang Vực</span>
                        <span className="toggle-subtitle">Tự động chọn skill tối ưu nhất</span>
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
