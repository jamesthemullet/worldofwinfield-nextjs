import Container from "./container";
import { EXAMPLE_PATH } from "../lib/constants";

export default function Alert({ preview }) {
  return (
    <div>
      <Container>
        <div>
          {preview ? (
            <>
              This is a page preview. <a href='/api/exit-preview'>Click here</a>{" "}
              to exit preview mode.
            </>
          ) : (
            <></>
          )}
        </div>
      </Container>
    </div>
  );
}
