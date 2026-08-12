import type { SdkInfo as SdkInfoType } from '@sentry/core';
import { defineIntegration } from '@sentry/core';
import { SDK_NAME, SDK_VERSION } from '../version';

interface IpPatchedSdkInfo extends SdkInfoType {
  settings?: {
    infer_ip?: 'auto' | 'never';
  };
}

/** Default SdkInfo instrumentation. */
export const sdkInfoIntegration = defineIntegration(() => {
  return {
    name: 'SdkInfo',
    async processEvent(event, _hint, client) {
      event.platform = event.platform || 'javascript';
      const sdk = (event.sdk || {}) as IpPatchedSdkInfo;

      sdk.name = sdk.name || SDK_NAME;
      sdk.packages = [
        ...(event.sdk?.packages || []),
        {
          name: 'npm:sentry-cordova',
          version: SDK_VERSION,
        },
      ];
      sdk.version = SDK_VERSION;

      // eslint-disable-next-line deprecation/deprecation
      const defaultPii = client.getOptions().sendDefaultPii;

      // Patch missing infer_ip.
      sdk.settings = {
        infer_ip: defaultPii ? 'auto' : 'never',
        // purposefully allowing already passed settings to override the default
        ...sdk.settings,
      };

      event.sdk = sdk;

      return event;
    },
  };
});
