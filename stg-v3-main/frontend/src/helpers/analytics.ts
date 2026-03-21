export function track(
  eventNameOrPayload?: Parameters<typeof umami.track>[0],
  eventData?: Parameters<typeof umami.track>[1],
): void {
  if (typeof umami !== 'undefined') {
    void umami.track(eventNameOrPayload, eventData);
  }
}
