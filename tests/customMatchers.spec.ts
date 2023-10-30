import { expect } from "@playwright/test";
import { defaultMatcher, customMatcher, test } from "../lib/index";

test("sanity", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/demo-todo-app.har", { matcher: customMatcher() });
	await page.goto("https://demo.playwright.dev/todomvc");
});

test("sanity with matcher", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/demo-todo-app.har", {
		update: false,
		updateContent: "embed",
		matcher: customMatcher({
			scoring: () => 1,
		}),
	});
	await page.goto("https://demo.playwright.dev/todomvc");
});

test("ignore 500 errors", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/first-has-error.har", {
		matcher: customMatcher({
			scoring(request, entry) {
				if (entry.response.status === 500) {
					return -1;
				}
				return defaultMatcher(request, entry);
			},
		}),
	});
	page.on("response", (response) => {
		expect(response.status()).toBeLessThan(500);
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("Hello World").waitFor();
});

test("get 500 errors", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/first-has-error.har", {
		matcher: customMatcher({
			scoring(request, entry) {
				if (entry.response.status !== 500) {
					return -1;
				}
				return defaultMatcher(request, entry);
			},
		}),
	});
	let gotError = false;
	page.on("response", (response) => {
		expect(response.status()).toBe(500);
		gotError = true;
	});
	await page.goto("https://noam-gaash.co.il");
	expect(gotError).toBe(true);
});

test("largest number", async ({ page, advancedRouteFromHAR }) => {
	// the file contains 3 responses - 42, 1234, 5
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: customMatcher({
			scoring(request, entry) {
				return Number(entry.response.content.text);
			},
		}),
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("1234").waitFor();
});

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

test("ignore search params", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/different-search-params.har", {
		matcher: customMatcher({
			urlComparator(a, b) {
				a = a.replace(/\?.*/, "");
				b = b.replace(/\?.*/, "");
				return a === b;
			},
		}),
	});
	await page.goto("https://noam-gaash.co.il?search=1");
	await page.getByText("from different search params").waitFor();
});

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
	let attempts = 0;
	for (const waitfor of ["1234", "42", "5"]) {
		while ((await page.getByText(waitfor).count()) === 0) {
			attempts++;
			await page.reload();
			if (attempts > 100) {
				// the probability of not getting the right response after 100 attempts is 2/3^100 = 3.8e-48
				throw new Error("too many attempts");
			}
		}
	}
});
