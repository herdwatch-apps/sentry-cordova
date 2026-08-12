export type {
  Breadcrumb,
  RequestEventData,
  SdkInfo,
  Event,
  Exception,
  SeverityLevel,
  StackFrame,
  Stacktrace,
  Thread,
  User,
} from '@sentry/core';

export {
  addEventProcessor,
  addBreadcrumb,
  captureException,
  captureEvent,
  captureMessage,
  getCurrentScope,
  Scope,
  setContext,
  setExtra,
  setExtras,
  setTag,
  setTags,
  setUser,
  startSpan,
  startSpanManual,
  startInactiveSpan,
  withScope,
} from '@sentry/core';

export { replayIntegration, browserTracingIntegration } from '@sentry/browser';

export type { CordovaOptions } from './options';
export { cordovaIntegration, eventOriginIntegration, sdkInfoIntegration } from './integrations';
export { init, nativeCrash } from './sdk';
export { SDK_NAME, SDK_VERSION } from './version';

export { withSentryIonicErrorHandler } from './Ionic/SentryIonicErrorHandler';
