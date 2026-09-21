import { onBeforeUnmount, ref } from 'vue';

/**
 * Share-or-copy with a transient `copied` flag the caller can read to flash
 * a confirmation icon. The timer is cleared on unmount so a stale callback
 * can't tick against a torn-down component.
 *
 * Behaviour:
 * - `navigator.share` present (mobile / Safari): hand the URL off to the
 *   native share sheet. On `AbortError` (user dismissed) do nothing; on
 *   any other failure fall through to clipboard.
 * - Otherwise: copy to clipboard. Clipboard failure (non-HTTPS context,
 *   permission denied) returns silently — we don't want to surface an alert
 *   the user can't fix.
 */
export function useShare() {
  const copied = ref(false);
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;

  async function share(url: string, title: string): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share({ title, url });
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      // Other share() failures (browser bug, bad permissions) — fall through.
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copied.value = false;
    }, 1500);
  }

  onBeforeUnmount(() => {
    clearTimeout(copiedTimer);
  });

  return { copied, share };
}