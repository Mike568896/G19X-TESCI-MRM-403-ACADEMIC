import React, { useState, useEffect } from 'react';
import { 
  // Iconos para Login / Registro
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2,
  ChevronDown,
  KeyRound,
  Clock,
  FileCheck,
  // Iconos para Dashboard / Sidebar
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Calendar as CalendarIcon, 
  FolderCheck, 
  Bell, 
  Search, 
  LogOut, 
  Plus,
  ChevronRight,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function App() {
  // ==========================================
  // ESTADOS GENERALES Y NAVEGACIÓN
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  // Datos del usuario (se llenarán al iniciar sesión / registrarse)
  const [currentUser, setCurrentUser] = useState({
    nombre: 'Miguel Romero',
    rol: 'Administrador de Cumplimiento',
    departamento: 'Sistemas y TI',
    email: 'm.romero@plurione.com'
  });

  // ==========================================
  // ESTADOS Y DATOS DE LA PANTALLA DE LOGIN
  // ==========================================
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loginFormData, setLoginFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    departamento: 'Asuntos legales y cumplimiento normativo',
    codigoInvitacion: ''
  });

  // Carrusel animado del panel izquierdo en Login
  const liveCards = [
    {
      id: 1,
      titulo: "Entrega de CFDI de nómina",
      entidad: "SAT · LMISR",
      estadoText: "2 días de retraso",
      badgeText: "Vencida",
      badgeType: "danger",
      updated: "Hace un momento"
    },
    {
      id: 2,
      titulo: "Declaración mensual de impuestos",
      entidad: "SAT · Código Fiscal",
      estadoText: "Fechado 17 ene",
      badgeText: "Completada",
      badgeType: "success",
      updated: "Hace 2 min"
    },
    {
      id: 3,
      titulo: "Dictamen de Seguridad e Higiene",
      entidad: "STPS · NOM-030",
      estadoText: "Próximo a vencer",
      badgeText: "En revisión",
      badgeType: "warning",
      updated: "Hace 5 min"
    }
  ];

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCardIndex((prev) => (prev + 1) % liveCards.length);
        setIsTransitioning(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, [liveCards.length, isAuthenticated]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && loginFormData.nombre) {
      setCurrentUser((prev) => ({
        ...prev,
        nombre: loginFormData.nombre,
        email: loginFormData.email || prev.email,
        departamento: loginFormData.departamento || prev.departamento
      }));
    } else if (loginFormData.email) {
      setCurrentUser((prev) => ({
        ...prev,
        email: loginFormData.email
      }));
    }
    // Entrar al Dashboard
    setIsAuthenticated(true);
  };

  // Ítems del menú lateral del Dashboard
  const navItems = [
    { id: 'inicio', label: 'Inicio / Resumen', icon: LayoutDashboard },
    { id: 'obligaciones', label: 'Obligaciones', icon: CheckSquare, badge: '3' },
    { id: 'empleados', label: 'Personal / Equipo', icon: Users },
    { id: 'calendario', label: 'Calendario', icon: CalendarIcon },
    { id: 'documentos', label: 'Evidencias y Docs', icon: FolderCheck },
    { id: 'cuenta', label: 'Mi Cuenta', icon: User },
  ];

  const currentCard = liveCards[activeCardIndex];

  // ==========================================
  // VISTA 1: PANTALLA DE ACCESO (LOGIN / REGISTRO)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="w-full max-w-6xl bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 my-auto overflow-hidden">
          
          {/* PANEL IZQUIERDO: Branding & Tarjetas Animadas */}
          <div className="lg:col-span-6 p-6 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#0d1322] to-blue-950/30">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 text-white font-black text-lg px-3 py-1.5 rounded-xl shadow-lg shadow-blue-600/30">
                  P1
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  Pluri Uno
                </span>
              </div>

              <p className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-2">
                PLATAFORMA DE SEGUIMIENTO DE OBLIGACIONES LEGALES
              </p>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
                Cada obligación legal, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">
                  cada plazo crítico, bajo control.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                Alertas regulatorias inteligentes, calendarios de vencimiento y evidencia de auditoría lista para reguladores — todo en un solo panel para tu equipo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="flex items-center gap-2 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Monitoreo en Vivo
                  </span>
                  <span className="text-slate-500 text-[11px]">{currentCard.updated}</span>
                </div>

                <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                        {currentCard.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {currentCard.entidad} · {currentCard.estadoText}
                      </p>
                    </div>

                    {currentCard.badgeType === 'danger' && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-1 shrink-0">
                        <AlertCircle className="w-3 h-3" /> {currentCard.badgeText}
                      </span>
                    )}

                    {currentCard.badgeType === 'success' && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> {currentCard.badgeText}
                      </span>
                    )}

                    {currentCard.badgeType === 'warning' && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {currentCard.badgeText}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-800/60 justify-center">
                  {liveCards.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === activeCardIndex ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Cumplimiento Global</span>
                  <span className="text-emerald-400">96%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full w-[96%] transition-all duration-500"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-slate-800">
                <div>
                  <span className="text-lg font-bold text-white">12</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">Obligaciones</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">3</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">Alertas Activas</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">5</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">Áreas Monitoreo</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Cifrado de extremo a extremo</span>
                <span>•</span>
                <span className="flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-slate-400" /> Evidencia auditada</span>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: Formulario de Login / Registro */}
          <div className="lg:col-span-6 p-6 lg:p-10 flex flex-col justify-center bg-[#0b101d]">
            <div className="max-w-md w-full mx-auto">
              
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isLogin ? 'Bienvenido de nuevo' : 'Crear una cuenta'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isLogin 
                    ? 'Ingresa con tu correo institucional para acceder al panel de cumplimiento.' 
                    : 'Regístrate para solicitar acceso a la plataforma corporativa.'}
                </p>
              </div>

              {/* Switch Pestañas */}
              <div className="flex bg-[#121929] p-1 rounded-xl mb-5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    isLogin 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    !isLogin 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                
                {/* CAMPO: Nombre Completo (Registro) */}
                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={loginFormData.nombre}
                        onChange={handleLoginChange}
                        placeholder="Ej. Miguel Romero"
                        className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* CAMPO: Correo */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                    Correo Institucional
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={loginFormData.email}
                      onChange={handleLoginChange}
                      placeholder="usuario@plurione.com"
                      className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* CAMPO: Contraseña */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Contraseña
                    </label>
                    {isLogin && (
                      <a href="#forgot" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                        ¿Olvidaste tu contraseña?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={loginFormData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* CAMPOS EXTRA: Registro */}
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                        Departamento / Área
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          name="departamento"
                          value={loginFormData.departamento}
                          onChange={handleLoginChange}
                          className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        >
                          <option value="Asuntos legales y cumplimiento normativo" className="bg-[#0b101d] text-white">
                            Asuntos legales y cumplimiento normativo
                          </option>
                          <option value="Finanzas y Contabilidad" className="bg-[#0b101d] text-white">Finanzas y Contabilidad</option>
                          <option value="Recursos Humanos" className="bg-[#0b101d] text-white">Recursos Humanos</option>
                          <option value="Operaciones y Logística" className="bg-[#0b101d] text-white">Operaciones y Logística</option>
                          <option value="Sistemas y TI" className="bg-[#0b101d] text-white">Sistemas y TI</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                        Código de Organización <span className="text-slate-600 font-normal">(Opcional)</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="codigoInvitacion"
                          value={loginFormData.codigoInvitacion}
                          onChange={handleLoginChange}
                          placeholder="Ej. PLURI-8930"
                          className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-2 cursor-pointer transition-colors"
                >
                  {isLogin ? 'Ingresar a la Plataforma' : 'Solicitar Registro'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-[#0b101d] px-3 text-slate-500 font-semibold">O TAMBIÉN</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthenticated(true)}
                className="w-full bg-[#121929] hover:bg-slate-800/60 text-slate-200 border border-slate-800 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H1z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H1z"/>
                </svg>
                <span>Iniciar sesión con Microsoft</span>
                <span className="bg-slate-800 text-[9px] text-slate-400 px-1.5 py-0.5 rounded ml-1">Ingresar ID</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center mt-4">
                Al continuar aceptas los{' '}
                <a href="#terms" className="underline hover:text-slate-400">Términos de servicio</a>{' '}
                y la{' '}
                <a href="#privacy" className="underline hover:text-slate-400">Política de privacidad</a>{' '}
                de PluriOne.
              </p>
            </div>
          </div>

        </div>

        <p className="text-[11px] text-slate-600 text-center mt-3">
          Desarrollo Talento y Tecnología © 2026 · PluriOne S.A. de C.V.
        </p>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: DASHBOARD PRINCIPAL (SISTEMA AUTENTICADO)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans overflow-hidden">
      
      {/* 1. BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-[#0d1322] border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo Brand */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
            <div className="bg-blue-600 text-white font-black text-lg px-3 py-1 rounded-xl shadow-lg shadow-blue-600/30">
              P1
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
                Pluri Uno
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                Compliance Hub
              </span>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="p-4 space-y-1.5">
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
              Navegación
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:bg-[#131b2e] hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Perfil Abajo / Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0f1b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                {currentUser.nombre ? currentUser.nombre.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-semibold text-white truncate">{currentUser.nombre}</h4>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.rol}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER SUPERIOR */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar obligaciones, leyes, folios o personal..."
                className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-[#121929] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5 animate-pulse"></span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-colors">
              <Plus className="w-4 h-4" />
              <span>Nueva Obligación</span>
            </button>
          </div>
        </header>

        {/* CONTENIDO DE LA PESTAÑA SELECCIONADA */}
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* SI LA PESTAÑA ES INICIO */}
          {activeTab === 'inicio' && (
            <>
              {/* BANNER DE BIENVENIDA */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/20 via-[#0d1322] to-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    ¡Bienvenido de nuevo, {currentUser.nombre.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Aquí tienes el resumen operativo de hoy. Tienes <span className="text-rose-400 font-semibold">1 obligación vencida</span> que requiere atención inmediata.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="bg-[#121929] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filtrar Vista</span>
                  </button>
                </div>
              </div>

              {/* TARJETAS DE KPIS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Próximas y Pendientes</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">8</span>
                    <span className="text-xs text-slate-400">para este mes</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" /> +2 asignadas esta semana
                  </p>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Atención Requerida</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-rose-400">1</span>
                    <span className="text-xs text-slate-400">obligación vencida</span>
                  </div>
                  <p className="text-[11px] text-rose-400/80 mt-2">
                    Entrega CFDI Nómina (Retraso 2 días)
                  </p>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completadas con Éxito</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">24</span>
                    <span className="text-xs text-slate-400">con evidencia auditada</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-2">
                    96% de efectividad de cumplimiento
                  </p>
                </div>
              </div>

              {/* OBLIGACIONES RECIENTES */}
              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Obligaciones Prioritarias</h3>
                    <p className="text-xs text-slate-400">Seguimiento en tiempo real de requerimientos corporativos</p>
                  </div>
                  <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer">
                    <span>Ver todas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#121929] border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">Entrega de CFDI de nómina</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">SAT · LMISR · Asignado a: <span className="text-slate-300">Finanzas</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">
                        2 días de retraso
                      </span>
                      <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer">
                        Subir Evidencia
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#121929] border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">Dictamen de Seguridad e Higiene</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">STPS · NOM-030 · Asignado a: <span className="text-slate-300">Recursos Humanos</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        Vence en 5 días
                      </span>
                      <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer">
                        Revisar Status
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#121929] border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">Declaración mensual de impuestos</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">SAT · Código Fiscal · Asignado a: <span className="text-slate-300">Contabilidad</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        Completada
                      </span>
                      <button className="text-xs bg-slate-800/50 text-slate-500 px-3 py-1.5 rounded-lg font-medium cursor-not-allowed">
                        Ver Folio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PLACEHOLDER PARA LAS DEMÁS PESTAÑAS */}
          {activeTab !== 'inicio' && (
            <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white capitalize mb-1">Módulo: {activeTab}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Este módulo está listo para recibir componentes dinámicos y conectarse con la base de datos.
              </p>
              <button 
                onClick={() => setActiveTab('inicio')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Volver al Inicio
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}