import type { BrowserOptions } from '@sentry/browser';
import { init as browserInit } from '@sentry/browser';
import { getClient, GLOBAL_OBJ } from '@sentry/core';
import { cordovaIntegration, eventOriginIntegration, sdkInfoIntegration } from './integrations';
import type { CordovaOptions } from './options';
import { CordovaScope } from './scope';
import { makeCordovaTransport } from './transports/cordova';
import { CordovaPlatformType } from './types';
import { getPlatform } from './utils';
import { NATIVE } from './wrapper';

const DEFAULT_OPTIONS: CordovaOptions = {
  enableNative: true,
  enableAutoSessionTracking: true,
  enableNdkScopeSync: false,
  attachThreads: false,
};

/**
 * Inits the SDK
 */
export function init(options: Partial<CordovaOptions>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const window = GLOBAL_OBJ as { SENTRY_RELEASE?: { id?: string } };

  if (options.enableWatchdogTerminationTracking !== null) {
    // eslint-disable-next-line deprecation/deprecation
    options.enableWatchdogTerminationTracking = options.enableOutOfMemoryTracking;
  }

  const finalOptions = {
    enableAutoSessionTracking: true,
    enableWatchdogTerminationTracking: true,
    ...DEFAULT_OPTIONS,
    release: window?.SENTRY_RELEASE?.id,
    ...options,
  };

  if (finalOptions.enabled === false || NATIVE.platform === 'browser') {
    finalOptions.enableNative = false;
    finalOptions.enableNativeNagger = false;
  } else {
    // keep the original value if user defined it.
    if (finalOptions.enableNativeNagger === undefined) {
      finalOptions.enableNativeNagger = true;
    }
    if (finalOptions.enableNative === undefined) {
      finalOptions.enableNative = true;
    }

    if (getPlatform() !== CordovaPlatformType.Ios) {
      delete finalOptions.appHangTimeoutInterval;
      delete finalOptions.enableAppHangTracking;
    }
  }

  // CordovaScope exists to sync scope updates (user/tags/breadcrumbs/context) down to the native
  // SDKs, but nothing currently installs it as the active scope, so native scope sync is inert.
  // This has been the case since the v7->v8 upgrade removed the `makeMain` call that used to wire
  // it in. Left in place, uninstalled, as a deliberate no-op -- see follow-up F1.
  const cordovaScope = new CordovaScope();
  const client = getClient();
  cordovaScope.setClient(client);

  finalOptions.defaultIntegrations = [sdkInfoIntegration(), eventOriginIntegration(), cordovaIntegration()];

  if (!options.transport && finalOptions.enableNative) {
    finalOptions.transport = options.transport || makeCordovaTransport;
  }

  const browserOptions = {
    ...finalOptions,
  } as BrowserOptions;

  const mobileOptions = {
    ...finalOptions,
    enableAutoSessionTracking: NATIVE.platform !== 'browser' && finalOptions.enableAutoSessionTracking,
  } as CordovaOptions;

  // We first initialize the NATIVE SDK to avoid the Javascript SDK to invoke any
  // feature from the NATIVE SDK without the options being set.
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  void NATIVE.startWithOptions(mobileOptions);
  browserInit(browserOptions);
}

/**
 * If native client is available it will trigger a native crash.
 * Use this only for testing purposes.
 */
export function nativeCrash(): void {
  if (NATIVE.isNativeClientAvailable()) {
    NATIVE.crash();
  }
}
