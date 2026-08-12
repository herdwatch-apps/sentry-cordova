import { defineIntegration } from '@sentry/core';

/** Default EventOrigin instrumentation. */
export const eventOriginIntegration = defineIntegration(() => {
  return {
    name: 'EventOrigin',
    processEvent(event) {
      event.tags = event.tags ?? {};

      event.tags['event.origin'] = 'cordova';
      event.tags['event.environment'] = 'javascript';

      return event;
    },
  };
});
