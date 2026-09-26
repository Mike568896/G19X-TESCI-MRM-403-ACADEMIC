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
  FileText,
  Upload,
  X,
  UserPlus,
  Shield,
  MoreVertical,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // ==========================================
  // ESTADO GLOBAL DE AUTENTICACIÓN Y SESIÓN
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario'); // Enfoque en Calendario para pruebas

  const [currentUser] = useState({
    nombre: 'Miguel Romero',
    rol: 'Administrador de Cumplimiento',
    departamento: 'Sistemas y TI',
    email: 'm.romero@plurione.com'
  });

  // ==========================================
  // HELPER: EVALUAR SI UNA FECHA YA VENCIÓ
  // ==========================================
  const isDatePast = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dateString.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    return inputDate < today;
  };

  // ==========================================
  // ESTADO CENTRALIZADO DE OBLIGACIONES
  // ==========================================
  const [obligaciones, setObligaciones] = useState([
    {
      id: 1,
      titulo: 'Entrega de CFDI de nómina',
      entidad: 'SAT',
      ley: 'LMISR Art. 99',
      departamento: 'Finanzas y Contabilidad',
      vencimiento: '2026-09-23',
      estado: 'vencida',
      responsable: 'Carlos Mendoza',
      evidenciaSubida: false
    },
    {
      id: 2,
      titulo: 'Dictamen de Seguridad e Higiene',
      entidad: 'STPS',
      ley: 'NOM-030-STPS-2009',
      departamento: 'Recursos Humanos',
      vencimiento: '2026-09-30',
      estado: 'proxima',
      responsable: 'Ana Laura Gómez',
      evidenciaSubida: false
    },
    {
      id: 3,
      titulo: 'Declaración mensual de impuestos',
      entidad: 'SAT',
      ley: 'Código Fiscal de la Federación',
      departamento: 'Finanzas y Contabilidad',
      vencimiento: '2026-09-17',
      estado: 'completada',
      responsable: 'Miguel Romero',
      evidenciaSubida: true
    },
    {
      id: 4,
      titulo: 'Actualización de Aviso de Privacidad',
      entidad: 'INAI',
      ley: 'LFPDPPP Art. 15',
      departamento: 'Asuntos legales y cumplimiento normativo',
      vencimiento: '2026-10-15',
      estado: 'proxima',
      responsable: 'Diana Romero',
      evidenciaSubida: false
    },
    {
      id: 5,
      titulo: 'Reporte de Mantenimiento TI',
      entidad: 'Interna',
      ley: 'ISO 27001 A.12',
      departamento: 'Sistemas y TI',
      vencimiento: '2026-09-20',
      estado: 'completada',
      responsable: 'Miguel Romero',
      evidenciaSubida: true
    }
  ]);

  const totalVencidas = obligaciones.filter(o => o.estado === 'vencida').length;
  const totalProximas = obligaciones.filter(o => o.estado === 'proxima').length;
  const totalCompletadas = obligaciones.filter(o => o.estado === 'completada').length;

  // ==========================================
  // ESTADO Y LÓGICA DEL CALENDARIO
  // ==========================================
  const [selectedDate, setSelectedDate] = useState('2026-09-23');

  // Días del mes de Septiembre 2026
  const currentMonthYear = 'Septiembre 2026';
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    return `2026-09-${formattedDay}`;
  });

  // Tareas para el día seleccionado en el calendario
  const tareasDelDiaSeleccionado = obligaciones.filter(o => o.vencimiento === selectedDate);

  // ==========================================
  // ESTADO Y LÓGICA DE PERSONAL
  // ==========================================
  const [personal, setPersonal] = useState([
    {
      id: 1,
      nombre: 'Miguel Romero',
      email: 'm.romero@plurione.com',
      departamento: 'Sistemas y TI',
      rol: 'Administrador',
      estado: 'Activo',
      obligacionesAsignadas: 2
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza',
      email: 'c.mendoza@plurione.com',
      departamento: 'Finanzas y Contabilidad',
      rol: 'Auditor Compliance',
      estado: 'Activo',
      obligacionesAsignadas: 1
    },
    {
      id: 3,
      nombre: 'Ana Laura Gómez',
      email: 'a.gomez@plurione.com',
      departamento: 'Recursos Humanos',
      rol: 'Responsable de Área',
      estado: 'Activo',
      obligacionesAsignadas: 1
    },
    {
      id: 4,
      nombre: 'Diana Romero',
      email: 'd.romero@plurione.com',
      departamento: 'Asuntos legales y cumplimiento normativo',
      rol: 'Oficial de Cumplimiento',
      estado: 'Activo',
      obligacionesAsignadas: 1
    }
  ]);

  const [filterDepto, setFilterDepto] = useState('Todos');
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    departamento: 'Asuntos legales y cumplimiento normativo',
    rol: 'Responsable de Área'
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.email) return;

    const nuevoColaborador = {
      id: Date.now(),
      ...newUser,
      estado: 'Activo',
      obligacionesAsignadas: 0
    };

    setPersonal([nuevoColaborador, ...personal]);
    setNewUser({
      nombre: '',
      email: '',
      departamento: 'Asuntos legales y cumplimiento normativo',
      rol: 'Responsable de Área'
    });
    setShowNewUserModal(false);
  };

  const personalFiltrado = personal.filter(p => {
    if (filterDepto === 'Todos') return true;
    return p.departamento === filterDepto;
  });

  // ==========================================
  // LÓGICA CONTROL DE OBLIGACIONES
  // ==========================================
  const [filterStatus, setFilterStatus] = useState('todas');
  const [showNewModal, setShowNewModal] = useState(false);

  const [newObligacion, setNewObligacion] = useState({
    titulo: '',
    entidad: 'SAT',
    ley: '',
    departamento: 'Asuntos legales y cumplimiento normativo',
    vencimiento: '',
    responsable: ''
  });

  const handleAddObligacion = (e) => {
    e.preventDefault();
    if (!newObligacion.titulo || !newObligacion.vencimiento) return;

    const yaVencio = isDatePast(newObligacion.vencimiento);

    const nuevaObj = {
      id: Date.now(),
      ...newObligacion,
      estado: yaVencio ? 'vencida' : 'proxima',
      evidenciaSubida: false
    };

    setObligaciones(prev => [nuevaObj, ...prev]);
    setNewObligacion({
      titulo: '',
      entidad: 'SAT',
      ley: '',
      departamento: 'Asuntos legales y cumplimiento normativo',
      vencimiento: '',
      responsable: ''
    });
    setShowNewModal(false);
  };

  const handleToggleEstado = (id) => {
    setObligaciones(prevObligaciones => 
      prevObligaciones.map(item => {
        if (item.id === id) {
          if (item.estado === 'completada') {
            const debioVencer = isDatePast(item.vencimiento);
            const estadoRestaurado = debioVencer ? 'vencida' : 'proxima';
            return { ...item, estado: estadoRestaurado, evidenciaSubida: false };
          } else {
            return { ...item, estado: 'completada', evidenciaSubida: true };
          }
        }
        return item;
      })
    );
  };

  const obligacionesFiltradas = obligaciones.filter(item => {
    if (filterStatus === 'todas') return true;
    return item.estado === filterStatus;
  });

  // ==========================================
  // ESTADOS LOGIN / REGISTRO
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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({ ...prev, [name]: value }));
  };

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isAuthenticated || obligaciones.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCardIndex((prev) => (prev + 1) % obligaciones.length);
        setIsTransitioning(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [obligaciones.length, isAuthenticated]);

  const currentCard = obligaciones[activeCardIndex % obligaciones.length] || obligaciones[0];

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio / Resumen', icon: LayoutDashboard },
    { id: 'obligaciones', label: 'Obligaciones', icon: CheckSquare, badge: totalVencidas > 0 ? totalVencidas.toString() : null },
    { id: 'empleados', label: 'Personal / Equipo', icon: Users },
    { id: 'calendario', label: 'Calendario', icon: CalendarIcon },
    { id: 'documentos', label: 'Evidencias y Docs', icon: FolderCheck },
    { id: 'cuenta', label: 'Mi Cuenta', icon: User },
  ];

  // ==========================================
  // VISTA 1: LOGIN / REGISTRO
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="w-full max-w-6xl bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 my-auto overflow-hidden">
          
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
                    Monitoreo en Vivo ({obligaciones.length} Registradas)
                  </span>
                  <span className="text-slate-500 text-[11px]">Sincronizado</span>
                </div>

                <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">{currentCard?.titulo}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5" notranslate="true">{currentCard?.entidad} · {currentCard?.ley}</p>
                    </div>
                    {currentCard?.estado === 'vencida' && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-1 shrink-0">
                        <AlertCircle className="w-3 h-3" /> Vencida
                      </span>
                    )}
                    {currentCard?.estado === 'completada' && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Auditada
                      </span>
                    )}
                    {currentCard?.estado === 'proxima' && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-800/60 justify-center">
                  {obligaciones.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === (activeCardIndex % obligaciones.length) ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Cifrado de extremo a extremo</span>
                <span>•</span>
                <span className="flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-slate-400" /> Evidencia auditada</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 lg:p-10 flex flex-col justify-center bg-[#0b101d]">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-white mb-1">{isLogin ? 'Bienvenido de nuevo' : 'Crear una cuenta'}</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isLogin 
                    ? 'Ingresa con tu correo institucional para acceder al panel de cumplimiento.' 
                    : 'Regístrate para solicitar acceso a la plataforma corporativa.'}
                </p>
              </div>

              <div className="flex bg-[#121929] p-1 rounded-xl mb-5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    !isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
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
                        placeholder="Ej. Miguel Romero"
                        value={loginFormData.nombre}
                        onChange={handleLoginChange}
                        className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

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
                      placeholder="usuario@plurione.com"
                      value={loginFormData.email}
                      onChange={handleLoginChange}
                      className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

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
                      placeholder="••••••••"
                      value={loginFormData.password}
                      onChange={handleLoginChange}
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
                          placeholder="Ej. PLURI-8930"
                          value={loginFormData.codigoInvitacion}
                          onChange={handleLoginChange}
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
                  <span>{isLogin ? 'Ingresar a la Plataforma' : 'Solicitar Registro'}</span>
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
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0d1322] border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
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

        <div className="p-4 border-t border-slate-800/80 bg-[#0a0f1b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                MR
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

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar en el sistema de cumplimiento..."
                className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-[#121929] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              {totalVencidas > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-pulse"></span>
              )}
            </button>

            <button 
              onClick={() => setShowNewModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Obligación</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* PESTAÑA: CALENDARIO */}
          {activeTab === 'calendario' && (
            <>
              {/* Header del Módulo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                    Calendario de Vencimientos Regulatorios
                  </h1>
                  <p className="text-xs text-slate-400">
                    Seguimiento visual e interactivo de plazos por día.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[#121929] px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-white">
                  <ChevronLeft className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                  <span>{currentMonthYear}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                </div>
              </div>

              {/* GRID PRINCIPAL: CALENDARIO + DETALLE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CALENDARIO (8 COLUMNAS) */}
                <div className="lg:col-span-8 bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl">
                  
                  {/* Días de la Semana */}
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">
                    <div>Lun</div>
                    <div>Mar</div>
                    <div>Mié</div>
                    <div>Jue</div>
                    <div>Vie</div>
                    <div>Sáb</div>
                    <div>Dom</div>
                  </div>

                  {/* Matriz de Días */}
                  <div className="grid grid-cols-7 gap-2">
                    {daysInMonth.map((dateStr, index) => {
                      const dayNum = index + 1;
                      const tareas = obligaciones.filter(o => o.vencimiento === dateStr);
                      const isSelected = selectedDate === dateStr;

                      // Indicadores
                      const tieneVencida = tareas.some(t => t.estado === 'vencida');
                      const tieneProxima = tareas.some(t => t.estado === 'proxima');
                      const tieneCompletada = tareas.some(t => t.estado === 'completada');

                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`min-h-[75px] p-2 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10' 
                              : 'bg-[#121929] border-slate-800/80 hover:border-slate-700 hover:bg-[#151d30]'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                            {dayNum}
                          </span>

                          {/* Puntos / Indicadores de Pendientes */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tieneVencida && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Obligación Vencida"></span>
                            )}
                            {tieneProxima && (
                              <span className="w-2 h-2 rounded-full bg-amber-400" title="Obligación Próxima"></span>
                            )}
                            {tieneCompletada && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Obligación Completada"></span>
                            )}
                          </div>

                          {/* Texto / Badge si hay tareas */}
                          {tareas.length > 0 && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded truncate mt-1">
                              {tareas.length} evento(s)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Leyenda de colores */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-4 mt-4 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Vencida
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pendiente / Próxima
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Auditada
                    </span>
                  </div>

                </div>

                {/* DETALLE DEL DÍA SELECCIONADO (4 COLUMNAS) */}
                <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="border-b border-slate-800/80 pb-4 mb-4">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Actividades Programadas</span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {selectedDate}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {tareasDelDiaSeleccionado.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs">
                          <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                          No hay obligaciones registradas con fecha límite para este día.
                        </div>
                      ) : (
                        tareasDelDiaSeleccionado.map((item) => (
                          <div 
                            key={item.id} 
                            className="bg-[#121929] border border-slate-800 p-3.5 rounded-xl space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-white leading-snug">{item.titulo}</h4>
                              {item.estado === 'vencida' && (
                                <span className="px-2 py-0.5 text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full shrink-0">
                                  Vencida
                                </span>
                              )}
                              {item.estado === 'proxima' && (
                                <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">
                                  Pendiente
                                </span>
                              )}
                              {item.estado === 'completada' && (
                                <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
                                  Auditada
                                </span>
                              )}
                            </div>

                            <p className="text-[10px] text-slate-400" notranslate="true">
                              {item.entidad} · {item.ley}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                              <span>Resp: <span className="text-slate-300">{item.responsable}</span></span>
                              <button 
                                onClick={() => handleToggleEstado(item.id)}
                                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                              >
                                {item.estado === 'completada' ? 'Revisar' : 'Completar'}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setNewObligacion(prev => ({ ...prev, vencimiento: selectedDate }));
                      setShowNewModal(true);
                    }}
                    className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Asignar Tarea a este Día</span>
                  </button>
                </div>

              </div>
            </>
          )}

          {/* PESTAÑA PERSONAL */}
          {activeTab === 'empleados' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Gestión de Personal y Control de Accesos
                  </h1>
                  <p className="text-xs text-slate-400">
                    Directorio del equipo y permisos de auditoría.
                  </p>
                </div>

                <div className="flex bg-[#121929] p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
                  {['Todos', 'Sistemas y TI', 'Finanzas y Contabilidad', 'Recursos Humanos', 'Asuntos legales y cumplimiento normativo'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setFilterDepto(dept)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        filterDepto === dept ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {dept === 'Asuntos legales y cumplimiento normativo' ? 'Legal' : dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#121929] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        <th className="p-4">Colaborador</th>
                        <th className="p-4">Departamento / Área</th>
                        <th className="p-4">Rol en Plataforma</th>
                        <th className="p-4">Carga de Trabajo</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {personalFiltrado.map((item) => (
                        <tr key={item.id} className="hover:bg-[#131b2e]/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                                {item.nombre.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">{item.nombre}</div>
                                <div className="text-[11px] text-slate-400">{item.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-slate-300 font-medium">{item.departamento}</td>

                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-semibold">
                              <Shield className="w-3 h-3 text-blue-400" />
                              {item.rol}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-slate-300 font-mono font-semibold">
                              {item.obligacionesAsignadas} asignación(es)
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              {item.estado}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-auto">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PESTAÑA OBLIGACIONES */}
          {activeTab === 'obligaciones' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-400" />
                    Gestión de Obligaciones Legales-Regulatorias
                  </h1>
                  <p className="text-xs text-slate-400">Control centralizado de requerimientos corporativos.</p>
                </div>

                <div className="flex bg-[#121929] p-1 rounded-xl border border-slate-800 self-start md:self-auto">
                  <button onClick={() => setFilterStatus('todas')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'todas' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Todas ( {obligaciones.length} )</button>
                  <button onClick={() => setFilterStatus('vencida')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'vencida' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-rose-400'}`}>Vencidas ( {totalVencidas} )</button>
                  <button onClick={() => setFilterStatus('proxima')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'proxima' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'}`}>Próximas ( {totalProximas} )</button>
                  <button onClick={() => setFilterStatus('completada')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'completada' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'}`}>Completadas ( {totalCompletadas} )</button>
                </div>
              </div>

              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#121929] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        <th className="p-4">Obligación / Marco Legal</th>
                        <th className="p-4">Entidad</th>
                        <th className="p-4">Área / Responsable</th>
                        <th className="p-4">Fecha Vencimiento</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {obligacionesFiltradas.map((item) => (
                        <tr key={item.id} className="hover:bg-[#131b2e]/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white text-xs sm:text-sm">{item.titulo}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><FileText className="w-3 h-3 text-slate-500" />{item.ley}</div>
                          </td>
                          <td className="p-4"><span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-semibold text-slate-300 text-[10px]" notranslate="true">{item.entidad}</span></td>
                          <td className="p-4"><div className="text-slate-200 font-medium">{item.departamento}</div><div className="text-[10px] text-slate-500">{item.responsable}</div></td>
                          <td className="p-4"><div className="flex items-center gap-1.5 text-slate-300 font-mono"><Clock className="w-3.5 h-3.5 text-slate-500" />{item.vencimiento}</div></td>
                          <td className="p-4">
                            {item.estado === 'vencida' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20"><AlertCircle className="w-3 h-3" /> Vencida</span>}
                            {item.estado === 'proxima' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"><Clock className="w-3 h-3" /> Pendiente</span>}
                            {item.estado === 'completada' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Auditada</span>}
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleToggleEstado(item.id)} className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto ${item.estado === 'completada' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'}`}>
                              <Upload className="w-3.5 h-3.5" /><span>{item.estado === 'completada' ? 'Revisar' : 'Marcar Auditada'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PESTAÑA INICIO */}
          {activeTab === 'inicio' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/20 via-[#0d1322] to-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1">¡Bienvenido de nuevo, {currentUser.nombre.split(' ')[0]}! 👋</h1>
                  <p className="text-xs text-slate-400">Resumen general: Tienes <span className="text-rose-400 font-semibold">{totalVencidas} obligación(es) vencida(s)</span> y <span className="text-amber-400 font-semibold">{totalProximas} pendiente(s)</span>.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5"><span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Próximas y Pendientes</span><span className="text-3xl font-extrabold text-white">{totalProximas}</span></div>
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5"><span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Atención Requerida</span><span className="text-3xl font-extrabold text-rose-400">{totalVencidas}</span></div>
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5"><span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Completadas</span><span className="text-3xl font-extrabold text-white">{totalCompletadas}</span></div>
              </div>
            </div>
          )}

          {/* OTROS MÓDULOS EN CONSTRUCCIÓN */}
          {activeTab !== 'inicio' && activeTab !== 'obligaciones' && activeTab !== 'empleados' && activeTab !== 'calendario' && (
            <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-12 text-center">
              <h3 className="text-lg font-bold text-white capitalize mb-1">Módulo: {activeTab}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">Módulo listo para el siguiente paso.</p>
              <button onClick={() => setActiveTab('obligaciones')} className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">Ir a Obligaciones</button>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: NUEVA OBLIGACIÓN */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowNewModal(false)} className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Registrar Nueva Obligación Legal
              </h3>
              <p className="text-xs text-slate-400">Ingresa los datos requeridos para iniciar el monitoreo.</p>
            </div>

            <form onSubmit={handleAddObligacion} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título de la Obligación</label>
                <input type="text" required placeholder="Ej. Reporte Mensual de Finanzas" value={newObligacion.titulo} onChange={(e) => setNewObligacion({ ...newObligacion, titulo: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Entidad Regulatoria</label>
                  <select value={newObligacion.entidad} onChange={(e) => setNewObligacion({ ...newObligacion, entidad: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="SAT">SAT</option>
                    <option value="STPS">STPS</option>
                    <option value="INAI">INAI</option>
                    <option value="PROFECO">PROFECO</option>
                    <option value="Interna">Auditoría Interna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha Vencimiento</label>
                  <input type="date" required value={newObligacion.vencimiento} onChange={(e) => setNewObligacion({ ...newObligacion, vencimiento: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fundamento Legal / Ley</label>
                <input type="text" placeholder="Ej. Ley del ISR Art. 76" value={newObligacion.ley} onChange={(e) => setNewObligacion({ ...newObligacion, ley: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Responsable Asignado</label>
                <input type="text" placeholder="Ej. Miguel Romero" value={newObligacion.responsable} onChange={(e) => setNewObligacion({ ...newObligacion, responsable: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-600/25 cursor-pointer">Guardar Obligación</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}