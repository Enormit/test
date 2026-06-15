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
      setProfiles(prev => prev.map(p => p.id === selectedId ? updated : p));
      alert('Đã cập nhật cấu hình profile!');
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
              <div className="tab-content-settings glass-panel" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="panel-header">
                  <h3 className="panel-title">Cấu hình Proxy & Profile: {selectedProfile.name}</h3>
                </div>
                <div className="panel-body">
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
                      <option value="None">Không Proxy</option>
                      <option value="HTTP">HTTP Proxy</option>
                      <option value="SOCKS5">SOCKS5 Proxy</option>
                    </select>
                  </div>

                  {proxyType !== 'None' && (
                    <>
                      <div className="inline-form-row">
                        <div className="form-group">
                          <label>IP / Host</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={proxyHost} 
                            onChange={e => setProxyHost(e.target.value)}
                            disabled={selectedProfile.status === 'Running'}
                          />
                        </div>
                        <div className="form-group">
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

                      <div className="inline-form-row">
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

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={handleUpdateProfile} 
                      disabled={loading || selectedProfile.status === 'Running'}
                    >
                      <Settings size={14} />
                      Lưu cấu hình
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: '12px', width: 'auto' }}
                      onClick={handleDeleteProfile} 
                      disabled={loading || selectedProfile.status === 'Running'}
                    >
                      <Trash2 size={14} />
                      Xóa Profile
                    </button>
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
