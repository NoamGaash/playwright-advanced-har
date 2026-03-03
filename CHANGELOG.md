# Changelog

## [1.5.0](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.4.2...v1.5.0) (2026-03-03)


### Features

* add custom matcher ([1c4c932](https://github.com/NoamGaash/playwright-advanced-har/commit/1c4c93224ec13b6cdbad5b381366ffd271692502))
* add matcher function ([b5e3b89](https://github.com/NoamGaash/playwright-advanced-har/commit/b5e3b89917bb139801abefc15a66b4db177900d2))
* advanced matchers with post-process option ([#11](https://github.com/NoamGaash/playwright-advanced-har/issues/11)) ([b339ad8](https://github.com/NoamGaash/playwright-advanced-har/commit/b339ad85d9ace38376d3617477cf739000f06c60))
* advancedRouteFromHAR fixture ([cd3df02](https://github.com/NoamGaash/playwright-advanced-har/commit/cd3df023e757c94ef0e00bda4b8a066d041f05f4))
* export advancedRouteFromHAR ([#72](https://github.com/NoamGaash/playwright-advanced-har/issues/72)) ([0c784e5](https://github.com/NoamGaash/playwright-advanced-har/commit/0c784e55b80ffe5b6328fca2036da0f6416f579f))
* notFound can get a callback ([41eb6fa](https://github.com/NoamGaash/playwright-advanced-har/commit/41eb6fa844b1735e1a007ae44a73b7d5a3240354))
* support the basic routeFromHAR ([f090736](https://github.com/NoamGaash/playwright-advanced-har/commit/f0907369bbe1c5282e30901ef5d791d88892af2a))


### Bug Fixes

* allow nullish post/put/patch ([f21d69e](https://github.com/NoamGaash/playwright-advanced-har/commit/f21d69e974d30d736797a1391660cdd4e3fba738))
* don't record unnecessary URLs ([#17](https://github.com/NoamGaash/playwright-advanced-har/issues/17)) ([af069d4](https://github.com/NoamGaash/playwright-advanced-har/commit/af069d4765da3c56d09149df9127990f6f8e12c1))
* filter out API requests ([#47](https://github.com/NoamGaash/playwright-advanced-har/issues/47)) ([0782b39](https://github.com/NoamGaash/playwright-advanced-har/commit/0782b391cb135bdc9409a3a77f3f4917bd60d1e4))
* handle empty postdata ([04a7b84](https://github.com/NoamGaash/playwright-advanced-har/commit/04a7b849f39258091d8a130692cc9f8f7487fa0d))
* headers counting ([fb6ce04](https://github.com/NoamGaash/playwright-advanced-har/commit/fb6ce04a6228a80eb17f9e5eadd579f4725e0989))
* ignore put/patch postdata ([56e267f](https://github.com/NoamGaash/playwright-advanced-har/commit/56e267f7e30396c2a00c03f330cfb9840bc8def2))
* lint ([fd1fc95](https://github.com/NoamGaash/playwright-advanced-har/commit/fd1fc95cf2da4829854a021a192c59c1630bae59))
* lint ([a0aa2bc](https://github.com/NoamGaash/playwright-advanced-har/commit/a0aa2bcbe943b2543a57c536ce1008b6e952c882))
* lint ([e448c01](https://github.com/NoamGaash/playwright-advanced-har/commit/e448c019ca5bf91f6916280571d4b102ff6e1d22))
* lint ([1e194de](https://github.com/NoamGaash/playwright-advanced-har/commit/1e194dee0bf34cb0ae84fc654b65126c56c3a504))
* linter definition ([53c04e3](https://github.com/NoamGaash/playwright-advanced-har/commit/53c04e317e4bfeb2b235905f5b37ac166e735d61))
* missing export ([7b846c4](https://github.com/NoamGaash/playwright-advanced-har/commit/7b846c4c6166e3b92076d6d31e9ac733c42285e2))
* move har type to dependencied ([33ba8aa](https://github.com/NoamGaash/playwright-advanced-har/commit/33ba8aa71d825e587c4ffe619bb72501c4de6007))
* postdata json comparing ([4e1fb63](https://github.com/NoamGaash/playwright-advanced-har/commit/4e1fb630ff15ba36e08faed49146fbe6f3e0e4c0))
* postprocess function will work with `update: true` ([#15](https://github.com/NoamGaash/playwright-advanced-har/issues/15)) ([b5d1079](https://github.com/NoamGaash/playwright-advanced-har/commit/b5d10798403da6f26b3269aa85c0f5b02bbe022b))
* published files ([8701a1a](https://github.com/NoamGaash/playwright-advanced-har/commit/8701a1a45b7ec6663a1537b9a0b57410bb62ef32))
* release please ([20815a6](https://github.com/NoamGaash/playwright-advanced-har/commit/20815a6bb43ce5d95848a1a287e9b3d7b2427025))
* remove utf-8 encoding from contents ([c8ac618](https://github.com/NoamGaash/playwright-advanced-har/commit/c8ac6180418a5151e4808e629dab2805f3b1c6a9))
* restore playwright peer dep to ^1.35.0 ([#128](https://github.com/NoamGaash/playwright-advanced-har/issues/128)) ([4bb870a](https://github.com/NoamGaash/playwright-advanced-har/commit/4bb870a556d85253c6db2f9fe0c4ea96737d1556))
* route fallback ([6f859a1](https://github.com/NoamGaash/playwright-advanced-har/commit/6f859a1fd1c33b59108ce9b3f47be40d222cbd40))
* scoring bug ([318bc5a](https://github.com/NoamGaash/playwright-advanced-har/commit/318bc5aba425de4076ae99e2dd8fcea983a00e49))
* skip test ([ed7acec](https://github.com/NoamGaash/playwright-advanced-har/commit/ed7acec74622f0ddd30436928eb6cd9b734bd432))
* support "attached" mode ([543a07d](https://github.com/NoamGaash/playwright-advanced-har/commit/543a07d1966033388ff92859f73dfb9911ee5109))
* support base64 encoding ([a496dac](https://github.com/NoamGaash/playwright-advanced-har/commit/a496dac024651417e5aee24662c896e6e8be8683))
* support empty har records ([7f3c152](https://github.com/NoamGaash/playwright-advanced-har/commit/7f3c152223f28729b1cff0d4334c3227187dabdd))
* test the library ([3671081](https://github.com/NoamGaash/playwright-advanced-har/commit/3671081afaa8d1090f5ec284732cd16fa039ed7a))
* trusted publisher ([#130](https://github.com/NoamGaash/playwright-advanced-har/issues/130)) ([e77e155](https://github.com/NoamGaash/playwright-advanced-har/commit/e77e155ed60b1ba448679887ae6000b7ccbfe479))
* ts compile ([0180c04](https://github.com/NoamGaash/playwright-advanced-har/commit/0180c0434ee7d96ef2c2b657222770d76c01a108))
* tsconfig ([d48977b](https://github.com/NoamGaash/playwright-advanced-har/commit/d48977b47b40742b566dc0f9c117671c066871d6))
* type of RouteFromHAROptions ([26f6dd3](https://github.com/NoamGaash/playwright-advanced-har/commit/26f6dd3e1d2dd2fc7d71e7489fd9628c02d25c45))
* unused matcher ([4316d1d](https://github.com/NoamGaash/playwright-advanced-har/commit/4316d1dd53fdd5cdb58696a2d48fc9976260648a))
* url matching ([68f48e5](https://github.com/NoamGaash/playwright-advanced-har/commit/68f48e5a840fead3cea37add74db3d6c0ee006ae))

## [1.4.2](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.4.1...v1.4.2) (2026-03-03)


### Bug Fixes

* trusted publisher ([#130](https://github.com/NoamGaash/playwright-advanced-har/issues/130)) ([e77e155](https://github.com/NoamGaash/playwright-advanced-har/commit/e77e155ed60b1ba448679887ae6000b7ccbfe479))

## [1.4.1](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.4.0...v1.4.1) (2026-03-03)


### Bug Fixes

* restore playwright peer dep to ^1.35.0 ([#128](https://github.com/NoamGaash/playwright-advanced-har/issues/128)) ([4bb870a](https://github.com/NoamGaash/playwright-advanced-har/commit/4bb870a556d85253c6db2f9fe0c4ea96737d1556))

## [1.4.0](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.3.3...v1.4.0) (2025-05-20)


### Features

* export advancedRouteFromHAR ([#72](https://github.com/NoamGaash/playwright-advanced-har/issues/72)) ([0c784e5](https://github.com/NoamGaash/playwright-advanced-har/commit/0c784e55b80ffe5b6328fca2036da0f6416f579f))

## [1.3.3](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.3.2...v1.3.3) (2024-12-23)


### Bug Fixes

* filter out API requests ([#47](https://github.com/NoamGaash/playwright-advanced-har/issues/47)) ([0782b39](https://github.com/NoamGaash/playwright-advanced-har/commit/0782b391cb135bdc9409a3a77f3f4917bd60d1e4))

## [1.3.2](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.3.1...v1.3.2) (2024-02-26)


### Bug Fixes

* don't record unnecessary URLs ([#17](https://github.com/NoamGaash/playwright-advanced-har/issues/17)) ([af069d4](https://github.com/NoamGaash/playwright-advanced-har/commit/af069d4765da3c56d09149df9127990f6f8e12c1))

## [1.3.1](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.3.0...v1.3.1) (2024-02-20)


### Bug Fixes

* postprocess function will work with `update: true` ([#15](https://github.com/NoamGaash/playwright-advanced-har/issues/15)) ([b5d1079](https://github.com/NoamGaash/playwright-advanced-har/commit/b5d10798403da6f26b3269aa85c0f5b02bbe022b))

## [1.3.0](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.2.2...v1.3.0) (2024-02-14)


### Features

* advanced matchers with post-process option ([#11](https://github.com/NoamGaash/playwright-advanced-har/issues/11)) ([b339ad8](https://github.com/NoamGaash/playwright-advanced-har/commit/b339ad85d9ace38376d3617477cf739000f06c60))

## [1.2.2](https://github.com/NoamGaash/playwright-advanced-har/compare/v1.2.1...v1.2.2) (2023-12-17)


### Bug Fixes

* lint ([fd1fc95](https://github.com/NoamGaash/playwright-advanced-har/commit/fd1fc95cf2da4829854a021a192c59c1630bae59))
* release please ([20815a6](https://github.com/NoamGaash/playwright-advanced-har/commit/20815a6bb43ce5d95848a1a287e9b3d7b2427025))
* remove utf-8 encoding from contents ([c8ac618](https://github.com/NoamGaash/playwright-advanced-har/commit/c8ac6180418a5151e4808e629dab2805f3b1c6a9))
