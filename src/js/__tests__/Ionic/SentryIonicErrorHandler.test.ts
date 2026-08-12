import * as core from '@sentry/core';
import { withSentryIonicErrorHandler } from '../../Ionic/SentryIonicErrorHandler';

// `@sentry/core@10.70.0`'s rollup-built CJS output does not set `__esModule`, so TypeScript's
// `__importStar` interop helper wraps `import * as core` in non-configurable getters -- which makes
// `jest.spyOn(core, 'captureException')` throw "Cannot redefine property" even though the real
// module's own export is a plain writable/configurable property. Mocking the module instead of
// spying on the namespace import sidesteps that interop wrapping entirely.
jest.mock('@sentry/core', () => ({
  ...jest.requireActual('@sentry/core'),
  captureException: jest.fn(),
}));

const captureException = core.captureException as jest.Mock;

describe('Global Ionic error handler', () => {
  const originalHandleError = jest.fn();
  class MockClass {
    // Class method so it can be called via super
    handleError(error: any) {
      originalHandleError(error);
    }
  }

  it('Calls captureException on error handler triggered', () => {
    const SentryIonicErrorHandler = withSentryIonicErrorHandler(MockClass);
    const errorHandler = new SentryIonicErrorHandler();

    const error = new Error('Test Error');
    errorHandler.handleError(error);

    expect(originalHandleError).toHaveBeenLastCalledWith(error);
    expect(captureException).toHaveBeenLastCalledWith(error);
  });

  it('Calls captureException with originalException if exists', () => {
    const SentryIonicErrorHandler = withSentryIonicErrorHandler(MockClass);
    const errorHandler = new SentryIonicErrorHandler();

    const error = new Error('Test Error');
    const originalError = new Error('Original Error');
    Object.assign(error, { originalError });

    errorHandler.handleError(error);

    expect(originalHandleError).toHaveBeenLastCalledWith(error);
    expect(captureException).toHaveBeenLastCalledWith(originalError);
  });
});
