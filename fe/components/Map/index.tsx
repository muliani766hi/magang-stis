'use client'

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const GoogleMap = dynamic(() => import("@react-google-maps/api").then((mod) => mod.GoogleMap), {
    ssr: false,
});

const Marker = dynamic(() => import("@react-google-maps/api").then((mod) => mod.Marker), {
    ssr: false,
});

const LoadScript = dynamic(() => import("@react-google-maps/api").then((mod) => mod.LoadScript), {
    ssr: false,
});

const containerStyle = {
    width: "100%",
    height: "400px",
};


interface Position {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    initialPosition: Position;
    onPositionChange: (position: Position) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ initialPosition, onPositionChange }) => {
    const [isClient, setIsClient] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<Position | null>(initialPosition);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleMarkerDragEnd = (e: any) => {
        const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setMarkerPosition(newPosition);
        onPositionChange(newPosition);
    };

    if (!isClient || markerPosition === null) {
        return <div>Loading...</div>;
    }

    return (
        <LoadScript googleMapsApiKey="AIzaSyBuZrmAT7S_y6k23c7caU7DHMBWfqidUdw" id="google-maps-script">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPosition}
                zoom={10}
                key={`${markerPosition.lat}-${markerPosition.lng}`}
            >
                <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
