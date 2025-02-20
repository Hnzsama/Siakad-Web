import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Search, ZoomIn, ZoomOut, Loader2, MapPin } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MapSelectorProps {
    longitude: string
    latitude: string
    onPositionChange: (lng: string, lat: string, address?: string) => void
}

interface LocationSearchProps {
    onLocationSelect: (lng: string, lat: string, address?: string) => void
    mapRef: React.MutableRefObject<L.Map | null>
}

const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [32, 48],
    iconAnchor: [16, 48]
})

async function getAddressFromCoordinates(lat: number, lng: number) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error('Error getting address:', error);
        return '';
    }
}

function LocationMarker({ onPositionChange }: { onPositionChange: (lng: string, lat: string, address?: string) => void }) {
    const map = useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng
            const address = await getAddressFromCoordinates(lat, lng);
            onPositionChange(lng.toString(), lat.toString(), address)
            map.flyTo(e.latlng, map.getZoom())
        },
    })
    return null
}

function SearchResults({ results, onSelect, onClose }: {
    results: any[],
    onSelect: (result: any) => void,
    onClose: () => void
}) {
    if (results.length === 0) return null

    return (
        <div className="absolute w-full mt-1 overflow-hidden rounded-lg shadow-lg bg-background">
            <div className="overflow-y-auto max-h-60">
                {results.map((result, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            onSelect(result)
                            onClose()
                        }}
                        className="flex items-center w-full gap-2 px-3 py-2 text-left transition-colors hover:bg-background/70"
                    >
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm truncate">{result.display_name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function CustomControls() {
    const map = useMap()

    return (
        <div className="absolute flex flex-col gap-1 bottom-4 right-4">
            <Button
                size="sm"
                variant="secondary"
                onClick={() => map.zoomIn()}
                className="rounded-full shadow-sm w-7 h-7 bg-white/90 hover:bg-white"
            >
                <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="secondary"
                onClick={() => map.zoomOut()}
                className="rounded-full shadow-sm w-7 h-7 bg-white/90 hover:bg-white"
            >
                <ZoomOut className="w-4 h-4" />
            </Button>
        </div>
    )
}

function LocationSearch({ onLocationSelect, mapRef }: LocationSearchProps) {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])

    const search = async () => {
        if (!query.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            )
            const data = await response.json()
            setResults(data)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = (result: any) => {
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        if (mapRef.current) {
            mapRef.current.flyTo([lat, lng], 16)
        }
        onLocationSelect(lng.toString(), lat.toString(), result.display_name)
        setQuery('')
    }

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[400]">
            <div className="relative">
                <Search className="absolute z-10 w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            search()
                        }
                    }}
                    placeholder="Search location..."
                    className="border-0 rounded-full shadow-sm h-9 pl-9 pr-9 bg-background"
                />
                <div className="absolute z-10 -translate-y-1/2 right-3 top-1/2">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : query && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={search}
                            className="-mr-2 h-7 w-7 hover:bg-transparent"
                            type="button"
                        >
                            <Search className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                <SearchResults
                    results={results}
                    onSelect={handleSelect}
                    onClose={() => setResults([])}
                />
            </div>
        </div>
    )
}

export function MapSelector({ longitude, latitude, onPositionChange }: MapSelectorProps) {
    const mapRef = useRef<L.Map | null>(null)
    const position: [number, number] = [
        parseFloat(latitude) || -7.2575,
        parseFloat(longitude) || 112.7521
    ]

    return (
        <div className="relative w-full h-full">
            <MapContainer
                ref={mapRef}
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                className="rounded-lg"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CustomControls />
                <LocationMarker onPositionChange={onPositionChange} />
                {longitude && latitude && (
                    <Marker position={position} icon={customIcon} />
                )}
            </MapContainer>
            <LocationSearch onLocationSelect={onPositionChange} mapRef={mapRef} />
        </div>
    )
}
