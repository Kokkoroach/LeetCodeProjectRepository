// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, MapPin, Star, Bell, Menu, X, Train, Bus, AlertTriangle, CheckCircle, Sun, Moon } from 'lucide-react';
import AuthService from './services/AuthService';
import ApiService from './services/ApiService';
import MapView from './MapView';

// MTA Line Colors and Groups
const lineColors = {
  // Red Lines
  '1': { bg: 'bg-red-600', text: 'text-white', group: 'Red', hex: '#EE352E' },
  '2': { bg: 'bg-red-600', text: 'text-white', group: 'Red', hex: '#EE352E' },
  '3': { bg: 'bg-red-600', text: 'text-white', group: 'Red', hex: '#EE352E' },
  // Dark Green Lines
  '4': { bg: 'bg-emerald-800', text: 'text-white', group: 'Dark Green', hex: '#00933C' },
  '5': { bg: 'bg-emerald-800', text: 'text-white', group: 'Dark Green', hex: '#00933C' },
  '6': { bg: 'bg-emerald-800', text: 'text-white', group: 'Dark Green', hex: '#00933C' },
  '6X': { bg: 'bg-emerald-800', text: 'text-white', group: 'Dark Green', hex: '#00933C' },
  // Purple Lines
  '7': { bg: 'bg-purple-600', text: 'text-white', group: 'Purple', hex: '#B933AD' },
  '7X': { bg: 'bg-purple-600', text: 'text-white', group: 'Purple', hex: '#B933AD' },
  // Blue Lines (A, C, E)
  'A': { bg: 'bg-sky-600', text: 'text-white', group: 'Blue', hex: '#0039A6' },
  'C': { bg: 'bg-sky-600', text: 'text-white', group: 'Blue', hex: '#0039A6' },
  'E': { bg: 'bg-sky-600', text: 'text-white', group: 'Blue', hex: '#0039A6' },
  // Orange Lines (B, D, F, M)
  'B': { bg: 'bg-orange-500', text: 'text-white', group: 'Orange', hex: '#FF6319' },
  'D': { bg: 'bg-orange-500', text: 'text-white', group: 'Orange', hex: '#FF6319' },
  'F': { bg: 'bg-orange-500', text: 'text-white', group: 'Orange', hex: '#FF6319' },
  'M': { bg: 'bg-orange-500', text: 'text-white', group: 'Orange', hex: '#FF6319' },
  // Yellow Lines
  'N': { bg: 'bg-yellow-500', text: 'text-black', group: 'Yellow', hex: '#FCCC0A' },
  'Q': { bg: 'bg-yellow-500', text: 'text-black', group: 'Yellow', hex: '#FCCC0A' },
  'R': { bg: 'bg-yellow-500', text: 'text-black', group: 'Yellow', hex: '#FCCC0A' },
  'W': { bg: 'bg-yellow-500', text: 'text-black', group: 'Yellow', hex: '#FCCC0A' },
  // Brown Lines
  'J': { bg: 'bg-amber-900', text: 'text-white', group: 'Brown', hex: '#996633' },
  'Z': { bg: 'bg-amber-900', text: 'text-white', group: 'Brown', hex: '#996633' },
  // Green Lines
  'G': { bg: 'bg-emerald-600', text: 'text-white', group: 'Green', hex: '#00933C' },
  // Gray Lines (L, S, and others)
  'L': { bg: 'bg-gray-700', text: 'text-white', group: 'Gray', hex: '#A7A9AC' },
  'S': { bg: 'bg-gray-700', text: 'text-white', group: 'Gray', hex: '#A7A9AC' },
  'GS': { bg: 'bg-gray-700', text: 'text-white', group: 'Gray', hex: '#A7A9AC' },
  'FS': { bg: 'bg-gray-700', text: 'text-white', group: 'Gray', hex: '#A7A9AC' },
  'H': { bg: 'bg-gray-700', text: 'text-white', group: 'Gray', hex: '#A7A9AC' },
  // Staten Island Railway
  'SI': { bg: 'bg-emerald-700', text: 'text-white', group: 'Staten Island', hex: '#118844' },
};

// Translation support
const translations = {
  en: {
    title: 'NYC Transit Hub',
    dashboard: 'Service Status Dashboard',
    favorites: 'Favorites',
    map: 'Transit Map',
    alerts: 'Alerts',
    profile: 'Profile',
    goodService: 'Good Service',
    delays: 'Delays',
    serviceChange: 'Service Change',
    searchPlaceholder: 'Search stations or routes...',
    accessible: 'Accessible',
    notAccessible: 'Not Accessible',
    lines: 'Lines',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    loading: 'Loading...',
    noFavorites: 'No favorites yet. Add some from the dashboard!',
    noAlerts: 'No service alerts at this time!',
    viewAllAlerts: 'View all {n} alerts',
    collapseAlerts: 'Collapse ({n} alerts)',
    signInToSaveFavorites: 'Please sign in to save favorites',
  },
  es: {
    title: 'Centro de Tránsito NYC',
    dashboard: 'Panel de Estado del Servicio',
    favorites: 'Favoritos',
    map: 'Mapa de Tránsito',
    alerts: 'Alertas',
    profile: 'Perfil',
    goodService: 'Buen Servicio',
    delays: 'Retrasos',
    serviceChange: 'Cambio de Servicio',
    searchPlaceholder: 'Buscar estaciones o rutas...',
    accessible: 'Accesible',
    notAccessible: 'No Accesible',
    lines: 'Líneas',
    addToFavorites: 'Añadir a Favoritos',
    removeFromFavorites: 'Quitar de Favoritos',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    loading: 'Cargando...',
    noFavorites: '¡Aún no hay favoritos!',
    noAlerts: '¡No hay alertas de servicio en este momento!',
    viewAllAlerts: 'Ver las {n} alertas',
    collapseAlerts: 'Contraer ({n} alertas)',
    signInToSaveFavorites: 'Inicia sesión para guardar favoritos',
  },
  zh: {
    title: '纽约交通中心',
    dashboard: '服务状态面板',
    favorites: '收藏',
    map: '交通地图',
    alerts: '提醒',
    profile: '个人资料',
    goodService: '服务正常',
    delays: '延误',
    serviceChange: '服务变更',
    searchPlaceholder: '搜索车站或路线...',
    accessible: '无障碍',
    notAccessible: '无障碍设施不可用',
    lines: '线路',
    addToFavorites: '添加到收藏',
    removeFromFavorites: '从收藏中移除',
    signIn: '登录',
    signUp: '注册',
    signOut: '退出',
    email: '电子邮件',
    password: '密码',
    loading: '加载中...',
    noFavorites: '还没有收藏！',
    noAlerts: '目前没有服务提醒！',
    viewAllAlerts: '查看全部 {n} 条提醒',
    collapseAlerts: '收起 ({n} 条提醒)',
    signInToSaveFavorites: '请登录以保存收藏',
  },
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light'; } catch { return 'light'; }
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAlerts, setExpandedAlerts] = useState(new Set()); // Track which alerts are expanded
  
  // Data states
  const [serviceStatus, setServiceStatus] = useState([]);
  const [stations, setStations] = useState([]);
  const [routePolylines, setRoutePolylines] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userAlerts, setUserAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  // Persist and apply language and theme
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('language');
      if (savedLang) setLanguage(savedLang);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('language', language); } catch {}
  }, [language]);

  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load initial data
  useEffect(() => {
    loadServiceStatus();
    loadStations();
    loadRoutePolylines();
  }, []);

  const loadServiceStatus = async () => {
    try {
      const result = await ApiService.getServiceStatus();
      if (result.success) {
        setServiceStatus(result.data);
      }
    } catch (error) {
      console.error('Error loading service status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStations = async () => {
    try {
      const result = await ApiService.getStations();
      if (result.success) {
        setStations(result.data);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const loadRoutePolylines = async () => {
    try {
      const result = await ApiService.getRoutePolylines();
      if (result.success) {
        // result.routes is an array of { id, name, coordinates }
        setRoutePolylines(result.routes || []);
        // also update stations if the GTFS static returned a richer stops list
        if (result.stops) setStations(result.stops);
      }
    } catch (error) {
      console.error('Error loading route polylines:', error);
    }
  };

  const loadUserData = async (firebaseUid) => {
    try {
      const [favResult, alertResult] = await Promise.all([
        ApiService.getFavorites(firebaseUid),
        ApiService.getAlerts(firebaseUid)
      ]);

      if (favResult.success) {
        setFavorites(favResult.favorites);
      }
      if (alertResult.success) {
        setUserAlerts(alertResult.alerts);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'signin') {
        await AuthService.signIn(email, password);
      } else {
        await AuthService.signUp(email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      setFavorites([]);
      setUserAlerts([]);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleFavorite = async (routeId, routeType) => {
    if (!user) {
      alert(t.signInToSaveFavorites);
      return;
    }

    try {
      const existing = favorites.find(f => f.route_id === routeId);
      
      if (existing) {
        await ApiService.deleteFavorite(existing.id);
        setFavorites(favorites.filter(f => f.id !== existing.id));
      } else {
        const result = await ApiService.addFavorite(user.uid, routeId, routeType);
        if (result.success) {
          loadUserData(user.uid);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (routeId) => {
    return favorites.some(f => f.route_id === routeId);
  };

  const toggleExpandAlert = (routeId) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(routeId)) {
      newExpanded.delete(routeId);
    } else {
      newExpanded.add(routeId);
    }
    setExpandedAlerts(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delay':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'service-change':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 border-green-300';
      case 'delay':
        return 'bg-yellow-100 border-yellow-300';
      case 'service-change':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const filteredServices = serviceStatus.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.lines.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Train className="w-16 h-16 text-blue-600 animate-bounce mx-auto mb-4" />
          <p className="text-xl text-gray-700">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Train className="w-8 h-8" />
              <h1 className="text-2xl font-bold">{t.title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-blue-700 text-white px-3 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="zh">中文</option>
              </select>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
                className="p-2 rounded-lg hover:bg-blue-700"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-blue-700 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Auth Button */}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="hidden md:block bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  {t.signOut}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:block bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  {t.signIn}
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`${menuOpen ? 'block' : 'hidden'} md:flex gap-4 mt-4`}>
            {[
              { id: 'dashboard', icon: Clock, label: t.dashboard },
              { id: 'favorites', icon: Star, label: t.favorites },
              { id: 'map', icon: MapPin, label: t.map },
              { id: 'alerts', icon: Bell, label: t.alerts },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{t.dashboard}</h2>
            
            {/* Group services by color */}
            {['Red', 'Dark Green', 'Purple', 'Blue', 'Orange', 'Green', 'Yellow', 'Brown', 'Gray', 'Staten Island'].map(colorGroup => {
              const groupedServices = filteredServices.filter(service => 
                lineColors[service.id]?.group === colorGroup
              );
              
              if (groupedServices.length === 0) return null;
              
              return (
                <div key={colorGroup} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: lineColors[groupedServices[0].id]?.hex }}></div>
                    {colorGroup} Lines
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedServices.map(service => {
                      const isExpanded = expandedAlerts.has(service.id);
                      const messages = service.messages || (service.message ? [{ text: service.message }] : []);
                      const hasMultiple = messages.length > 1;
                      const colors = lineColors[service.id] || { bg: 'bg-gray-500', text: 'text-white', hex: '#999' };
                      
                      return (
                        <div
                          key={service.id}
                          className={`p-4 rounded-lg border-2 shadow-md ${getStatusColor(service.status)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {/* Line Badge */}
                              <span className={`${colors.bg} ${colors.text} w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm`}>
                                {service.id}
                              </span>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">{colors.group}</p>
                                <h3 className="text-lg font-bold">{service.name}</h3>
                              </div>
                            </div>
                            {getStatusIcon(service.status)}
                          </div>
                          {/* Display first message or all if expanded */}
                          <div className="space-y-2">
                            {messages.length > 0 ? (
                              <>
                                {/* Show header (if present) then description or fallback text */}
                                {messages[0].header && (
                                  <p className="text-sm font-semibold text-gray-800">{messages[0].header}</p>
                                )}
                                {messages[0].description ? (
                                  <p className="text-gray-700 text-sm">{messages[0].description}</p>
                                ) : (
                                  <p className="text-gray-700 text-sm">{messages[0].text}</p>
                                )}
                                {isExpanded && messages.slice(1).map((msg, idx) => (
                                  <div key={idx} className="border-t border-gray-400 pt-2">
                                    {msg.header && (
                                      <p className="text-sm font-semibold text-gray-800">{msg.header}</p>
                                    )}
                                    {msg.description ? (
                                      <p className="text-gray-700 text-sm">{msg.description}</p>
                                    ) : (
                                      <p className="text-gray-700 text-sm">{msg.text}</p>
                                    )}
                                  </div>
                                ))}
                              </>
                            ) : (
                              <p className="text-gray-700">Good Service</p>
                            )}
                          </div>
                          
                          {/* Show expand button if multiple messages */}
                          {hasMultiple && (
                            <button
                              onClick={() => toggleExpandAlert(service.id)}
                              className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
                            >
                              {isExpanded ? t.collapseAlerts.replace('{n}', messages.length) : t.viewAllAlerts.replace('{n}', messages.length)}
                            </button>
                          )}
                          
                          <button
                            onClick={() => toggleFavorite(service.id, service.type)}
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Star className={`w-4 h-4 ${isFavorite(service.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            {isFavorite(service.id) ? t.removeFromFavorites : t.addToFavorites}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{t.favorites}</h2>
            
            {!user ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">{t.signInToSaveFavorites}</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {t.signIn}
                </button>
              </div>
            ) : favorites.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">{t.noFavorites}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceStatus
                  .filter(service => isFavorite(service.id))
                  .map(service => {
                    const isExpanded = expandedAlerts.has(service.id);
                    const messages = service.messages || (service.message ? [{ text: service.message }] : []);
                    const hasMultiple = messages.length > 1;
                    const colors = lineColors[service.id] || { bg: 'bg-gray-500', text: 'text-white', hex: '#999' };
                    
                    return (
                      <div
                        key={service.id}
                        className={`p-4 rounded-lg border-2 shadow-md ${getStatusColor(service.status)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {/* Line Badge */}
                            <span className={`${colors.bg} ${colors.text} w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm`}>
                              {service.id}
                            </span>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">{colors.group}</p>
                              <h3 className="text-lg font-bold">{service.name}</h3>
                            </div>
                          </div>
                          {getStatusIcon(service.status)}
                        </div>
                        {/* Display first message or all if expanded */}
                        <div className="space-y-2">
                            {messages.length > 0 ? (
                            <>
                              {messages[0].header && (
                                <p className="text-sm font-semibold text-gray-800">{messages[0].header}</p>
                              )}
                              {messages[0].description ? (
                                <p className="text-gray-700 text-sm">{messages[0].description}</p>
                              ) : (
                                <p className="text-gray-700 text-sm">{messages[0].text}</p>
                              )}
                                {isExpanded && messages.slice(1).map((msg, idx) => (
                                <div key={idx} className="border-t border-gray-400 pt-2">
                                  {msg.header && (
                                    <p className="text-sm font-semibold text-gray-800">{msg.header}</p>
                                  )}
                                  {msg.description ? (
                                    <p className="text-gray-700 text-sm">{msg.description}</p>
                                  ) : (
                                    <p className="text-gray-700 text-sm">{msg.text}</p>
                                  )}
                                </div>
                                ))}
                            </>
                          ) : (
                              <p className="text-gray-700">{t.goodService}</p>
                          )}
                        </div>
                        
                        {/* Show expand button if multiple messages */}
                          {hasMultiple && (
                            <button
                              onClick={() => toggleExpandAlert(service.id)}
                              className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
                            >
                              {isExpanded ? t.collapseAlerts.replace('{n}', messages.length) : t.viewAllAlerts.replace('{n}', messages.length)}
                            </button>
                          )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{t.map}</h2>
            <MapView stations={stations} serviceStatus={serviceStatus} lineColors={lineColors} routePolylines={routePolylines} />
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{t.alerts}</h2>
            
            <div className="space-y-4">
              {serviceStatus
                .filter(service => service.status !== 'good')
                .map(service => {
                  const isExpanded = expandedAlerts.has(service.id);
                  const messages = service.messages || (service.message ? [{ text: service.message }] : []);
                  const hasMultiple = messages.length > 1;
                  const colors = lineColors[service.id] || { bg: 'bg-gray-500', text: 'text-white', hex: '#999' };
                  
                  return (
                    <div
                      key={service.id}
                      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {/* Line Badge */}
                        <span className={`${colors.bg} ${colors.text} w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                          {service.id}
                        </span>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">{colors.group}</p>
                          <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                        </div>
                      </div>
                      {/* Display first message or all if expanded */}
                      <div className="ml-14">
                        {messages.length > 0 ? (
                          <>
                            {messages[0].header && (
                              <p className="text-sm font-semibold text-gray-800">{messages[0].header}</p>
                            )}
                            {messages[0].description ? (
                              <p className="text-gray-700">{messages[0].description}</p>
                            ) : (
                              <p className="text-gray-700">{messages[0].text}</p>
                            )}
                            {isExpanded && (
                              <div className="mt-3 border-t border-gray-300 pt-3 space-y-3">
                                {messages.slice(1).map((msg, idx) => (
                                  <div key={idx}>
                                    {msg.header && (
                                      <p className="text-sm font-semibold text-gray-800">{msg.header}</p>
                                    )}
                                    {msg.description ? (
                                      <p className="text-gray-700">{msg.description}</p>
                                    ) : (
                                      <p className="text-gray-700">{msg.text}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-700">{t.goodService}</p>
                        )}
                      </div>
                      
                      {/* Show expand button if multiple messages */}
                      {hasMultiple && (
                        <button
                          onClick={() => toggleExpandAlert(service.id)}
                          className="mt-3 ml-14 text-sm text-blue-600 hover:underline font-semibold"
                        >
                          {isExpanded ? t.collapseAlerts.replace('{n}', messages.length) : t.viewAllAlerts.replace('{n}', messages.length)}
                        </button>
                      )}
                    </div>
                  );
                })}
              
              {serviceStatus.filter(service => service.status !== 'good').length === 0 && (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <p className="text-gray-600">{t.noAlerts}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {authMode === 'signin' ? t.signIn : t.signUp}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {authMode === 'signin' ? t.signIn : t.signUp}
              </button>
            </form>
            
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="w-full mt-4 text-blue-600 hover:underline"
            >
              {authMode === 'signin' ? t.signUp : t.signIn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}