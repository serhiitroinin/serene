import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { startSyncScheduler } from "./server/sync/scheduler";

let bootstrapped = false;
function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  try {
    startSyncScheduler();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[serene] scheduler boot failed:", err);
  }
}

export default createServerEntry({
  fetch(request) {
    bootstrap();
    return handler.fetch(request);
  },
});
