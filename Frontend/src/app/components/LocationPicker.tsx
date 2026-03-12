import { useState } from "react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import { MapPin, Search, Locate, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import "maplibre-gl/dist/maplibre-gl.css";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

export function LocationPicker({ onLocationSelect, initialPosition }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition ? [initialPosition[0], initialPosition[1]] : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [viewState, setViewState] = useState({
    latitude: initialPosition ? initialPosition[0] : 12.2958, // Default to Mysore, Karnataka
    longitude: initialPosition ? initialPosition[1] : 76.6394,
    zoom: 13,
  });

  const handleMapClick = (event: any) => {
    const { lngLat } = event;
    const lat = lngLat.lat;
    const lng = lngLat.lng;
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          setViewState({
            latitude: lat,
            longitude: lng,
            zoom: 15,
          });
          onLocationSelect(lat, lng);
          toast.success("Current location detected");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get current location. Please ensure location services are enabled.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Karnataka, India"
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition([lat, lng]);
        setViewState({
          latitude: lat,
          longitude: lng,
          zoom: 15,
        });
        onLocationSelect(lat, lng);
        toast.success("Location found");
      } else {
        toast.warning("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("Failed to search location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a location..."
              className="pl-10 h-10 bg-white border-slate-200"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
          >
            {searching ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
          </Button>
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Locate className="size-4" />
            <span className="hidden sm:inline">My Location</span>
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          <Navigation className="size-3 inline mr-1" />
          Click on the map to pin a location or search above
        </p>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" />
          <GeolocateControl
            position="top-right"
            trackUserLocation
            onGeolocate={(e: any) => {
              const lat = e.coords.latitude;
              const lng = e.coords.longitude;
              setPosition([lat, lng]);
              onLocationSelect(lat, lng);
            }}
          />
          
          {position && (
            <Marker
              latitude={position[0]}
              longitude={position[1]}
              anchor="bottom"
            >
              <div className="relative">
                <MapPin className="size-8 text-teal-600 fill-teal-200 stroke-teal-600 stroke-[2.5] drop-shadow-lg" />
              </div>
            </Marker>
          )}
        </Map>

        {/* Selected Location Info */}
        {position && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                <MapPin className="size-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700 text-sm">Location Selected</p>
                  <p className="text-xs text-slate-600">
                    Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPosition(null);
                  onLocationSelect(0, 0);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}