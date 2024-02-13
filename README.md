# 🎭 playwright-advanced-har

[![npm version](https://img.shields.io/npm/v/playwright-advanced-har.svg)](https://www.npmjs.com/package/playwright-advanced-har) [![Build and test the library](https://github.com/NoamGaash/playwright-advanced-har/actions/workflows/test.yml/badge.svg)](https://github.com/NoamGaash/playwright-advanced-har/actions/workflows/test.yml)

Playwright-advanced-har is a library that allows various use-cases for network record-and-playback, including:

- ignoring post data and get arguments
- ignoring the base-url when serving HAR files (good when you record network in test environment and play on staging/production)
- ignoring aborted requests and requests that had errors

# install

```bash
npm install playwright-advanced-har
```

# usage

The `playwright-advanced-har` provides a playwright fixture called `advancedRouteFromHAR`.
Here is an example of using a custom matcher to ignore `500` status code errors:

```typescript
import { test, defaultMatcher, customMatcher } from "playwright-advanced-har";

test("don't route responses that have errors", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/first-has-error.har", {
		matcher: (request, entry) => {
			if (entry.response.status >= 500 && entry.response.status < 600) {
				return -1;
			}
			return defaultMatcher(request, entry);
		},
	});

	await page.goto("https://noam-gaash.co.il");
	await page.getByText("Hello World").waitFor();
});
```

The `matcher` arguments is a callback function that receives the request and the HAR entry and returns a number.
The number indicates how "good" the response is. Negative numbers (such as `-1`) tells the router to ignore the entry, while positive numbers indicates the entry is a qualified candidate to be routed from.

## examples

ignoring port numbers:

```typescript
test("ignore port number", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/different-port.har", {
		matcher: customMatcher({
			urlComparator(a, b) {
				a = a.replace(/:\d+/, "");
				b = b.replace(/:\d+/, "");
				return a === b;
			},
		}),
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("from different port").waitFor();
});
```

choosing arbitrary responses:

```typescript
test("pick arbirtrary response", async ({ page, advancedRouteFromHAR }) => {
	// good when you're testing a long polling requests
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: customMatcher({
			scoring() {
				return Math.random();
			},
		}),
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("1234").waitFor();
});
```

apply post-proccessing on the chosen HAR entry:

```typescript
test("get the largest number... squared!", async ({ page, advancedRouteFromHAR }) => {
	// the file contains 3 responses - 42, 1234, 5
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: {
			postProcess(entry) {
				entry.response.content.text = (parseInt(entry.response.content.text || "0") ** 2).toString();
				return entry;
			},
			matchFunction: customMatcher({
				scoring: (request, entry) => parseInt(entry.response.content.text || "0"),
			}),
		}
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText((1234**2).toString()).waitFor();
});
```

for more examples, please see our `tests` directory

# Contribution

Contributions are welcome!
Please open an issue with a use-case before opening a PR, so we can discuss it. Make sure you add tests and run `npm run test` before commiting.

## Install dependencies

```bash
npm install
```

## Run tests

```bash
npm test
```
