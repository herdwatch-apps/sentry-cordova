build:
	cd src/ios && \
  carthage update --use-xcframeworks --platform ios && \
  EXCLUDED_ARCHS=arm64e carthage build --use-xcframeworks --no-use-binaries --platform ios && \
  find Carthage/Build -maxdepth 1 -name '*.xcframework' ! -name 'Sentry.xcframework' -exec rm -rf {} +
