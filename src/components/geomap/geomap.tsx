'use client';
import { FC, useEffect, useRef, useState } from 'react';
import L, { GeoJSON } from 'leaflet';
import { MapContainer, TileLayer, GeoJSON as LeafletGeoJSON } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { Box, Skeleton, Text } from '@chakra-ui/react';

interface GeoMapProps {
  geoData?: GeoJsonObject;
}

const GeoMap: FC<GeoMapProps> = ({ geoData }) => {
  const position: L.LatLngExpression = [40.7831, -73.9712];
  const clickedLayerRef = useRef<L.Layer | null>(null);
  const geojsonRef = useRef<GeoJSON | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  console.log('Map Rendered');
  // Update GeoJSON data when geoData prop changes
  useEffect(() => {
    if (geojsonRef.current && geoData) {
      geojsonRef.current.clearLayers(); // Remove the existing layers
      geojsonRef.current.addData(geoData); // Add the new GeoJSON data
    }
  }, [geoData]);

  const getColor = (density: number) => {
    return density > 100
      ? '#800026'
      : density > 50
        ? '#BD0026'
        : density > 20
          ? '#E31A1C'
          : density > 10
            ? '#FC4E2A'
            : '#FFEDA0';
  };

  const style: L.StyleFunction = (feature: GeoJSON.Feature | undefined) => {
    if (!feature || !feature.properties) {
      return {};
    }

    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const highlightFeature = (e: L.LeafletMouseEvent, feature: GeoJSON.Feature) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    const popupMessage = `Trip Count: <b>${feature.properties?.density.toString()}</b>`;
    layer.bindPopup(popupMessage).openPopup();
    layer.bringToFront();
    clickedLayerRef.current = layer;
  };

  const resetStyle = (layer: L.Layer) => {
    if (geoData && layer) {
      geojsonRef.current?.resetStyle(layer);
    }
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    layer.on({
      click: (e) => {
        if (clickedLayerRef.current && clickedLayerRef.current !== layer) {
          resetStyle(clickedLayerRef.current);
        }

        highlightFeature(e, feature);
      }
    });
  };

  return (
    <Box width="full" height="full">
      {!mapReady && <Skeleton width="full" height="full" />}
      <MapContainer
        center={position}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        placeholder={<Text as="p">NYC TLC Density Map</Text>}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {geoData && (
          <LeafletGeoJSON
            data={geoData}
            ref={geojsonRef}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </Box>
  );
};
export default GeoMap;
