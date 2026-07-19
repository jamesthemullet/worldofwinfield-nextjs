import styled from '@emotion/styled';
import { type JSX, useEffect, useRef } from 'react';

type ImageLightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps): JSX.Element {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      <ZoomedImage src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
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

const ZoomedImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: default;
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
