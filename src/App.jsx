import React, { useState, useEffect, useRef } from 'react';
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
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  ExternalLink,
  Save,
  Key
} from 'lucide-react';

export default function App() {
  // ==========================================
  // ESTADO GLOBAL DE AUTENTICACIÓN Y SESIÓN
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario');

  const [currentUser, setCurrentUser] = useState({
    nombre: 'Miguel Romero Morales',
    rol: 'Administrador de Cumplimiento',
    departamento: 'Sistemas y TI',
    email: 'm.romero@plurione.com',
    telefono: '+52 55 1234 5678',
    notifEmail: true,
    notifUrgentes: true,
    notifResumenSemanal: false
  });

  // ==========================================
  // BUSCADOR GLOBAL EN VIVO
  // ==========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ==========================================
  // NOTIFICACIONES EN VIVO
  // ==========================================
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, titulo: 'CFDI de Nómina Vencido', tiempo: 'Hace 10 min', tipo: 'urgente' },
    { id: 2, titulo: 'Nueva evidencia cargada por Ana Gómez', tiempo: 'Hace 1 hora', tipo: 'exito' },
    { id: 3, titulo: 'Próximo vencimiento: NOM-030 STPS', tiempo: 'Hace 3 horas', tipo: 'alerta' }
  ]);

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
      ley: 'LISR Art. 99',
      departamento: 'Finanzas y Contabilidad',
      vencimiento: '2026-10-23',
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
      vencimiento: '2026-10-30',
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
      vencimiento: '2026-10-17',
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
      vencimiento: '2026-10-20',
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
      vencimiento: '2026-10-13',
      estado: 'completada',
      responsable: 'Miguel Romero',
      evidenciaSubida: true
    }
  ]);

  // ==========================================
  // OBLIGACIONES DEL USUARIO (Para que el calendario las lea sin broncas)
  // ==========================================
  const getObligacionesDelUsuario = () => {
    if (!currentUser) return [];
    if (currentUser.rol === 'Administrador' || currentUser.rol === 'Administrador de Cumplimiento') {
      return obligaciones || [];
    }
    return (obligaciones || []).filter(o => {
      if (!o || !o.responsable) return false;
      const respLower = o.responsable.trim().toLowerCase();
      const userLower = (currentUser.nombre || '').trim().toLowerCase();
      return respLower.includes(userLower) || userLower.includes(respLower) || o.departamento === currentUser.departamento;
    });
  };

  const obligacionesDelUsuario = getObligacionesDelUsuario();

  // ==========================================
  // NAVEGACIÓN Y LÓGICA REPARADA DEL CALENDARIO
  // ==========================================
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // 9 = Octubre
  const [selectedDate, setSelectedDate] = useState('2026-10-13');

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
      setSelectedDate(`${currentYear - 1}-12-01`);
    } else {
      const nextMonth = currentMonthIndex - 1;
      setCurrentMonthIndex(nextMonth);
      const mStr = (nextMonth + 1).toString().padStart(2, '0');
      setSelectedDate(`${currentYear}-${mStr}-01`);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
      setSelectedDate(`${currentYear + 1}-01-01`);
    } else {
      const nextMonth = currentMonthIndex + 1;
      setCurrentMonthIndex(nextMonth);
      const mStr = (nextMonth + 1).toString().padStart(2, '0');
      setSelectedDate(`${currentYear}-${mStr}-01`);
    }
  };

  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const startingOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const daysInMonthCount = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  const emptyDays = Array.from({ length: startingOffset }, (_, i) => i);

  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => {
    const dayNum = i + 1;
    const formattedMonth = (currentMonthIndex + 1).toString().padStart(2, '0');
    const formattedDay = dayNum.toString().padStart(2, '0');
    return `${currentYear}-${formattedMonth}-${formattedDay}`;
  });

  // Cambiar esta línea para que use las obligaciones filtradas del usuario:
  const tareasDelDiaSeleccionado = obligacionesDelUsuario.filter(o => o.vencimiento === selectedDate);

  const formatFechaVista = (fechaStr) => {
    if (!fechaStr) return '';
    const [y, m, d] = fechaStr.split('-');
    return `${d}/${m}/${y}`;
  };

  // ==========================================
  // ESTADO Y LÓGICA DE EVIDENCIAS / DOCS
  // ==========================================
  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      nombreArchivo: 'Acuse_Declaracion_Mensual_Oct2026.pdf',
      tipo: 'PDF',
      tamaño: '2.4 MB',
      obligacionAsociada: 'Declaración mensual de impuestos',
      entidad: 'SAT',
      subidoPor: 'Miguel Romero',
      fechaCarga: '2026-10-17'
    },
    {
      id: 2,
      nombreArchivo: 'Dictamen_NOM030_Revision_Anual.pdf',
      tipo: 'PDF',
      tamaño: '5.1 MB',
      obligacionAsociada: 'Dictamen de Seguridad e Higiene',
      entidad: 'STPS',
      subidoPor: 'Ana Laura Gómez',
      fechaCarga: '2026-10-12'
    },
    {
      id: 3,
      nombreArchivo: 'CFDI_Nomina_Quincenal_Oct.xml',
      tipo: 'XML',
      tamaño: '840 KB',
      obligacionAsociada: 'Entrega de CFDI de nómina',
      entidad: 'SAT',
      subidoPor: 'Carlos Mendoza',
      fechaCarga: '2026-10-10'
    }
  ]);

  const [filterTipoDoc, setFilterTipoDoc] = useState('Todos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const fileInputRef = useRef(null);

  const [newDoc, setNewDoc] = useState({
    obligacionAsociada: 'Declaración mensual de impuestos'
  });

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const extension = selectedFile.name.split('.').pop().toUpperCase();
    const obligacionEncontrada = obligaciones.find(o => o.titulo === newDoc.obligacionAsociada);

    const nuevoDocumento = {
      id: Date.now(),
      nombreArchivo: selectedFile.name,
      tipo: extension || 'DOCUMENTO',
      tamaño: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      obligacionAsociada: newDoc.obligacionAsociada,
      entidad: obligacionEncontrada ? obligacionEncontrada.entidad : 'SAT',
      subidoPor: currentUser.nombre,
      fechaCarga: new Date().toISOString().split('T')[0]
    };

    setDocumentos([nuevoDocumento, ...documentos]);
    
    if (obligacionEncontrada) {
      setObligaciones(prev => prev.map(o => {
        if (o.id === obligacionEncontrada.id) {
          return { ...o, estado: 'completada', evidenciaSubida: true };
        }
        return o;
      }));
    }

    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const downloadDummyFile = (doc) => {
    const content = `PLURIONE LEGALTECH & COMPLIANCE\n======================================\nEVIDENCIA DE AUDITORÍA REGISTRADA\n======================================\nNombre del Archivo: ${doc.nombreArchivo}\nObligación: ${doc.obligacionAsociada}\nEntidad Regulatoria: ${doc.entidad}\nSubido Por: ${doc.subidoPor}\nFecha de Carga: ${doc.fechaCarga}\nEstado de Validación: VERIFICADO Y CIFRADO\n======================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombreArchivo.replace(/\.[^/.]+$/, "") + "_evidencia.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const documentosFiltrados = documentos.filter(doc => {
    if (filterTipoDoc === 'Todos') return true;
    return doc.tipo === filterTipoDoc;
  });

  // ==========================================
  // ESTADO Y LÓGICA DE PERSONAL
  // ==========================================
  // Cargar usuarios reales desde el Backend SQLite en tiempo real (Vista Admin)
  const [personal, setPersonal] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:5000/api/users')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const personalFormateado = data.map(u => ({
              id: u.id,
              nombre: u.nombre,
              email: u.email,
              departamento: u.departamento || 'Sistemas y TI',
              rol: u.rol || 'Empleado',
              completadas: u.rol === 'Administrador' ? 2 : 0,
              totales: u.rol === 'Administrador' ? 2 : 1,
              estado: u.rol === 'Administrador' ? 'Excelente' : 'En Proceso'
            }));
            setPersonal(personalFormateado);
          }
        })
        .catch(err => console.error('Error al cargar personal:', err));
    }
  }, [isAuthenticated]);

  const [filterDepto, setFilterDepto] = useState('Todos');
  const personalFiltrado = personal.filter(p => {
    if (filterDepto === 'Todos') return true;
    return p.departamento === filterDepto;
  });

  // ==========================================
  // LÓGICA CONTROL DE OBLIGACIONES
  // ==========================================
  const [filterStatus, setFilterStatus] = useState('todas');
  const [showNewModal, setShowNewModal] = useState(false);

  const obligacionesFiltradas = obligacionesDelUsuario.filter(item => {
    if (filterStatus === 'todas') return true;
    return item.estado === filterStatus;
  });

  const totalVencidas = obligacionesDelUsuario.filter(o => o.estado === 'vencida').length;
  const totalProximas = obligacionesDelUsuario.filter(o => o.estado === 'proxima').length;
  const totalCompletadas = obligacionesDelUsuario.filter(o => o.estado === 'completada').length;
  
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

  const searchResultsObligaciones = searchQuery ? obligaciones.filter(o => o.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || o.ley.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  const searchResultsDocs = searchQuery ? documentos.filter(d => d.nombreArchivo.toLowerCase().includes(searchQuery.toLowerCase())) : [];

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

  useEffect(() => {
    if (isAuthenticated || obligaciones.length === 0) return;
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % obligaciones.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [obligaciones.length, isAuthenticated]);

  const currentCard = obligaciones[activeCardIndex % obligaciones.length] || obligaciones[0];

  // ==========================================
  // FUNCIÓN ÚNICA Y REAL DE AUTENTICACIÓN
  // ==========================================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // Validar nombre si está intentando registrarse
    if (!isLogin && !loginFormData.nombre.trim()) {
      alert('Por favor ingresa tu nombre completo para registrarte.');
      return;
    }

    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    
    const bodyData = isLogin 
      ? { email: loginFormData.email, password: loginFormData.password }
      : { 
          nombre: loginFormData.nombre, 
          email: loginFormData.email, 
          password: loginFormData.password, 
          departamento: loginFormData.departamento 
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Ocurrió un error en la autenticación.');
        return;
      }

      // Guardar token JWT en localStorage
      localStorage.setItem('token', data.token);
      
      // Cargar datos reales del usuario devueltos por SQLite
      setCurrentUser({
        nombre: data.user.nombre,
        rol: data.user.rol || 'Administrador de Cumplimiento',
        departamento: data.user.departamento || 'Sistemas y TI',
        email: data.user.email,
        telefono: '+52 55 1234 5678',
        notifEmail: true,
        notifUrgentes: true,
        notifResumenSemanal: false
      });

      // Entrar al panel de la plataforma
      setIsAuthenticated(true);

    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor backend (http://localhost:5000). Revisa que esté encendido.');
    }
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
                <span className="text-blue-400 font-bold">
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

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">{currentCard?.titulo}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{currentCard?.entidad} · {currentCard?.ley}</p>
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
                <p className="text-[10px] text-slate-400 truncate">{currentUser.rol}</p>
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
        
        {/* HEADER CON BÚSQUEDA GLOBAL Y CAMPANITA */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar archivos, licencias, declaraciones o acuses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="w-full bg-[#121929] border border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* BÚSQUEDA EN VIVO - DROPDOWN */}
            {showSearchResults && searchQuery && (
              <div className="absolute top-12 left-0 right-0 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 pb-1">
                  <span>Resultados de búsqueda</span>
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setShowSearchResults(false)} />
                </div>

                {searchResultsObligaciones.length === 0 && searchResultsDocs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No se encontraron coincidencias.</p>
                ) : (
                  <>
                    {searchResultsObligaciones.map(o => (
                      <div key={o.id} onClick={() => { setActiveTab('obligaciones'); setShowSearchResults(false); }} className="p-2 hover:bg-[#121929] rounded-lg cursor-pointer text-xs">
                        <span className="font-bold text-white block">{o.titulo}</span>
                        <span className="text-[10px] text-slate-400">{o.ley} · {o.entidad}</span>
                      </div>
                    ))}
                    {searchResultsDocs.map(d => (
                      <div key={d.id} onClick={() => { setActiveTab('documentos'); setShowSearchResults(false); }} className="p-2 hover:bg-[#121929] rounded-lg cursor-pointer text-xs">
                        <span className="font-bold text-blue-400 block">{d.nombreArchivo}</span>
                        <span className="text-[10px] text-slate-400">{d.obligacionAsociada}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-[#121929] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {totalVencidas > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-blue-400" />
                      Notificaciones en Vivo
                    </h4>
                    <span className="text-[10px] text-blue-400 font-semibold cursor-pointer" onClick={() => setNotificaciones([])}>
                      Limpiar
                    </span>
                  </div>

                  <div className="space-y-2">
                    {notificaciones.length === 0 ? (
                      <p className="text-[11px] text-slate-500 text-center py-4">No hay notificaciones sin leer.</p>
                    ) : (
                      notificaciones.map(n => (
                        <div key={n.id} className="p-2.5 bg-[#121929] border border-slate-800/80 rounded-xl flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-slate-200 leading-snug">{n.titulo}</p>
                            <span className="text-[9px] text-slate-500">{n.tiempo}</span>
                          </div>
                          {n.tipo === 'urgente' && <span className="w-2 h-2 rounded-full bg-rose-500 mt-1"></span>}
                          {n.tipo === 'exito' && <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1"></span>}
                          {n.tipo === 'alerta' && <span className="w-2 h-2 rounded-full bg-amber-400 mt-1"></span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {activeTab === 'documentos' ? (
  <button 
    onClick={() => setShowUploadModal(true)}
    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-colors"
  >
    <Upload className="w-4 h-4" />
    <span>Cargar Evidencia</span>
  </button>
) : (
  currentUser.rol === 'Administrador' && (
    <button 
      onClick={() => setShowNewModal(true)}
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span>Nueva Obligación</span>
    </button>
  )
)}
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* PESTAÑA INICIO */}
          {activeTab === 'inicio' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/20 via-[#0d1322] to-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1">
                    ¡Bienvenido de nuevo, {currentUser.nombre.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-xs text-slate-400">
                    Resumen general: Tienes <span className="text-rose-400 font-semibold">{totalVencidas} obligación(es) vencida(s)</span> y <span className="text-amber-400 font-semibold">{totalProximas} pendiente(s)</span>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Próximas y Pendientes</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{totalProximas}</span>
                    <span className="text-xs text-slate-400">en seguimiento</span>
                  </div>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Atención Requerida</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-rose-400">{totalVencidas}</span>
                    <span className="text-xs text-slate-400">vencida(s)</span>
                  </div>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completadas</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{totalCompletadas}</span>
                    <span className="text-xs text-slate-400">con evidencia auditada</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: CALENDARIO REPARADO DE RAÍZ */}
          {activeTab === 'calendario' && (
            <div key={`${currentYear}-${currentMonthIndex}`} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                    Calendario de Vencimientos Regulatorios
                  </h1>
                  <p className="text-xs text-slate-400">Seguimiento visual e interactivo de plazos por día.</p>
                </div>

                <div className="flex items-center gap-3 bg-[#121929] px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-white">
                  <button 
                    type="button"
                    onClick={handlePrevMonth} 
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-extrabold min-w-[130px] text-center select-none text-blue-400 text-sm">
                    {nombresMeses[currentMonthIndex]} {currentYear}
                  </span>

                  <button 
                    type="button"
                    onClick={handleNextMonth} 
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2">
                    <div>LUN</div><div>MAR</div><div>MIÉ</div><div>JUE</div><div>VIE</div><div>SÁB</div><div>DOM</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {emptyDays.map(emptyIndex => (
                      <div key={`empty-${emptyIndex}`} className="min-h-[75px] bg-[#0b101d]/40 rounded-xl border border-slate-900/50"></div>
                    ))}

                    {daysInMonth.map((dateStr) => {
                      const dayNum = parseInt(dateStr.split('-')[2], 10);
                      const tareas = obligacionesDelUsuario.filter(o => o.vencimiento === dateStr)
                      const isSelected = selectedDate === dateStr;

                      const tieneVencida = tareas.some(t => t.estado === 'vencida');
                      const tieneProxima = tareas.some(t => t.estado === 'proxima');
                      const tieneCompletada = tareas.some(t => t.estado === 'completada');

                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`min-h-[75px] p-2 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500' 
                              : 'bg-[#121929] border-slate-800/80 hover:border-slate-700 hover:bg-[#151d30]'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>{dayNum}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tieneVencida && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Vencida"></span>}
                            {tieneProxima && <span className="w-2 h-2 rounded-full bg-amber-400" title="Pendiente"></span>}
                            {tieneCompletada && <span className="w-2 h-2 rounded-full bg-emerald-400" title="Auditada"></span>}
                          </div>
                          {tareas.length > 0 && (
                            <span className="text-[9px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded truncate mt-1">
                              {tareas.length} evento(s)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="border-b border-slate-800/80 pb-4 mb-4">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Actividades Programadas</span>
                      <h3 className="text-base font-bold text-white mt-0.5">{formatFechaVista(selectedDate)}</h3>
                    </div>

                    <div className="space-y-3">
                      {tareasDelDiaSeleccionado.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs">
                          <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                          No hay obligaciones registradas para este día.
                        </div>
                      ) : (
                        tareasDelDiaSeleccionado.map((item) => (
                          <div key={item.id} className="bg-[#121929] border border-slate-800 p-3.5 rounded-xl space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-white leading-snug">{item.titulo}</h4>
                              {item.estado === 'vencida' && <span className="px-2 py-0.5 text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full shrink-0">Vencida</span>}
                              {item.estado === 'proxima' && <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">Pendiente</span>}
                              {item.estado === 'completada' && <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">Auditada</span>}
                            </div>
                            <p className="text-[10px] text-slate-400">{item.entidad} · {item.ley}</p>
                            
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                              <span>Resp: <span className="text-slate-300">{item.responsable}</span></span>
                              <button 
                                onClick={() => handleToggleEstado(item.id)}
                                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                              >
                                {item.estado === 'completada' ? 'Revisar' : 'Marcar Auditada'}
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
            </div>
          )}

          {/* PESTAÑA: PERSONAL */}
          {activeTab === 'empleados' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Gestión de Personal y Cumplimiento Individual
                  </h1>
                  <p className="text-xs text-slate-400">Directorio de colaboradores y métricas de desempeño legal.</p>
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
                        <th className="p-4">Área / Rol</th>
                        <th className="p-4">Desempeño de Cumplimiento</th>
                        <th className="p-4">Estatus</th>
                        <th className="p-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {personalFiltrado.map((item) => {
                        const porcentaje = Math.round((item.completadas / item.totales) * 100);
                        return (
                          <tr key={item.id} className="hover:bg-[#131b2e]/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                                  {item.nombre.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs sm:text-sm">{item.nombre}</div>
                                  <div className="text-[10px] text-slate-400">{item.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="text-slate-200 font-medium">{item.departamento}</div>
                              <div className="text-[10px] text-slate-500">{item.rol}</div>
                            </td>

                            <td className="p-4 w-48">
                              <div className="flex justify-between items-center text-[10px] mb-1">
                                <span className="text-slate-400">{item.completadas} de {item.totales} auditadas</span>
                                <span className="font-bold text-white">{porcentaje}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    porcentaje === 100 ? 'bg-emerald-400' : 'bg-amber-400'
                                  }`} 
                                  style={{ width: `${porcentaje}%` }}
                                ></div>
                              </div>
                            </td>

                            <td className="p-4">
                              {item.estado === 'Excelente' && (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-semibold">
                                  Excelente
                                </span>
                              )}
                              {item.estado === 'Atención Req.' && (
                                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-semibold">
                                  Atención Req.
                                </span>
                              )}
                              {item.estado === 'En Proceso' && (
                                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-semibold">
                                  En Proceso
                                </span>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              {currentUser.rol === 'Administrador' && (
              <button 
                onClick={() => setShowNewModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Obligación</span>
              </button>
            )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PESTAÑA: OBLIGACIONES */}
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
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">{item.titulo}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">{item.ley}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-semibold text-slate-300 text-[10px]">
                              {item.entidad}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="text-slate-200 font-medium">{item.departamento}</div>
                            <div className="text-[10px] text-slate-500">{item.responsable}</div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {item.vencimiento}
                            </div>
                          </td>

                          <td className="p-4">
                            {item.estado === 'vencida' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20">
                                <AlertCircle className="w-3 h-3" /> Vencida
                              </span>
                            )}
                            {item.estado === 'proxima' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20">
                                <Clock className="w-3 h-3" /> Pendiente
                              </span>
                            )}
                            {item.estado === 'completada' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Auditada
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleToggleEstado(item.id)}
                              className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto ${
                                item.estado === 'completada' 
                                  ? 'bg-slate-800 text-slate-400 hover:text-white' 
                                  : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{item.estado === 'completada' ? 'Revisar' : 'Marcar Auditada'}</span>
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

          {/* PESTAÑA: EVIDENCIAS Y DOCS */}
          {activeTab === 'documentos' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <FolderCheck className="w-5 h-5 text-blue-400" />
                    Expediente Digital y Evidencias de Auditoría
                  </h1>
                  <p className="text-xs text-slate-400">
                    Repositorio seguro de acuses, comprobantes y licencias legales.
                  </p>
                </div>

                <div className="flex bg-[#121929] p-1 rounded-xl border border-slate-800 self-start md:self-auto">
                  {['Todos', 'PDF', 'XML', 'DOCX'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setFilterTipoDoc(tipo)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        filterTipoDoc === tipo ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Documentos Subidos</span>
                    <File className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-3xl font-extrabold text-white">{documentos.length}</span>
                  <p className="text-[10px] text-slate-500 mt-1">Expedientes digitales activos</p>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Obligaciones Auditadas</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-extrabold text-emerald-400">{totalCompletadas}</span>
                  <p className="text-[10px] text-slate-500 mt-1">Con respaldo completo</p>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sin Evidencia Adjunta</span>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-3xl font-extrabold text-amber-400">
                    {obligaciones.filter(o => !o.evidenciaSubida).length}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Requieren carga urgente</p>
                </div>
              </div>

              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#121929] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        <th className="p-4">Documento / Archivo</th>
                        <th className="p-4">Obligación Vinculada</th>
                        <th className="p-4">Entidad</th>
                        <th className="p-4">Subido por</th>
                        <th className="p-4">Fecha Carga</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {documentosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-500">
                            No hay archivos cargados en este formato.
                          </td>
                        </tr>
                      ) : (
                        documentosFiltrados.map((doc) => (
                          <tr key={doc.id} className="hover:bg-[#131b2e]/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0 font-bold text-[10px]">
                                  {doc.tipo}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs sm:text-sm">{doc.nombreArchivo}</div>
                                  <div className="text-[10px] text-slate-500">{doc.tamaño}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="text-slate-200 font-medium">{doc.obligacionAsociada}</div>
                            </td>

                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-semibold text-slate-300 text-[10px]">
                                {doc.entidad}
                              </span>
                            </td>

                            <td className="p-4 text-slate-300">{doc.subidoPor}</td>

                            <td className="p-4 text-slate-400 font-mono">{doc.fechaCarga}</td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => downloadDummyFile(doc)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                  title="Descargar archivo de comprobación"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setPreviewDoc(doc)}
                                  className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg transition-colors cursor-pointer"
                                  title="Ver Vista Previa Lector"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PESTAÑA: MI CUENTA */}
          {activeTab === 'cuenta' && (
            <div className="space-y-6">
              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-bold">
                    MR
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{currentUser.nombre}</h2>
                    <p className="text-xs text-slate-400">{currentUser.rol} · {currentUser.departamento}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-semibold mt-1">
                      Microsoft Entra ID Conectado
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Información Personal y Contacto
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Nombre Completo</label>
                      <input type="text" value={currentUser.nombre} onChange={(e) => setCurrentUser({ ...currentUser, nombre: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Correo Institucional</label>
                      <input type="email" value={currentUser.email} disabled className="w-full bg-slate-900/50 border border-slate-800 text-slate-500 rounded-xl px-3.5 py-2 cursor-not-allowed" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Teléfono Directo</label>
                      <input type="text" value={currentUser.telefono} onChange={(e) => setCurrentUser({ ...currentUser, telefono: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-2 text-xs transition-colors cursor-pointer">
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Configuración y Notificaciones
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-[#121929] border border-slate-800 rounded-xl">
                      <div>
                        <p className="font-semibold text-white">Alertas por Correo</p>
                        <p className="text-[10px] text-slate-400">Recibe aviso cuando venza una obligación.</p>
                      </div>
                      <input type="checkbox" checked={currentUser.notifEmail} onChange={(e) => setCurrentUser({ ...currentUser, notifEmail: e.target.checked })} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#121929] border border-slate-800 rounded-xl">
                      <div>
                        <p className="font-semibold text-white">Notificaciones Urgentes</p>
                        <p className="text-[10px] text-slate-400">Alertas emergentes para items críticos.</p>
                      </div>
                      <input type="checkbox" checked={currentUser.notifUrgentes} onChange={(e) => setCurrentUser({ ...currentUser, notifUrgentes: e.target.checked })} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                    </div>

                    <div className="p-3 bg-[#121929] border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-semibold text-white">Seguridad de la Cuenta</p>
                          <p className="text-[10px] text-slate-400">Autenticación Multifactor (2FA) Activa</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold text-[10px]">PROTEGIDO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: VISTA PREVIA DE DOCUMENTO */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setPreviewDoc(null)} 
              className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-xs">
                {previewDoc.tipo}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{previewDoc.nombreArchivo}</h3>
                <p className="text-[10px] text-slate-400">{previewDoc.obligacionAsociada} · {previewDoc.entidad}</p>
              </div>
            </div>

            <div className="bg-[#121929] border border-slate-800 rounded-xl p-6 space-y-4 font-mono text-xs text-slate-300">
              <div className="flex justify-between text-[10px] text-slate-500 border-b border-slate-800/80 pb-2">
                <span>PluriOne Compliance Vault v2.4</span>
                <span>AUDIT_STAMP_VALIDATED</span>
              </div>
              <p className="text-slate-400">Cargado por: <span className="text-white font-bold">{previewDoc.subidoPor}</span> el {previewDoc.fechaCarga}</p>
              <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] space-y-2">
                <p className="text-emerald-400 font-bold">✓ DOCUMENTO VERIFICADO CON CIFRADO</p>
                <p>Este archivo sirve como constancia oficial de cumplimiento ante {previewDoc.entidad} para fines de auditoría interna y legal.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => downloadDummyFile(previewDoc)} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <Download className="w-4 h-4" />
                Descargar Evidencia (.txt)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CARGAR EVIDENCIA REAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowUploadModal(false)} className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                Cargar Evidencia de Auditoría
              </h3>
              <p className="text-xs text-slate-400">Adjunta el archivo real que respalda el cumplimiento.</p>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Obligación Asociada</label>
                <select 
                  value={newDoc.obligacionAsociada}
                  onChange={(e) => setNewDoc({ ...newDoc, obligacionAsociada: e.target.value })}
                  className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {obligaciones.map((o) => (
                    <option key={o.id} value={o.titulo}>{o.titulo} ({o.entidad})</option>
                  ))}
                </select>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept=".pdf,.xml,.docx,.zip"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center bg-[#121929]/50 cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-xs text-emerald-400 font-bold">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-300 font-semibold">Haz clic aquí para seleccionar un archivo</p>
                    <p className="text-[10px] text-slate-500 mt-1">Soporta PDF, XML, DOCX o ZIP</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">Cancelar</button>
                <button 
                  type="submit" 
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-colors ${
                    selectedFile 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-blue-600/25' 
                      : 'bg-[#121929] text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  Cargar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA OBLIGACIÓN */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowNewModal(false)} className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Plus className="w-5 h-5 text-blue-400" />Registrar Nueva Obligación Legal</h3>
            </div>
            <form onSubmit={handleAddObligacion} className="space-y-4">
              <input type="text" required placeholder="Ej. Reporte Mensual de Finanzas" value={newObligacion.titulo} onChange={(e) => setNewObligacion({ ...newObligacion, titulo: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white" />
              <input type="date" required value={newObligacion.vencimiento} onChange={(e) => setNewObligacion({ ...newObligacion, vencimiento: e.target.value })} className="w-full bg-[#121929] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white" />
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs">Guardar Obligación</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}