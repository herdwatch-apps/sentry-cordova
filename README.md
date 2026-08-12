## Why this fork exists

Forked from [upstream](https://github.com/getsentry/sentry-cordova) because Sentry archived it and no longer maintains it (see the notice below) — we still need it for error reporting on Cordova/Ionic, so we keep it compatible with current native Sentry SDKs ourselves and publish under the `@herdwatch` npm scope.

Published as [`@herdwatch/sentry-cordova`](https://www.npmjs.com/package/@herdwatch/sentry-cordova).

Based on upstream `v1.7.3`. Changes from upstream:
- Upgraded the JS-side Sentry SDK dependency from v7 (`@sentry/core@7.119.1`) to v8 (`@sentry/core@8.55.0`) — upstream's own `main` is still on v7. This meant rewriting every import that used to come from the now-retired `@sentry/types`/`@sentry/utils` packages, since v8 consolidated them into `@sentry/core`.
- Bumped the native `sentry-cocoa` dependency ahead of upstream's own pin and fixed the resulting iOS build break (`SentryOptions+HybridSDKs` category replaced with `SentryOptionsInternal`) — upstream has since made the same native fix independently.
- Republished under the `@herdwatch/sentry-cordova` npm scope.
- Upgraded the JS-side Sentry SDK dependency again, from v8 (`@sentry/core@8.55.0`) to v10 (`@sentry/core@10.70.0`), plus `@sentry/cli` (2→3) and `@sentry/wizard` (3→7). `Sentry.getCurrentHub` is gone (removed upstream in v9), `autoSessionTracking` is gone from `CordovaOptions` (was already a no-op here), and the class-based `Sentry.Integrations.*` are replaced by top-level `cordovaIntegration()` / `eventOriginIntegration()` / `sdkInfoIntegration()` factories. Full details in the CHANGELOG's `Unreleased` → `Breaking Changes` section.
- Bumped the native `sentry-cocoa` dependency again, from 8.58.1 to 9.25.0, and fixed the resulting iOS build break the same way as before (cocoa 9 removed `SentryOptionsInternal` entirely; the bridge now builds `SentryOptions` via `PrivateSentrySDKOnly.optionsWithDictionary:didFailWithError:`). This raises the plugin's **minimum iOS deployment target to 15.0** — consuming apps need `<preference name="deployment-target" value="15.0" />` in their `config.xml`.
- Bumped the native `sentry-android` dependency from 8.13.0 to 8.52.0 (no code changes needed, same major).

<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
      <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

<h1>Official Sentry SDK for Cordova (Ionic, ...)</h1>

> [!IMPORTANT]
> Cordova is being superseded by modern alternatives like [Capacitor](https://ionic.io/resources/articles/capacitor-vs-cordova-modern-hybrid-app-development). This codebase is no longer maintained by Sentry. If you are starting a new project or planning a [migration](https://capacitorjs.com/docs/cordova/migration-strategy), consider using [Sentry Capacitor](https://github.com/getsentry/sentry-capacitor), [Sentry React Native](https://github.com/getsentry/sentry-react-native), or [Sentry Flutter](https://github.com/getsentry/sentry-dart) instead.

===========

_Bad software is everywhere, and we're tired of it. Sentry is on a mission to help developers write better software faster, so we can get back to enjoying technology. If you want to join us [<kbd>**Check out our open positions**</kbd>](https://sentry.io/careers/)_

[![build](https://github.com/getsentry/sentry-cordova/workflows/Build%20&%20Test/badge.svg?branch=main)](https://github.com/getsentry/sentry-cordova/actions?query=branch%3Amain)
[![codecov](https://codecov.io/gh/getsentry/sentry-cordova/branch/master/graph/badge.svg)](https://codecov.io/gh/getsentry/sentry-cordova)
[![npm version](https://img.shields.io/npm/v/sentry-cordova.svg)](https://www.npmjs.com/package/sentry-cordova)
[![npm dm](https://img.shields.io/npm/dm/sentry-cordova.svg)](https://www.npmjs.com/package/sentry-cordova)
[![npm dt](https://img.shields.io/npm/dt/sentry-cordova.svg)](https://www.npmjs.com/package/sentry-cordova)
[![X](https://img.shields.io/twitter/follow/sentry?label=sentry&style=social)](https://x.com/intent/follow?screen_name=sentry)

**This is a beta release**

## Usage

### Cordova in `index.html` `onDeviceReady` function:

```javascript
onDeviceReady: function() {
    ...
    var Sentry = cordova.require("sentry-cordova.Sentry");
    Sentry.init({ dsn: '___PUBLIC_DSN___' });
    ...
}
```

### Ionic in your `app.module.ts`:

```javascript
...
import * as Sentry from 'sentry-cordova';
...
Sentry.init({ dsn: '___PUBLIC_DSN___' });
```

## Documentation

* [Installation](https://docs.sentry.io/platforms/javascript/guides/cordova/#install)
* [Using Sentry with Ionic](https://docs.sentry.io/platforms/javascript/guides/cordova/ionic/)
* [Documentation](https://docs.sentry.io/platforms/javascript/guides/cordova/)

> [!WARNING]
> Example and sample code in is unmaintained. Sample code may contain security vulnerabilities, should never be used in production, and exists only for illustrative purposes.
