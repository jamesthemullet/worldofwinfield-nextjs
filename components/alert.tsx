import type { JSX } from 'react';
import type { AlertProps } from '../lib/types';
import Container from './container';

export default function Alert({ preview }: AlertProps): JSX.Element {
  return (
    <div role="alert" aria-live="assertive">
      <Container>
        <div>
          {preview ? (
            <>
              This is a page preview. <a href="/api/exit-preview">Exit preview mode</a>.
            </>
          ) : (
            <></>
          )}
        </div>
      </Container>
    </div>
  );
}
