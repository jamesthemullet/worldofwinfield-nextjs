import styled from '@emotion/styled';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import countries110m from 'world-atlas/countries-110m.json';
import { colours } from '../pages/_app';

type WorldMapProps = {
  visitedCountries: string[];
};

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

export default function WorldMap({ visitedCountries }: WorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const visitedSet = new Set(visitedCountries.map(normalise));

  return (
    <MapWrapper aria-label="World map with countries James has visited highlighted in purple">
      <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: '100%', height: 'auto' }}>
        <title>Map of countries visited</title>
        <Geographies geography={countries110m}>
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
