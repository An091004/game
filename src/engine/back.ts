import { MOBILE, parentPage } from "../data/mobile";

export function createBackHandler(deps: {
  closeDialog: () => boolean;
  page: () => string;
  navigate: (page: string) => void;
  hint: () => void;
  flush: () => Promise<boolean>;
  exit: () => Promise<void>;
  failed: () => void;
  now?: () => number;
}) {
  let armedAt: number | null = null;
  let exiting = false;
  const reset = () => {
    armedAt = null;
  };
  return {
    reset,
    async press() {
      if (exiting) return;
      if (deps.closeDialog()) {
        reset();
        return;
      }
      if (deps.page() !== "practice") {
        reset();
        deps.navigate(parentPage(deps.page()));
        return;
      }
      const now = deps.now?.() ?? performance.now();
      if (
        armedAt === null ||
        now < armedAt ||
        now - armedAt > MOBILE.exitWindowMs
      ) {
        armedAt = now;
        deps.hint();
        return;
      }
      reset();
      exiting = true;
      try {
        if (await deps.flush()) await deps.exit();
        else deps.failed();
      } catch {
        deps.failed();
      } finally {
        exiting = false;
      }
    },
  };
}
