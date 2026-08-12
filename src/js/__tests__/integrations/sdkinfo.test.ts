import type { Client, Event } from '@sentry/core';
import { sdkInfoIntegration } from '../../integrations/sdkinfo';
import { SDK_NAME, SDK_VERSION } from '../../version';

const stubClient = (sendDefaultPii: boolean): Client =>
  ({
    getOptions: () => ({ sendDefaultPii }),
  }) as Client;

describe('SdkInfo Integration', () => {
  it('should have correct name', () => {
    const integration = sdkInfoIntegration();
    expect(integration.name).toBe('SdkInfo');
  });

  it('should patch event sdk info correctly with sendDefaultPii true', async () => {
    const integration = sdkInfoIntegration();

    const event = { sdk: { packages: [] } } as Event;
    const processedEvent = await integration.processEvent!(event, {}, stubClient(true));

    expect(processedEvent.platform).toBe('javascript');
    expect(processedEvent.sdk?.name).toBe(SDK_NAME);
    expect(processedEvent.sdk?.version).toBe(SDK_VERSION);
    expect(processedEvent.sdk?.packages).toContainEqual({
      name: 'npm:sentry-cordova',
      version: SDK_VERSION,
    });
    expect((processedEvent.sdk as { settings?: { infer_ip?: string } })?.settings?.infer_ip).toBe('auto');
  });

  it('should patch event sdk info correctly with sendDefaultPii false', async () => {
    const integration = sdkInfoIntegration();

    const event = { sdk: {} } as Event;
    const processedEvent = await integration.processEvent!(event, {}, stubClient(false));

    expect((processedEvent.sdk as { settings?: { infer_ip?: string } })?.settings?.infer_ip).toBe('never');
  });

  it('should preserve existing sdk settings', async () => {
    const integration = sdkInfoIntegration();

    const event = {
      sdk: {
        packages: [],
        settings: { debug: true },
      },
    } as unknown as Event;
    const processedEvent = await integration.processEvent!(event, {}, stubClient(true));

    expect((processedEvent.sdk as { settings?: Record<string, unknown> })?.settings).toEqual({
      infer_ip: 'auto',
      debug: true,
    });
  });
});
