import styled from '@emotion/styled';
import type { Feature, GeoJsonObject, Geometry } from 'geojson';
import Link from 'next/link';
import {
  type CSSProperties,
  type JSX,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import countries110m from 'world-atlas/countries-110m.json';
import { findPostsForLocation } from '../lib/location-posts';
import type { LocationPost } from '../lib/types';
import { colours } from '../pages/_app';

export type WorldMapProps = {
  visitedCountries: string[];
  wishListCountries?: string[];
  posts?: LocationPost[];
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const DEFAULT_CENTER: [number, number] = [0, 20];
// How long the tooltip lingers after the pointer leaves a country, so there is
// time to move onto it and click one of the post links.
export const TOOLTIP_HIDE_DELAY_MS = 400;

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

// The inverse of NAME_ALIASES: the atlas's canonical name ("United States of
// America") to every alias a blog post might actually be tagged with ("USA").
const ALIASES_BY_CANONICAL_NAME: Record<string, string[]> = Object.entries(NAME_ALIASES).reduce(
  (acc, [alias, canonical]) => {
    (acc[canonical] ??= []).push(alias);
    return acc;
  },
  {} as Record<string, string[]>,
);

const PROJECTION_CONFIG = { scale: 147 } as const;
const MAP_STYLE = { width: '100%', height: 'auto' } as const;

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

export default function WorldMap({
  visitedCountries,
  wishListCountries = [],
  posts = [],
}: WorldMapProps): JSX.Element {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPosts, setHoveredPosts] = useState<LocationPost[]>([]);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  const postsForCountry = useCallback(
    (name: string): LocationPost[] =>
      posts.length === 0
        ? []
        : findPostsForLocation([name, ...(ALIASES_BY_CANONICAL_NAME[name] ?? [])], posts),
    [posts],
  );

  // A pinned tooltip ignores hovering over other countries, so the pointer can
  // cross them on the way to the post links.
  const [pinned, setPinned] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  useEffect(() => cancelHide, [cancelHide]);

  const showCountry = useCallback(
    (name: string, label: string) => {
      cancelHide();
      setHovered(label);
      setHoveredPosts(postsForCountry(name));
    },
    [cancelHide, postsForCountry],
  );

  const highlight = useCallback(
    (name: string, label: string) => {
      if (!pinned) showCountry(name, label);
    },
    [pinned, showCountry],
  );

  const clearHighlight = useCallback(() => {
    cancelHide();
    setPinned(false);
    setHovered(null);
    setHoveredPosts([]);
  }, [cancelHide]);

  const scheduleClear = useCallback(() => {
    if (pinned) return;
    cancelHide();
    hideTimer.current = setTimeout(clearHighlight, TOOLTIP_HIDE_DELAY_MS);
  }, [pinned, cancelHide, clearHighlight]);

  const togglePin = useCallback(
    (name: string, label: string) => {
      if (pinned && hovered === label) {
        clearHighlight();
        return;
      }
      showCountry(name, label);
      setPinned(true);
    },
    [pinned, hovered, clearHighlight, showCountry],
  );

  const visitedSet = useMemo(() => new Set(visitedCountries.map(normalise)), [visitedCountries]);
  // A country already visited is shown as visited, not as a wish-list entry.
  const wishListSet = useMemo(
    () => new Set(wishListCountries.map(normalise).filter((name) => !visitedSet.has(name))),
    [wishListCountries, visitedSet],
  );

  const zoomIn = useCallback(() => setZoom((current) => Math.min(current * 1.5, MAX_ZOOM)), []);
  const zoomOut = useCallback(() => setZoom((current) => Math.max(current / 1.5, MIN_ZOOM)), []);
  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setCenter(DEFAULT_CENTER);
  }, []);

  const handleMoveEnd = useCallback(
    ({ coordinates, zoom: nextZoom }: { coordinates?: [number, number]; zoom?: number }) => {
      if (coordinates) setCenter(coordinates);
      if (nextZoom) setZoom(nextZoom);
    },
    [],
  );

  return (
    <MapWrapper aria-label="World map with countries James has visited highlighted in purple and holiday wish list countries highlighted in blue">
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
      <Legend>
        <LegendItem>
          <LegendSwatch colour={colours.purple} /> Visited
        </LegendItem>
        <LegendItem>
          <LegendSwatch colour={colours.azure} /> Wish list
        </LegendItem>
      </Legend>
      <ComposableMap projectionConfig={PROJECTION_CONFIG} style={MAP_STYLE}>
        <title>Map of countries visited</title>
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={handleMoveEnd}
          filterZoomEvent={(event: unknown) => {
            const wheelEvent = event as WheelEvent;
            return wheelEvent.type !== 'wheel' || wheelEvent.ctrlKey;
          }}>
          <Geographies
            geography={countries110m as unknown as GeoJsonObject}
            parseGeographies={dropFrenchGuiana}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = (geo.properties?.name as string | undefined) ?? '';
                const visited = visitedSet.has(name.toLowerCase());
                const wishListed = !visited && wishListSet.has(name.toLowerCase());
                const highlighted = visited || wishListed;
                const label = wishListed ? `${name} (wish list)` : name;

                const defaultFill = visited
                  ? colours.purple
                  : wishListed
                    ? colours.azure
                    : '#e0e0e0';
                const hoverFill = visited ? colours.pink : wishListed ? colours.blueish : '#cccccc';

                return (
                  <CountryPath
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={highlighted ? 0 : -1}
                    role={highlighted ? 'button' : undefined}
                    aria-label={highlighted ? label : undefined}
                    onMouseEnter={() => highlight(name, label)}
                    onMouseLeave={scheduleClear}
                    onFocus={() => highlight(name, label)}
                    onBlur={scheduleClear}
                    onClick={highlighted ? () => togglePin(name, label) : undefined}
                    onKeyDown={
                      highlighted
                        ? (event: KeyboardEvent) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              togglePin(name, label);
                            }
                          }
                        : undefined
                    }
                    style={
                      {
                        '--default-fill': defaultFill,
                        '--hover-fill': hoverFill,
                      } as CSSProperties
                    }
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {hovered && (
        <Tooltip
          role="status"
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleClear}
          onFocus={cancelHide}
          onBlur={scheduleClear}>
          <TooltipHeader>
            <span>{hovered}</span>
            {pinned && (
              <CloseButton type="button" onClick={clearHighlight} aria-label="Close">
                ×
              </CloseButton>
            )}
          </TooltipHeader>
          {hoveredPosts.length > 0 && !pinned && <TooltipHint>Click to pin</TooltipHint>}
          {hoveredPosts.length > 0 && (
            <TooltipPostList>
              {hoveredPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </TooltipPostList>
          )}
        </Tooltip>
      )}
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

const Legend = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
`;

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const LegendSwatch = styled.span<{ colour: string }>`
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 2px;
  background: ${(props) => props.colour};
`;

const CountryPath = styled(Geography)`
  fill: var(--default-fill);
  stroke: #ffffff;
  stroke-width: 0.5;

  &:hover,
  &:focus,
  &:active {
    fill: var(--hover-fill);
    outline: none;
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
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colours.white};
  font-size: 1rem;
  line-height: 1;
  padding: 0 0.15rem;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const TooltipHint = styled.span`
  display: block;
  font-size: 0.7rem;
  font-weight: 400;
  opacity: 0.8;
`;

const TooltipPostList = styled.ul`
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0;

  a {
    color: ${colours.white};
    text-decoration: underline;
  }
`;
