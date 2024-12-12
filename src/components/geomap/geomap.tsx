'use client';
import { FC, useEffect, useRef, useState } from 'react';
import L, { GeoJSON } from 'leaflet';
import { MapContainer, TileLayer, GeoJSON as LeafletGeoJSON } from 'react-leaflet';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { Box, Skeleton, Text } from '@chakra-ui/react';

interface GeoMapProps {
  geoData?: FeatureCollection;
  tripDensity?: Map<number, number>;
  isLoading?: boolean;
}

const GeoMap: FC<GeoMapProps> = ({ geoData, tripDensity, isLoading }) => {
  const position: L.LatLngExpression = [40.7831, -73.9712];
  const tripDensityRef = useRef(tripDensity);
  const clickedLayerRef = useRef<L.Layer | null>(null);
  const geojsonRef = useRef<GeoJSON | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  useEffect(() => {
    if (geojsonRef.current && geoData) {
      geojsonRef.current.clearLayers();
      geojsonRef.current.addData(geoData);
    }
  }, [geoData]);

  useEffect(() => {
    if (geojsonRef.current && tripDensity) {
      tripDensityRef.current = tripDensity;

      geojsonRef.current.eachLayer((layer) => {
        const featureLayer = layer as L.GeoJSON;
        const feature = featureLayer.feature as Feature<Geometry>;
        if (feature) {
          featureLayer.setStyle(style(feature));
        }
      });
    }
  }, [tripDensity]);

  const getColor = (density: number) => {
    return density > 10000
      ? '#800026'
      : density > 5000
        ? '#BD0026'
        : density > 2000
          ? '#E31A1C'
          : density > 1000
            ? '#FC4E2A'
            : '#FFEDA0';
  };

  const style: L.StyleFunction = (feature: GeoJSON.Feature | undefined) => {
    if (!feature || !feature.properties) {
      return {};
    }

    const density = tripDensityRef.current?.get(Number(feature.properties.location_id)) || 0;

    return {
      fillColor: getColor(density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const highlightFeature = (
    e: L.LeafletMouseEvent,
    feature: GeoJSON.Feature,
    tripDensity: Map<number, number> | undefined
  ) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    const density = tripDensity?.get(Number(feature.properties?.location_id)) || 0;
    const popupMessage = `Trip Count: <b>${density?.toString()}</b>`;
    layer.bindPopup(popupMessage).openPopup();
    layer.bringToFront();
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

        highlightFeature(e, feature, tripDensityRef.current);
        clickedLayerRef.current = layer;
      }
    });
  };

  return (
    <Box
      width="full"
      height="full"
      filter={isLoading ? 'blur(4px)' : 'none'}
      transition="filter 0.3s ease"
    >
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
