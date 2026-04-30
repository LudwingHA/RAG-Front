import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Layout } from '../../layout/Layout';
import {
  FaMapMarkerAlt,
  FaImage,
  FaList,
  FaChartBar,
  FaDownload,
  FaTrash,
  FaUpload,
  FaSearch,
  FaFilter,
  FaEye,
  FaMap,
  FaTable,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrafficLight
} from 'react-icons/fa';

// Importar Leaflet para el mapa
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración de iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente de Tarjeta Estadística
const StatCard = ({ icon: Icon, iconColor, iconBg, title, value, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`${iconColor} text-xl`} />
      </div>
      <span className="text-2xl font-bold text-[#212529]">{value}</span>
    </div>
    <p className="text-sm text-[#6C757D]">{title}</p>
    {children}
  </div>
);

// Componente de Tarjeta de Riesgo (Semáforo)
const RiskCard = ({ nivelRiesgo, totalBaches }) => (
  <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
      <FaTrafficLight className="text-8xl" style={{ color: nivelRiesgo.color }} />
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${nivelRiesgo.color}20` }}>
        <span className="text-2xl">{nivelRiesgo.icono}</span>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold" style={{ color: nivelRiesgo.color }}>{nivelRiesgo.texto}</span>
      </div>
    </div>
    <p className="text-sm text-[#6C757D]">Nivel de Riesgo</p>
    <p className="text-xs text-[#6C757D] mt-1">{nivelRiesgo.descripcion}</p>
    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500" 
        style={{ width: `${Math.min((totalBaches || 0) / 100 * 100, 100)}%`, backgroundColor: nivelRiesgo.color }} 
      />
    </div>
  </div>
);

// Componente de Filtros
const Filters = ({ viewMode, setViewMode, searchTerm, setSearchTerm, filterType, setFilterType, tiposUnicos, onExport }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-8">
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-2">
        {[
          { mode: 'map', icon: FaMap, label: 'Mapa' },
          { mode: 'table', icon: FaTable, label: 'Tabla' },
          { mode: 'gallery', icon: FaImage, label: 'Galería' }
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              viewMode === mode 
                ? 'bg-[var(--color-primary-chat)] text-white' 
                : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'
            }`}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D]" />
          <input 
            type="text" 
            placeholder="Buscar por ID o tipo..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-[#E9ECEF] rounded-lg focus:ring-2 focus:ring-[#C49A6C]" 
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)} 
          className="px-4 py-2 border border-[#E9ECEF] rounded-lg focus:ring-2 focus:ring-[#C49A6C]"
        >
          <option value="todos">Todos los tipos</option>
          {tiposUnicos.map(tipo => (
            <option key={tipo} value={tipo}>{tipo.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <button 
          onClick={onExport} 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
        >
          <FaDownload /> Exportar
        </button>
      </div>
    </div>
  </div>
);

// Componente de Tabla de Detecciones
const DeteccionesTable = ({ detecciones, onImageClick, onOpenMaps, getConfianzaColor }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#F8F9FA] border-b border-[#E9ECEF]">
          <tr>
            {['ID', 'Imagen', 'Tipo', 'Confianza', 'Coordenadas', 'Acciones'].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {detecciones.map((deteccion) => (
            <tr key={deteccion.id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA]">
              <td className="px-6 py-4 text-sm text-[#212529] font-medium">{deteccion.id}</td>
              <td className="px-6 py-4">
                {deteccion.ruta_imagen ? (
                  <img 
                    src={`http://localhost:8000/${deteccion.ruta_imagen}`} 
                    alt={`Bache ${deteccion.id}`} 
                    className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => onImageClick(deteccion)}
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#F8F9FA] rounded-lg flex items-center justify-center text-[#6C757D]">
                    <FaImage />
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {deteccion.clase.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getConfianzaColor(deteccion.confianza)}`} />
                  <span className="text-sm text-[#212529]">{(deteccion.confianza * 100).toFixed(1)}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#6C757D]">
                {deteccion.latitud.toFixed(5)}<br/>{deteccion.longitud.toFixed(5)}
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => onOpenMaps(deteccion.google_maps)} 
                  className="text-[var(--color-primary-chat)] hover:text-[var(--color-secondary-chat)] transition-colors"
                >
                  <FaMap className="text-xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Componente de Galería
const DeteccionesGallery = ({ detecciones, onImageClick, onOpenMaps }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {detecciones.filter(d => d.ruta_imagen).map((deteccion) => (
      <div key={deteccion.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
        <img 
          src={`http://localhost:8000/${deteccion.ruta_imagen}`} 
          alt={`Bache ${deteccion.id}`} 
          className="w-full h-48 object-cover cursor-pointer" 
          onClick={() => onImageClick(deteccion)}
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[#212529]">Incidencia #{deteccion.id}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {deteccion.clase.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6C757D]">Confianza: {(deteccion.confianza * 100).toFixed(1)}%</span>
            <button 
              onClick={() => onOpenMaps(deteccion.google_maps)} 
              className="text-[var(--color-primary-chat)] hover:text-[var(--color-secondary-chat)]"
            >
              Ver en mapa →
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Componente Modal de Detalle (usando Portal)
const DetalleModal = ({ deteccion, onClose }) => {
  if (!deteccion) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10001]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-[#212529]">
              Detalle del incidencia #{deteccion.id}
            </h3>
            <button 
              onClick={onClose} 
              className="text-[#6C757D] hover:text-[#212529] text-2xl"
            >
              &times;
            </button>
          </div>
          
          {deteccion.ruta_imagen && (
            <img 
              src={`http://localhost:8000/${deteccion.ruta_imagen}`} 
              alt="Bache" 
              className="w-full rounded-lg mb-4" 
            />
          )}
          
          <div className="space-y-3">
            <DetailRow label="Tipo" value={deteccion.clase.replace(/_/g, ' ')} />
            <DetailRow label="Confianza" value={`${(deteccion.confianza * 100).toFixed(1)}%`} />
            <DetailRow label="Latitud" value={deteccion.latitud} />
            <DetailRow label="Longitud" value={deteccion.longitud} />
            <DetailRow 
              label="Segundo" 
              value={`${deteccion.segundo}s (${deteccion.tiempo_formato})`} 
            />
            
            <button 
              onClick={() => window.open(deteccion.google_maps, '_blank')} 
              className="w-full mt-4 px-4 py-2 bg-[var(--color-primary-chat)] text-white rounded-lg hover:bg-[var(--color-secondary-chat)] transition-all"
            >
              Abrir en Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Componente auxiliar para filas detalle
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-[#E9ECEF]">
    <span className="font-semibold text-[#212529]">{label}:</span>
    <span className="text-[#6C757D]">{value}</span>
  </div>
);

// Componente principal
export const BachesPage = () => {
  // Estados
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState('');
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [viewMode, setViewMode] = useState('table');
  const [selectedDeteccion, setSelectedDeteccion] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mapCenter, setMapCenter] = useState([19.4326, -99.1332]);
  const [mapZoom, setMapZoom] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Refs
  const mapRef = useRef(null);
  
  // Constantes
  const API_URL = 'http://localhost:8000/api/baches';

  // Mapa de colores para los tipos de baches
  const markerColors = {
    bache: '#ff0000',
    bache_profundo: '#910000',
    grieta_longitudinal: '#ffc400',
    grieta_longitudinal_ancha: '#ff6a00',
    grieta_piel_cocodrilo: '#4ECDC4',
    grieta_piel_cocodrilo_hundida: '#a2ffa2'
  };

  // Efectos
  useEffect(() => {
    cargarCarpetas();
    agregarEstilosMapa();
    
    return () => {
      removerEstilosMapa();
    };
  }, []);

  // Efecto para manejar la interacción del mapa cuando el modal está abierto
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      
      if (isModalOpen) {
        // Deshabilitar interacciones del mapa
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        // Deshabilitar eventos del mapa
        if (map._handlers) {
          map._handlers.forEach(handler => {
            if (handler.disable) handler.disable();
          });
        }
      } else {
        // Rehabilitar interacciones del mapa
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        // Rehabilitar eventos del mapa
        if (map._handlers) {
          map._handlers.forEach(handler => {
            if (handler.enable) handler.enable();
          });
        }
      }
    }
    
    // Manejar scroll del body
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Funciones de estilos
  const agregarEstilosMapa = () => {
    const style = document.createElement('style');
    style.id = 'leaflet-modal-styles';
    style.textContent = `
      .leaflet-pane, 
      .leaflet-top, 
      .leaflet-bottom, 
      .leaflet-control {
        z-index: 1 !important;
      }
      
      .modal-open .leaflet-pane,
      .modal-open .leaflet-top,
      .modal-open .leaflet-bottom,
      .modal-open .leaflet-control {
        z-index: 0 !important;
      }
    `;
    document.head.appendChild(style);
  };

  const removerEstilosMapa = () => {
    const style = document.getElementById('leaflet-modal-styles');
    if (style) style.remove();
  };

  // Funciones de API
  const cargarCarpetas = async () => {
    try {
      const response = await fetch(`${API_URL}/carpetas`);
      const data = await response.json();
      setCarpetas(data);
    } catch (err) {
      setError('Error al cargar carpetas');
      console.error(err);
    }
  };

  const cargarDetecciones = async (folder, file) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/detecciones?folder=${folder}&file=${file}`);
      const data = await response.json();
      setDatos(data);
      setCarpetaSeleccionada(folder);
      
      // Centrar mapa en el primer bache
      if (data.detecciones?.length > 0) {
        const avgLat = data.detecciones.reduce((sum, d) => sum + d.latitud, 0) / data.detecciones.length;
        const avgLng = data.detecciones.reduce((sum, d) => sum + d.longitud, 0) / data.detecciones.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(14);
      }
    } catch (err) {
      setError('Error al cargar las detecciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubirArchivos = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    setUploading(true);
    try {
      const response = await fetch(`${API_URL}/subir`, { method: 'POST', body: formData });
      const data = await response.json();
      await cargarCarpetas();
      alert(`Archivos subidos exitosamente a la carpeta: ${data.folder}`);
    } catch (err) {
      alert('Error al subir archivos');
    } finally {
      setUploading(false);
    }
  };

  const eliminarCarpeta = async (folderName) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la carpeta ${folderName}?`)) return;
    try {
      await fetch(`${API_URL}/carpeta/${folderName}`, { method: 'DELETE' });
      await cargarCarpetas();
      if (carpetaSeleccionada === folderName) {
        setDatos(null);
        setCarpetaSeleccionada('');
      }
    } catch (err) {
      alert('Error al eliminar carpeta');
    }
  };

  // Funciones de utilidad
  const getDeteccionesFiltradas = () => {
    if (!datos?.detecciones) return [];
    return datos.detecciones.filter(d => {
      const matchesSearch = searchTerm === '' || 
        d.id.toString().includes(searchTerm) ||
        d.clase.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'todos' || d.clase === filterType;
      return matchesSearch && matchesType;
    });
  };

  const getTiposUnicos = () => {
    if (!datos?.detecciones) return [];
    return [...new Set(datos.detecciones.map(d => d.clase))];
  };

  const getNivelRiesgo = () => {
    const totalBaches = datos?.detecciones?.length || 0;
    if (totalBaches === 0) return { nivel: 'sin_datos', color: '#6C757D', texto: 'Sin Datos', icono: '⚪', descripcion: 'Sin datos disponibles' };
    if (totalBaches < 10) return { nivel: 'bajo', color: '#28A745', texto: 'Bajo', icono: '🟢', descripcion: 'Densidad baja de baches' };
    if (totalBaches < 30) return { nivel: 'medio', color: '#FFC107', texto: 'Medio', icono: '🟡', descripcion: 'Densidad media de baches' };
    if (totalBaches < 60) return { nivel: 'alto', color: '#FD7E14', texto: 'Alto', icono: '🟠', descripcion: 'Densidad alta de baches' };
    return { nivel: 'critico', color: '#DC3545', texto: 'Crítico', icono: '🔴', descripcion: 'Densidad crítica de baches' };
  };

  const getMarkerColor = (tipo) => {
    return markerColors[tipo.toLowerCase().trim()] || '#95E77D';
  };

  const getConfianzaColor = (confianza) => {
    if (confianza >= 0.7) return 'bg-green-500';
    if (confianza >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const exportarCSV = () => {
    const detecciones = getDeteccionesFiltradas();
    const headers = ['ID', 'Tipo', 'Confianza', 'Latitud', 'Longitud', 'Segundo', 'Google Maps'];
    const rows = detecciones.map(d => [d.id, d.clase, d.confianza, d.latitud, d.longitud, d.segundo, d.google_maps]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baches_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Funciones de UI
  const openModal = (deteccion) => {
    setSelectedDeteccion(deteccion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDeteccion(null);
    setIsModalOpen(false);
  };

  const handleMapReady = (map) => {
    mapRef.current = map;
  };

  // Renderizado del mapa
  const renderMap = () => (
    <div className="h-[500px] rounded-lg overflow-hidden border border-[#E9ECEF]">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ 
          height: '100%', 
          width: '100%',
          pointerEvents: isModalOpen ? 'none' : 'auto'
        }}
        whenCreated={handleMapReady}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        {getDeteccionesFiltradas().map((deteccion) => (
          <CircleMarker
            key={deteccion.id}
            center={[deteccion.latitud, deteccion.longitud]}
            radius={8}
            color={getMarkerColor(deteccion.clase)}
            fillColor={getMarkerColor(deteccion.clase)}
            fillOpacity={0.7}
            weight={2}
          >
            <Tooltip permanent={false}>
              <div className="p-2">
                <strong>Incidencia #{deteccion.id}</strong><br />
                Tipo: {deteccion.clase.replace(/_/g, ' ')}<br />
                Confianza: {(deteccion.confianza * 100).toFixed(1)}%<br />
                <button 
                  onClick={() => openModal(deteccion)}
                  className="mt-1 text-xs text-blue-500 hover:text-blue-700"
                >
                  Ver detalles →
                </button>
              </div>
            </Tooltip>
            <Popup>
              <div className="min-w-[200px]">
                {deteccion.ruta_imagen && (
                  <img 
                    src={`http://localhost:8000/${deteccion.ruta_imagen}`} 
                    alt="Bache" 
                    className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer"
                    onClick={() => openModal(deteccion)}
                  />
                )}
                <p><strong>ID:</strong> {deteccion.id}</p>
                <p><strong>Tipo:</strong> {deteccion.clase.replace(/_/g, ' ')}</p>
                <p><strong>Confianza:</strong> {(deteccion.confianza * 100).toFixed(1)}%</p>
                <p><strong>Coordenadas:</strong><br/>{deteccion.latitud.toFixed(5)}<br/>{deteccion.longitud.toFixed(5)}</p>
                <button
                  onClick={() => window.open(deteccion.google_maps, '_blank')}
                  className="mt-2 w-full px-3 py-1 bg-[var(--color-primary-chat)] text-white rounded-lg text-sm hover:bg-[var(--color-secondary-chat)] transition-all"
                >
                  Abrir en Google Maps
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );

  // Renderizado de estadísticas
  const renderStats = () => {
    const detecciones = datos?.detecciones || [];
    const totalIncidencias = datos?.total_baches_unicos || detecciones.length;
    const tiposUnicos = getTiposUnicos().length;
    const imagenesCapturadas = detecciones.filter(d => d.captura).length;
    const nivelRiesgo = getNivelRiesgo();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard icon={FaMapMarkerAlt} iconColor="text-blue-600" iconBg="bg-blue-100" title="Total de incidencias" value={totalIncidencias} />
        <StatCard icon={FaChartBar} iconColor="text-green-600" iconBg="bg-green-100" title="Tipos de Baches" value={tiposUnicos} />
        <StatCard icon={FaImage} iconColor="text-purple-600" iconBg="bg-purple-100" title="Imágenes Capturadas" value={imagenesCapturadas} />
        <StatCard icon={FaCheckCircle} iconColor="text-orange-600" iconBg="bg-orange-100" title="Fecha Procesamiento" value={datos?.fecha_procesamiento || 'N/A'} />
        <RiskCard nivelRiesgo={nivelRiesgo} totalBaches={totalIncidencias} />
      </div>
    );
  };

  // Renderizado de leyenda del mapa
  const renderMapLegend = () => (
    <div className="flex gap-2 mt-2">
      {Object.entries(markerColors).map(([tipo, color]) => (
        <div key={tipo} className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{tipo.replace(/_/g, ' ')}</span>
        </div>
      ))}
    </div>
  );

  // Renderizado del selector de carpetas
  const renderFolderSelector = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <label className="block text-sm font-semibold text-[#212529] mb-2">Seleccionar Resultado</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          onChange={(e) => {
            const [folder, file] = e.target.value.split('|');
            if (folder && file) cargarDetecciones(folder, file);
          }}
          className="px-4 py-2 border border-[#E9ECEF] rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent"
        >
          <option value="">Selecciona una carpeta...</option>
          {carpetas.map(carpeta => (
            <optgroup key={carpeta.name} label={`${carpeta.name} (${carpeta.date})`}>
              {carpeta.json_files.map(file => (
                <option key={file} value={`${carpeta.path}|${file}`}>📄 {file}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {carpetaSeleccionada && (
          <button 
            onClick={() => eliminarCarpeta(carpetaSeleccionada)} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          >
            <FaTrash /> Eliminar Carpeta
          </button>
        )}
      </div>
    </div>
  );

  // Renderizado principal del contenido
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl text-[#C49A6C]" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
          <FaExclamationTriangle className="inline mr-2" /> {error}
        </div>
      );
    }

    if (!datos) {
      return null;
    }

    const deteccionesFiltradas = getDeteccionesFiltradas();
    const tiposUnicos = getTiposUnicos();

    return (
      <>
        {renderStats()}

        {/* Sección del Mapa */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FaMap className="text-xl text-[#C49A6C]" />
              <h2 className="text-xl font-bold text-[#212529]">Mapa de Detecciones</h2>
            </div>
            {renderMapLegend()}
          </div>
          {renderMap()}
        </div>

        {/* Filtros */}
        <Filters 
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          tiposUnicos={tiposUnicos}
          onExport={exportarCSV}
        />

        {/* Vistas */}
        {viewMode === 'table' && (
          <DeteccionesTable 
            detecciones={deteccionesFiltradas}
            onImageClick={openModal}
            onOpenMaps={(url) => window.open(url, '_blank')}
            getConfianzaColor={getConfianzaColor}
          />
        )}

        {viewMode === 'gallery' && (
          <DeteccionesGallery 
            detecciones={deteccionesFiltradas}
            onImageClick={openModal}
            onOpenMaps={(url) => window.open(url, '_blank')}
          />
        )}
      </>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-3xl" />
                  <h1 className="text-3xl font-bold">Detección de Baches</h1>
                </div>
                <p className="text-white/90">Sistema de monitoreo y visualización de baches detectados</p>
              </div>
              <label className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl cursor-pointer transition-all flex items-center gap-2">
                <FaUpload />
                {uploading ? 'Subiendo...' : 'Subir Resultados'}
                <input 
                  type="file" 
                  multiple 
                  accept=".json,.jpg,.png" 
                  onChange={handleSubirArchivos} 
                  className="hidden" 
                  disabled={uploading} 
                />
              </label>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderFolderSelector()}
          {renderContent()}
        </div>
      </div>

      {/* Modal usando Portal */}
      <DetalleModal deteccion={selectedDeteccion} onClose={closeModal} />
    </Layout>
  );
};