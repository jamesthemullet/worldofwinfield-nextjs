import styled from '@emotion/styled';
import { type JSX, useEffect, useRef, useState } from 'react';

type ImageLightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps): JSX.Element {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('center');

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <Overlay role="dialog" aria-modal="true" aria-label={alt || 'Zoomed image'} onClick={onClose}>
      <CloseButton
        ref={closeButtonRef}
        type="button"
        aria-label="Close"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}>
        &times;
      </CloseButton>
      <ImageScroll $isZoomedIn={isZoomedIn}>
        <ZoomedImage
          src={src}
          alt={alt}
          $isZoomedIn={isZoomedIn}
          $zoomOrigin={zoomOrigin}
          onClick={(event) => {
            event.stopPropagation();
            setIsZoomedIn((current) => !current);

            const bounds = event.currentTarget.getBoundingClientRect();
            const originX = ((event.clientX - bounds.left) / bounds.width) * 100;
            const originY = ((event.clientY - bounds.top) / bounds.height) * 100;
            setZoomOrigin(`${originX}% ${originY}%`);
          }}
        />
      </ImageScroll>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  box-sizing: border-box;
  cursor: zoom-out;
`;

const ImageScroll = styled.div<{ $isZoomedIn: boolean }>`
  max-width: 100%;
  max-height: 100%;
  overflow: ${({ $isZoomedIn }) => ($isZoomedIn ? 'auto' : 'hidden')};
  display: flex;
  align-items: ${({ $isZoomedIn }) => ($isZoomedIn ? 'flex-start' : 'center')};
  justify-content: ${({ $isZoomedIn }) => ($isZoomedIn ? 'flex-start' : 'center')};
`;

const ZOOM_SCALE = 2.2;

const ZoomedImage = styled.img<{ $isZoomedIn: boolean; $zoomOrigin: string }>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: ${({ $isZoomedIn }) => ($isZoomedIn ? 'zoom-out' : 'zoom-in')};
  transform-origin: ${({ $zoomOrigin }) => $zoomOrigin};
  transform: ${({ $isZoomedIn }) => ($isZoomedIn ? `scale(${ZOOM_SCALE})` : 'none')};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.5rem;

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;
