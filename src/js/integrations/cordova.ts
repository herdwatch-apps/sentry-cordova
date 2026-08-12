import type { Event, Integration } from '@sentry/core';
import { addEventProcessor } from '@sentry/core';
import { normalizeData } from '../normalize';

/** Default Breadcrumbs instrumentations */
export class Cordova implements Integration {
  /**
   * @inheritDoc
   */
  public static id: string = 'Cordova';

  /**
   * @inheritDoc
   */
  public name: string = Cordova.id;

  /**
   * @inheritDoc
   */
  public setupOnce(): void {
    addEventProcessor((event: Event) => {
      return normalizeData(event) as Event;
    });
  }
}
