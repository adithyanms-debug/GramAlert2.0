import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import api from "../api";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";

const HEATMAP_SOURCE_ID = "grievances-heat-source";
const HEATMAP_LAYER_ID = "grievance-heat";

export default function GrievanceMap() {
  const [userName, setUserName] = useState("Loading...");
  const [grievances, setGrievances] = useState<any[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [mapMode, setMapMode] = useState<"markers" | "heatmap">("markers");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const fetchData = async () => {
    try {
      const userRes = await api.get('users/me');
      if (userRes.data && userRes.data.username) {
        const name = userRes.data.username;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        setUserName(capitalized);
      }

      const grievRes = await api.get('grievances');
      if (grievRes.data) {
        setGrievances(grievRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch map data", error);
      if (userName === "Loading...") setUserName("Administrator");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number | string, newStatus: string) => {
    try {
      const statusMap: Record<string, string> = {
        'received': 'Received',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
      };
      const formattedStatus = statusMap[newStatus] || newStatus;
      await api.patch(`grievances/${id}/status`, { status: formattedStatus });
      toast.success("Status updated successfully");
      
      // Update local state immediately
      setGrievances(prev =>
        prev.map(g =>
          g.id === id ? { ...g, status: formattedStatus } : g
        )
      );
      
      // Also update selected grievance if it's the one being modified
      if (selectedGrievance && (selectedGrievance.id === id)) {
        setSelectedGrievance({ ...selectedGrievance, status: formattedStatus });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const fitMapToGrievances = () => {
    const coordinates = grievances
      .filter((g: any) => g.latitude && g.longitude && !isNaN(Number(g.latitude)) && !isNaN(Number(g.longitude)))
      .map((g: any) => [Number(g.longitude), Number(g.latitude)] as [number, number]);

    if (coordinates.length > 0 && mapRef.current) {
      const bounds = coordinates.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );

      mapRef.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 13,
        duration: 1000
      });
    }
  };

  useEffect(() => {
    if (grievances.length) {
      fitMapToGrievances();
    }
  }, [grievances]);

  // Build GeoJSON for heatmap
  const heatmapGeoJSON = useMemo(() => {
    const valid = grievances.filter(
      g => g.latitude && g.longitude && !isNaN(Number(g.latitude)) && !isNaN(Number(g.longitude))
    );
    return {
      type: 'FeatureCollection' as const,
      features: valid.map(g => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [Number(g.longitude), Number(g.latitude)]
        },
        properties: { weight: 1 }
      }))
    };
  }, [grievances]);

  // --- Imperative MapLibre heatmap lifecycle ---

  // 1. When the map loads, add the source + layer directly via MapLibre API
  const handleMapLoad = useCallback((e: any) => {
    const map: maplibregl.Map = e.target;

    // Add GeoJSON source
    if (!map.getSource(HEATMAP_SOURCE_ID)) {
      map.addSource(HEATMAP_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
    }

    // Add heatmap layer
    if (!map.getLayer(HEATMAP_LAYER_ID)) {
      map.addLayer({
        id: HEATMAP_LAYER_ID,
        type: "heatmap",
        source: HEATMAP_SOURCE_ID,
        maxzoom: 17,
        layout: {
          visibility: "none"
        },
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "weight"],
            0, 0,
            1, 0.6
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 0.5,
            13, 1.5
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 8,
            13, 25
          ],
          "heatmap-opacity": 0.6,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0,0,0,0)",
            0.15, "rgba(0,150,255,0.3)",
            0.35, "rgba(0,200,120,0.4)",
            0.55, "rgba(255,220,0,0.6)",
            0.75, "rgba(255,140,0,0.8)",
            1, "rgba(255,0,0,0.9)"
          ]
        }
      });
    }

    setMapLoaded(true);
  }, []);

  // 2. When grievances change, update the source data imperatively
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current.getMap();
    const source = map.getSource(HEATMAP_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(heatmapGeoJSON as any);
    }
  }, [heatmapGeoJSON, mapLoaded]);

  // 3. When mapMode changes, toggle heatmap layer visibility
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current.getMap();
    if (map.getLayer(HEATMAP_LAYER_ID)) {
      map.setLayoutProperty(
        HEATMAP_LAYER_ID,
        "visibility",
        mapMode === "heatmap" ? "visible" : "none"
      );
    }
  }, [mapMode, mapLoaded]);

  // Center map on average coords or default location
  const mapCenter = useMemo(() => {
    const validLocs = grievances.filter(g => g.latitude && g.longitude && !isNaN(Number(g.latitude)) && !isNaN(Number(g.longitude)));
    if (validLocs.length > 0) {
      const avgLat = validLocs.reduce((sum, g) => sum + Number(g.latitude), 0) / validLocs.length;
      const avgLng = validLocs.reduce((sum, g) => sum + Number(g.longitude), 0) / validLocs.length;
      return { lat: avgLat, lng: avgLng };
    }
    return { lat: 21.1458, lng: 79.0882 };
  }, [grievances]);

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-6 sm:space-y-8 h-[calc(100vh-120px)] flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Grievance Map</h1>
            <p className="text-slate-600">Full-screen visualization of community grievance distribution.</p>
          </div>
          
          {/* Map Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-white/70 backdrop-blur-sm border border-white/60 shadow-md rounded-lg shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMapMode("markers")}
              className={`flex-1 sm:flex-none text-sm font-medium ${mapMode === "markers" ? "bg-white shadow-sm text-teal-700" : "text-slate-600"}`}
            >
              Markers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMapMode("heatmap")}
              className={`flex-1 sm:flex-none text-sm font-medium ${mapMode === "heatmap" ? "bg-white shadow-sm text-teal-700" : "text-slate-600"}`}
            >
              Heatmap
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 relative"
        >
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: mapCenter.lng,
              latitude: mapCenter.lat,
              zoom: 12
            }}
            onLoad={handleMapLoad}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            style={{ width: "100%", height: "100%" }}
          >
            {mapMode === "markers" && (
              grievances.map((g, i) => {
                if (g.latitude && g.longitude && !isNaN(Number(g.latitude)) && !isNaN(Number(g.longitude))) {
                  return (
                    <Marker
                      key={g.id || i}
                      latitude={Number(g.latitude)}
                      longitude={Number(g.longitude)}
                      anchor="bottom"
                      onClick={e => {
                        e.originalEvent.stopPropagation();
                        setSelectedGrievance(g);
                      }}
                    >
                      <MapPin className={`size-8 cursor-pointer hover:scale-110 transition-transform ${g.status === 'Resolved' ? 'text-emerald-600 fill-emerald-200 stroke-emerald-600' : 'text-red-600 fill-red-200 stroke-red-600'} stroke-[2.5] drop-shadow-md`} />
                    </Marker>
                  );
                }
                return null;
              })
            )}
          </Map>
        </motion.div>
      </div>

      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        isOpen={!!selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
        isAdmin={true}
        onStatusChange={handleStatusUpdate}
      />
    </DashboardLayout>
  );
}
