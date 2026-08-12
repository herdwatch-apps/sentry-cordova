import type { Event } from '@sentry/core';
import { defineIntegration } from '@sentry/core';
import { normalizeData } from '../normalize';

/** Default Breadcrumbs instrumentation. */
export const cordovaIntegration = defineIntegration(() => {
  return {
    name: 'Cordova',
    processEvent(event) {
      return normalizeData(event) as Event;
    },
  };
});
