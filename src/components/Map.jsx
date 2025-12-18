import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Blue marker icon for Metro Manila
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red marker icon for Provincial
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fallback locations (used if API fails)
const fallbackMetroManila = [
  { name: 'Manila', lat: 14.5995, lng: 120.9842 },
  { name: 'Caloocan', lat: 14.6507, lng: 120.9661 },
  { name: 'Malabon', lat: 14.6686, lng: 120.9656 },
  { name: 'Marikina', lat: 14.6507, lng: 121.1029 },
  { name: 'Makati', lat: 14.5547, lng: 121.0244 },
  { name: 'Mandaluyong', lat: 14.5794, lng: 121.0359 },
  { name: 'Pasig', lat: 14.5764, lng: 121.0851 },
  { name: 'Taguig', lat: 14.5247, lng: 121.0794 },
  { name: 'Parañaque', lat: 14.4793, lng: 121.0198 },
  { name: 'Pasay', lat: 14.5377, lng: 121.0014 },
  { name: 'Quezon City', lat: 14.6760, lng: 121.0437 },
  { name: 'Muntinlupa', lat: 14.4081, lng: 121.0415 },
];

const fallbackProvincial = [
  { name: 'Laoag', lat: 18.1978, lng: 120.5952 },
  { name: 'Ilocos', lat: 17.5747, lng: 120.3869 },
  { name: 'La Union', lat: 16.6156, lng: 120.3186 },
  { name: 'Pampanga', lat: 15.0794, lng: 120.6190 },
  { name: 'Pangasinan', lat: 15.8949, lng: 120.2863 },
  { name: 'Subic', lat: 14.7956, lng: 120.2863 },
  { name: 'Tuguegarao', lat: 17.6131, lng: 121.7269 },
  { name: 'Baguio', lat: 16.4023, lng: 120.5960 },
  { name: 'Tuba Benguet', lat: 16.3167, lng: 120.5500 },
  { name: 'Bulacan', lat: 14.7928, lng: 120.9783 },
  { name: 'Bacoor', lat: 14.4594, lng: 120.9617 },
  { name: 'Cavite', lat: 14.4297, lng: 120.9406 },
  { name: 'Laguna', lat: 14.1700, lng: 121.3300 },
  { name: 'Batangas', lat: 14.1075, lng: 121.1647 },
  { name: 'Naga', lat: 13.6218, lng: 123.1947 },
  { name: 'Legazpi City', lat: 13.1391, lng: 123.7438 },
  { name: 'Tacloban', lat: 11.2433, lng: 124.9847 },
  { name: 'Iloilo City', lat: 10.7202, lng: 122.5621 },
  { name: 'Bacolod', lat: 10.6765, lng: 122.9509 },
  { name: 'Cebu City', lat: 10.3157, lng: 123.8854 },
  { name: 'Mandaue City', lat: 10.3236, lng: 123.9222 },
  { name: 'Lapu-Lapu', lat: 10.3070, lng: 123.9580 },
  { name: 'CDO', lat: 8.4542, lng: 124.6319 },
  { name: 'Davao', lat: 7.1907, lng: 125.4553 },
];

// Export location arrays for use in other components
export const metroManilaLocations = fallbackMetroManila;
export const provincialLocations = fallbackProvincial;

// Slightly randomize marker positions to avoid overlap (use seed for consistency)
function jitter(lat, lng, seed) {
  const latJitter = (Math.sin(seed * 12.9898) * 0.5 + 0.5 - 0.5) * 0.03;
  const lngJitter = (Math.cos(seed * 78.233) * 0.5 + 0.5 - 0.5) * 0.03;
  return [lat + latJitter, lng + lngJitter];
}

// Helper component to initialize map properly and set bounds
function MapInitializer() {
  const map = useMap();
  useEffect(() => {
    // Invalidate size after mount to fix white boxes
    const timer = setTimeout(() => {
      map.invalidateSize();
      // Set max bounds to restrict view to Philippines area
      const philippinesBounds = [
        [4.5, 116.0], // Southwest coordinates
        [21.0, 127.0]  // Northeast coordinates
      ];
      map.setMaxBounds(philippinesBounds);
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Helper component for clickable label
function LocationLabel({ name, lat, lng, color, markerRef }) {
  const handleClick = () => {
    if (markerRef && markerRef.current) {
      const marker = markerRef.current;
      const map = marker._map;
      if (map) {
        // Smooth zoom to location (zoom level 10 for area/city context)
        map.flyTo([lat, lng], 10, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
        // Open popup after a short delay
        setTimeout(() => {
          marker.openPopup();
        }, 800);
      }
    }
  };

  return (
    <div
      className="flex items-center text-white text-sm sm:text-base font-medium cursor-pointer transition-all duration-200"
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      style={{
        userSelect: 'none',
        padding: '0.25rem 0',
      }}
      tabIndex={0}
      role="button"
      aria-label={`Zoom to ${name}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.color = 'white';
      }}
    >
      <span style={{ color, fontWeight: 700, marginRight: 8, fontSize: '1.1em' }}>
        {color === '#1976d2' ? '●' : '●'}
      </span>
      <span style={{ fontSize: '0.95rem' }}>{name}</span>
    </div>
  );
}

// Legend component
function MapLegend() {
  return (
    <div
      className="text-xs sm:text-sm"
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(255,255,255,0.98)',
        borderRadius: '0.5rem',
        padding: '6px 12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 2,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: '#333',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1976d2', fontWeight: 700, fontSize: '1.2em' }}>●</span>
        <span>Metro Manila</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#d32f2f', fontWeight: 700, fontSize: '1.2em' }}>●</span>
        <span>Provincial</span>
      </span>
    </div>
  );
}

const Map = () => {
  const labelsRef = useRef(null);
  const [mapHeight, setMapHeight] = useState('500px');
  const [isMobile, setIsMobile] = useState(false);
  const markerRefs = useRef({});
  const [metroManilaLocations, setMetroManilaLocations] = useState(fallbackMetroManila);
  const [provincialLocations, setProvincialLocations] = useState(fallbackProvincial);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/locations');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Using live location data from admin panel');
          setMetroManilaLocations(data.metroManila);
          setProvincialLocations(data.provincial);
        } else {
          console.warn('⚠️ API unavailable, using fallback location data');
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch locations, using fallback data');
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    // Inject Leaflet CSS if not present
    if (typeof document !== 'undefined' && !document.querySelector('link[data-leaflet-cdn]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-leaflet-cdn', 'true');
      document.head.appendChild(link);
    }
    // Sync map height and check screen size
    function updateHeight() {
      const windowWidth = window.innerWidth;
      const isSmallScreen = windowWidth < 1024; // lg breakpoint
      setIsMobile(isSmallScreen);
      
      if (isSmallScreen) {
        // Fixed height for mobile/tablet
        setMapHeight('400px');
      } else if (labelsRef.current) {
        // Match labels height on desktop
        const newHeight = labelsRef.current.offsetHeight + 'px';
        setMapHeight(newHeight);
      }
      // Trigger map resize after height change
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <section id="map" className="section-padding bg-accent-green">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Our <span className="text-yellow-highlight">Strategic Locations</span>
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">
            We ensure your brand reaches the right audience at the right place.
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full items-start">
          {/* Map Column */}
          <div
            className="w-full lg:w-3/5 lg:flex-shrink-0"
            style={{
              position: 'relative',
              height: mapHeight,
              background: 'white',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              padding: '0',
              transition: 'height 0.2s',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 0,
            }}
          >
            <MapLegend />
            <div style={{ height: '100%', width: '100%' }}>
              <MapContainer
                center={[12.8797, 121.7740]}
                zoom={6}
                minZoom={5.5} // Slightly lower for better initial view
                maxZoom={13}  // Prevent excessive zoom - city/area level
                style={{
                  height: '100%',
                  width: '100%',
                  minHeight: mapHeight,
                  background: 'white',
                  zIndex: 0,
                }}
                scrollWheelZoom={true}
                className="leaflet-map"
                whenReady={(map) => {
                  setTimeout(() => {
                    map.target.invalidateSize();
                  }, 200);
                }}
              >
                <MapInitializer />
                
                <LayersControl position="topleft">
                  <LayersControl.BaseLayer checked name="Street Map">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      maxZoom={13}
                    />
                  </LayersControl.BaseLayer>
                  
                  <LayersControl.BaseLayer name="Light">
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                      maxZoom={13}
                    />
                  </LayersControl.BaseLayer>
                  
                  <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution='&copy; Esri'
                      maxZoom={13}
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                {/* Metro Manila Markers */}
                {metroManilaLocations.map((loc, idx) => {
                  if (!markerRefs.current[loc.name]) {
                    markerRefs.current[loc.name] = { current: null };
                  }
                  return (
                    <Marker
                      key={`mm-${idx}`}
                      position={jitter(loc.lat, loc.lng, idx + 100)}
                      icon={blueIcon}
                      draggable={false}
                      ref={markerRefs.current[loc.name]}
                    >
                      <Popup>
                        <div style={{ padding: '4px 8px' }}>
                          <strong style={{ color: '#1976d2', fontSize: '1.1rem' }}>{loc.name}</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>Metro Manila</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                {/* Provincial Markers */}
                {provincialLocations.map((loc, idx) => {
                  if (!markerRefs.current[loc.name]) {
                    markerRefs.current[loc.name] = { current: null };
                  }
                  return (
                    <Marker
                      key={`prov-${idx}`}
                      position={jitter(loc.lat, loc.lng, idx + 500)}
                      icon={redIcon}
                      draggable={false}
                      ref={markerRefs.current[loc.name]}
                    >
                      <Popup>
                        <div style={{ padding: '4px 8px' }}>
                          <strong style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{loc.name}</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>Provincial</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
          {/* Labels Column */}
          <div
            ref={labelsRef}
            className="w-full lg:w-2/5 lg:flex-shrink-0"
            style={{
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              background: 'rgba(255,255,255,0.10)',
              borderRadius: '1.5rem',
              height: 'fit-content',
              alignSelf: 'flex-start',
            }}
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Metro Manila Cities</h3>
              <div
                className="grid grid-cols-2 gap-2 sm:gap-x-6 sm:gap-y-2"
              >
                {metroManilaLocations.map((loc, idx) => (
                  <LocationLabel
                    key={`mm-label-${idx}`}
                    name={loc.name}
                    lat={loc.lat}
                    lng={loc.lng}
                    color="#1976d2"
                    markerRef={markerRefs.current[loc.name]}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Provincial Locations</h3>
              <div
                className="grid grid-cols-2 gap-2 sm:gap-x-6 sm:gap-y-2"
              >
                {provincialLocations.map((loc, idx) => (
                  <LocationLabel
                    key={`prov-label-${idx}`}
                    name={loc.name}
                    lat={loc.lat}
                    lng={loc.lng}
                    color="#d32f2f"
                    markerRef={markerRefs.current[loc.name]}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
