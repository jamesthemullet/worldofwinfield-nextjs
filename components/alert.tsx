import Container from './container';
import { AlertProps } from '../lib/types';

export default function Alert({ preview }: AlertProps) {
  return (
    <div>
      <Container>
        <div>
          {preview ? (
            <>
              This is a page preview. <a href="/api/exit-preview">Click here</a> to exit preview
              mode.
            </>
          ) : (
            <></>
          )}
        </div>
      </Container>
    </div>
  );
}
