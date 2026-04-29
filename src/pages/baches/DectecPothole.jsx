import React, { useState, useEffect, useRef } from 'react';
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

// Solucionar problema de iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const BachesPage = () => {
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
  const [mapCenter, setMapCenter] = useState([19.4326, -99.1332]); // Centro CDMX
  const [mapZoom, setMapZoom] = useState(12);

  const API_URL = 'http://localhost:8000/api/baches';

  useEffect(() => {
    cargarCarpetas();
  }, []);

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
      
      // Centrar mapa en el primer bache si hay datos
      if (data.detecciones && data.detecciones.length > 0) {
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

  // Calcular densidad y nivel de riesgo
  const getNivelRiesgo = () => {
    const totalBaches = datos?.detecciones?.length || 0;
    if (totalBaches === 0) return { nivel: 'sin_datos', color: '#6C757D', texto: 'Sin Datos', icono: '⚪' };
    if (totalBaches < 10) return { nivel: 'bajo', color: '#28A745', texto: 'Bajo', icono: '🟢', descripcion: 'Densidad baja de baches' };
    if (totalBaches < 30) return { nivel: 'medio', color: '#FFC107', texto: 'Medio', icono: '🟡', descripcion: 'Densidad media de baches' };
    if (totalBaches < 60) return { nivel: 'alto', color: '#FD7E14', texto: 'Alto', icono: '🟠', descripcion: 'Densidad alta de baches' };
    return { nivel: 'critico', color: '#DC3545', texto: 'Crítico', icono: '🔴', descripcion: 'Densidad crítica de baches' };
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

  const getConfianzaColor = (confianza) => {
    if (confianza >= 0.7) return 'bg-green-500';
    if (confianza >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Obtener color del marcador según el tipo de bache

  // const getMarkerColor = (tipo) => {
  //     console.log(tipo)
  //   if (tipo.includes('grieta')) return '#FF6B6B';
  //   if (tipo.includes('grieta_piel_cocodrilo')) return '#4ECDC4';
  //   if (tipo.includes('bache')) return '#FFE66D';
  //   return '#95E77D';
  // };
  const getMarkerColor = (tipo) => {
  const t = tipo.toLowerCase().trim();

  const colores = {
    bache: '#ff0000',
    bache_profundo: '#910000',
    grieta_longitudinal: '#ffc400',
    grieta_longitudinal_ancha: '#ff6a00',
    grieta_piel_cocodrilo: '#4ECDC4',
    grieta_piel_cocodrilo_hundida: '#a2ffa2'

  };

  return colores[t] || '#95E77D';
};

  const nivelRiesgo = getNivelRiesgo();

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
                <input type="file" multiple accept=".json,.jpg,.png" onChange={handleSubirArchivos} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Selector de Carpetas */}
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
                <button onClick={() => eliminarCarpeta(carpetaSeleccionada)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                  <FaTrash /> Eliminar Carpeta
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-[#C49A6C]" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
              <FaExclamationTriangle className="inline mr-2" /> {error}
            </div>
          )}

          {datos && !loading && (
            <>
              {/* Stats Cards con Semáforo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FaMapMarkerAlt className="text-blue-600 text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-[#212529]">{datos.total_baches_unicos || datos.detecciones?.length || 0}</span>
                  </div>
                  <p className="text-sm text-[#6C757D]">Total de incidencias</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <FaChartBar className="text-green-600 text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-[#212529]">{getTiposUnicos().length}</span>
                  </div>
                  <p className="text-sm text-[#6C757D]">Tipos de Baches</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FaImage className="text-purple-600 text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-[#212529]">{datos.detecciones?.filter(d => d.captura).length || 0}</span>
                  </div>
                  <p className="text-sm text-[#6C757D]">Imágenes Capturadas</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <FaCheckCircle className="text-orange-600 text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-[#212529]">{datos.fecha_procesamiento || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-[#6C757D]">Fecha Procesamiento</p>
                </div>

                {/* Tarjeta de Semáforo */}
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
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((datos.detecciones?.length || 0) / 100 * 100, 100)}%`, backgroundColor: nivelRiesgo.color }} />
                  </div>
                </div>
              </div>

              {/* Mapa */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaMap className="text-xl text-[#C49A6C]" />
                    <h2 className="text-xl font-bold text-[#212529]">Mapa de Detecciones</h2>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-[#ff0000]"></div>
                      <span>Bache</span>
                    </div>
                     <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-[#910000]"></div>
                      <span>Bache Profundo</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-[#ffc400]"></div>
                      <span>Grieta longitudinal</span>
                    </div>
                      <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-[#ff6a00]"></div>
                      <span>Grieta longitudinal ancha</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-[#4ECDC4]"></div>
                      <span>Grieta piel cocodrilo</span>
                    </div>
                     <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full bg-[#a2ffa2]"></div>
                      <span>Grieta piel cocodrilo hundida</span>
                    </div>
                  </div>
                </div>
                <div className="h-[500px] rounded-lg overflow-hidden border border-[#E9ECEF]">
                  <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
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
                              onClick={() => setSelectedDeteccion(deteccion)}
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
                                onClick={() => setSelectedDeteccion(deteccion)}
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
              </div>

              {/* Filtros y Vistas */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-[var(--color-primary-chat)] text-white' : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'}`}>
                      <FaMap /> Mapa
                    </button>
                    <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'table' ? 'bg-[var(--color-primary-chat)] text-white' : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'}`}>
                      <FaTable /> Tabla
                    </button>
                    <button onClick={() => setViewMode('gallery')} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'gallery' ? 'bg-[var(--color-primary-chat)] text-white' : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'}`}>
                      <FaImage /> Galería
                    </button>
                  </div>

                  <div className="flex gap-4 flex-1 max-w-md">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D]" />
                      <input type="text" placeholder="Buscar por ID o tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#E9ECEF] rounded-lg focus:ring-2 focus:ring-[#C49A6C]" />
                    </div>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border border-[#E9ECEF] rounded-lg focus:ring-2 focus:ring-[#C49A6C]">
                      <option value="todos">Todos los tipos</option>
                      {getTiposUnicos().map(tipo => (<option key={tipo} value={tipo}>{tipo.replace(/_/g, ' ')}</option>))}
                    </select>
                    <button onClick={exportarCSV} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2">
                      <FaDownload /> Exportar
                    </button>
                  </div>
                </div>
              </div>

              {/* Vista de Mapa ya está arriba, aquí van Tabla y Galería */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* ... tu tabla existente ... */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F8F9FA] border-b border-[#E9ECEF]">
                        <tr><th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">Imagen</th><th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">Tipo</th><th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">Confianza</th><th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">Coordenadas</th><th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase">Acciones</th></tr>
                      </thead>
                      <tbody>
                        {getDeteccionesFiltradas().map((deteccion) => (
                          <tr key={deteccion.id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA]">
                            <td className="px-6 py-4 text-sm text-[#212529] font-medium">{deteccion.id}</td>
                            <td className="px-6 py-4">
                              {deteccion.ruta_imagen ? (<img src={`http://localhost:8000/${deteccion.ruta_imagen}`} alt={`Bache ${deteccion.id}`} className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedDeteccion(deteccion)} />) : (<div className="w-16 h-16 bg-[#F8F9FA] rounded-lg flex items-center justify-center text-[#6C757D]"><FaImage /></div>)}
                            </td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{deteccion.clase.replace(/_/g, ' ')}</span></td>
                            <td className="px-6 py-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${getConfianzaColor(deteccion.confianza)}`}></div><span className="text-sm text-[#212529]">{(deteccion.confianza * 100).toFixed(1)}%</span></div></td>
                            <td className="px-6 py-4 text-sm text-[#6C757D]">{deteccion.latitud.toFixed(5)}<br/>{deteccion.longitud.toFixed(5)}</td>
                            <td className="px-6 py-4"><button onClick={() => window.open(deteccion.google_maps, '_blank')} className="text-[var(--color-primary-chat)] hover:text-[var(--color-secondary-chat)] transition-colors"><FaMap className="text-xl" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {viewMode === 'gallery' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getDeteccionesFiltradas().filter(d => d.ruta_imagen).map((deteccion) => (
                    <div key={deteccion.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                      <img src={`http://localhost:8000/${deteccion.ruta_imagen}`} alt={`Bache ${deteccion.id}`} className="w-full h-48 object-cover cursor-pointer" onClick={() => setSelectedDeteccion(deteccion)} />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2"><span className="font-semibold text-[#212529]">Incidencia #{deteccion.id}</span><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{deteccion.clase.replace(/_/g, ' ')}</span></div>
                        <div className="flex items-center justify-between text-sm"><span className="text-[#6C757D]">Confianza: {(deteccion.confianza * 100).toFixed(1)}%</span><button onClick={() => window.open(deteccion.google_maps, '_blank')} className="text-[var(--color-primary-chat)] hover:text-[var(--color-secondary-chat)]">Ver en mapa →</button></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedDeteccion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDeteccion(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-[#212529]">Detalle del incidencia #{selectedDeteccion.id}</h3><button onClick={() => setSelectedDeteccion(null)} className="text-[#6C757D] hover:text-[#212529] text-2xl">&times;</button></div>
              {selectedDeteccion.ruta_imagen && (<img src={`http://localhost:8000/${selectedDeteccion.ruta_imagen}`} alt="Bache" className="w-full rounded-lg mb-4" />)}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[#E9ECEF]"><span className="font-semibold text-[#212529]">Tipo:</span><span className="text-[#6C757D]">{selectedDeteccion.clase.replace(/_/g, ' ')}</span></div>
                <div className="flex justify-between py-2 border-b border-[#E9ECEF]"><span className="font-semibold text-[#212529]">Confianza:</span><span className="text-[#6C757D]">{(selectedDeteccion.confianza * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between py-2 border-b border-[#E9ECEF]"><span className="font-semibold text-[#212529]">Latitud:</span><span className="text-[#6C757D]">{selectedDeteccion.latitud}</span></div>
                <div className="flex justify-between py-2 border-b border-[#E9ECEF]"><span className="font-semibold text-[#212529]">Longitud:</span><span className="text-[#6C757D]">{selectedDeteccion.longitud}</span></div>
                <div className="flex justify-between py-2 border-b border-[#E9ECEF]"><span className="font-semibold text-[#212529]">Segundo:</span><span className="text-[#6C757D]">{selectedDeteccion.segundo}s ({selectedDeteccion.tiempo_formato})</span></div>
                <button onClick={() => window.open(selectedDeteccion.google_maps, '_blank')} className="w-full mt-4 px-4 py-2 bg-[var(--color-primary-chat)] text-white rounded-lg hover:bg-[var(--color-secondary-chat)] transition-all">Abrir en Google Maps</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};