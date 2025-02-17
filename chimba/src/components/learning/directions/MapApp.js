// src/components/MapGame.js
import React, { useState } from "react";
import Map from "react-map-gl";
import { Marker, Source, Layer } from "react-map-gl";
import * as turf from "@turf/turf";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";


const MAPBOX_TOKEN = "pk.eyJ1IjoiMGhhbnpyIiwiYSI6ImNtNzR0ZjV0NDBlMWwyaXF5MDExdGxqNmIifQ.SQHEkij-egEyOnjmLzSK2Q"; // Replace with your token

const MapGame = () => {
    const [viewport, setViewport] = useState({
        longitude: -74.006, // Example: New York City
        latitude: 40.7128,
        zoom: 12,
    });

    const [waypoints, setWaypoints] = useState([
        { id: 1, longitude: -74.006, latitude: 40.7128, label: "Start" },
        { id: 2, longitude: -74.016, latitude: 40.7228, label: "Checkpoint 1" },
        { id: 3, longitude: -74.026, latitude: 40.7328, label: "Destination" },
    ]);

    // Create a geojson line between waypoints
    const lineCoordinates = waypoints.map(wp => [wp.longitude, wp.latitude]);
    const routeGeoJSON = turf.lineString(lineCoordinates);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Map
                mapLib={maplibregl}  // Explicitly use MapLibre GL
                mapboxAccessToken={MAPBOX_TOKEN} // Still needed for Mapbox styles if used
                initialViewState={{
                    longitude: -74.006,
                    latitude: 40.7128,
                    zoom: 12,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onLoad={() => console.log("Map Loaded Successfully!")} // Debugging

            >
                {/* Markers for waypoints */}
                {waypoints.map((wp) => (
                    <Marker
                        key={wp.id}
                        longitude={wp.longitude}
                        latitude={wp.latitude}
                    >
                        <div style={{ backgroundColor: "purple", color: "white", padding: "5px", borderRadius: "5px" }}>
                            {wp.label}
                        </div>
                    </Marker>
                ))}

                {/* Route Line */}
                <Source id="route" type="geojson" data={routeGeoJSON}>
                    <Layer
                        id="route-line"
                        type="line"
                        paint={{ "line-color": "#800080", "line-width": 4 }}
                    />
                </Source>
            </Map>
        </div>
    );
};

export default MapGame;
