import styled from '@emotion/styled';
import type { Feature, Geometry } from 'geojson';
import { type JSX, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import countries110m from 'world-atlas/countries-110m.json';
import { colours } from '../pages/_app';

type WorldMapProps = {
  visitedCountries: string[];
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const DEFAULT_CENTER: [number, number] = [0, 20];

// Maps common country names (as used in the Google Sheet) to the
// Natural Earth names used by the world-atlas TopoJSON data.
const NAME_ALIASES: Record<string, string> = {
  USA: 'United States of America',
  'United States': 'United States of America',
  UK: 'United Kingdom',
  UAE: 'United Arab Emirates',
  'Czech Republic': 'Czechia',
  'Ivory Coast': "Côte d'Ivoire",
  'Republic of the Congo': 'Congo',
  'Democratic Republic of the Congo': 'Dem. Rep. Congo',
  'Bosnia and Herzegovina': 'Bosnia and Herz.',
  'North Macedonia': 'Macedonia',
  'Trinidad & Tobago': 'Trinidad and Tobago',
  Swaziland: 'eSwatini',
  Burma: 'Myanmar',
};

const normalise = (name: string): string => (NAME_ALIASES[name] ?? name).toLowerCase();

// The Natural Earth data bundles France's mainland/Corsica together with
// French Guiana as a single multipolygon, so visiting France would
// otherwise also highlight a landmass in South America.
const dropFrenchGuiana = (features: Feature[]): Feature[] =>
  features.map((feature) => {
    const geometry = feature.geometry as Geometry & { coordinates?: number[][][][] };
    if (feature.properties?.name !== 'France' || geometry.type !== 'MultiPolygon') {
      return feature;
    }

    return {
      ...feature,
      geometry: {
        ...geometry,
        coordinates: geometry.coordinates?.filter((polygon) =>
          polygon[0].every(([lon]) => lon > -20),
        ),
      },
    } as Feature;
  });

export default function WorldMap({ visitedCountries }: WorldMapProps): JSX.Element {
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  const visitedSet = new Set(visitedCountries.map(normalise));

  const zoomIn = () => setZoom((current) => Math.min(current * 1.5, MAX_ZOOM));
  const zoomOut = () => setZoom((current) => Math.max(current / 1.5, MIN_ZOOM));
  const resetZoom = () => {
    setZoom(MIN_ZOOM);
    setCenter(DEFAULT_CENTER);
  };

  return (
    <MapWrapper aria-label="World map with countries James has visited highlighted in purple">
      <Controls>
        <ZoomButton type="button" onClick={zoomIn} aria-label="Zoom in">
          +
        </ZoomButton>
        <ZoomButton type="button" onClick={zoomOut} aria-label="Zoom out">
          −
        </ZoomButton>
        <ZoomButton type="button" onClick={resetZoom} aria-label="Reset zoom">
          Reset
        </ZoomButton>
      </Controls>
      <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: '100%', height: 'auto' }}>
        <title>Map of countries visited</title>
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={({ coordinates, zoom: nextZoom }) => {
            setCenter(coordinates);
            setZoom(nextZoom);
          }}
          filterZoomEvent={(event: unknown) => {
            const wheelEvent = event as WheelEvent;
            return wheelEvent.type !== 'wheel' || wheelEvent.ctrlKey;
          }}>
          <Geographies geography={countries110m} parseGeographies={dropFrenchGuiana}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name as string;
                const visited = visitedSet.has(name.toLowerCase());

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={visited ? 0 : -1}
                    aria-label={visited ? name : undefined}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(name)}
                    onBlur={() => setHovered(null)}
                    style={{
                      default: {
                        fill: visited ? colours.purple : '#e0e0e0',
                        stroke: '#ffffff',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: visited ? colours.pink : '#cccccc',
                        stroke: '#ffffff',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      pressed: {
                        fill: visited ? colours.pink : '#cccccc',
                        stroke: '#ffffff',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {hovered && <Tooltip role="status">{hovered}</Tooltip>}
    </MapWrapper>
  );
}

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 1.5rem auto 0;
`;

const Controls = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 1;
  display: flex;
  gap: 0.35rem;
`;

const ZoomButton = styled.button`
  background: ${colours.white};
  color: ${colours.dark};
  border: 1px solid ${colours.dark};
  border-radius: 4px;
  padding: 0.25rem 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${colours.purple};
    color: ${colours.white};
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${colours.dark};
  color: ${colours.white};
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  pointer-events: none;
`;
