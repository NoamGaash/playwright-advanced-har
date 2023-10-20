import { expect } from "@playwright/test";
import { defaultMatcher, test } from "../src/index";
import fs from "fs";

test("sanity", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/demo-todo-app.har");
	await page.goto("https://demo.playwright.dev/todomvc");
});

test("sanity with option", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/demo-todo-app.har", {
		update: false,
		updateContent: "embed",
	});
	await page.goto("https://demo.playwright.dev/todomvc");
});

test("record", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp-record.har", {
		update: true,
		updateContent: "embed",
	});
	await page.goto("https://demo.playwright.dev/todomvc");
	await page.close();
	await page.context().close();
	await page.context().browser()?.close();
	const data = await fs.promises.readFile("tests/har/temp-record.har", { encoding: "utf8" });
	const har = JSON.parse(data);
	expect(har.log.entries.length).toBeGreaterThan(0);
	expect(har.log.entries[0].request.url).toBe("https://demo.playwright.dev/todomvc");
	expect(har.log.entries[0].response.status).toBeGreaterThanOrEqual(200);
	expect(har.log.entries[0].response.status).toBeLessThan(400);

	await new Promise((resolve) => setTimeout(resolve, 1000));
	// clean up
	await fs.promises.rm("tests/har/temp-record.har");
});

test("sanity with matcher", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/demo-todo-app.har", {
		update: false,
		updateContent: "embed",
		matcher: () => 1,
	});
	await page.goto("https://demo.playwright.dev/todomvc");
});

test("ignore 500 errors", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/first-has-error.har", {
		update: false,
		updateContent: "embed",

		matcher: (request, entry) => {
			if (entry.response.status === 500) {
				return -1;
			}
			return defaultMatcher(request, entry);
		},
	});
	page.on("response", (response) => {
		expect(response.status()).toBeLessThan(500);
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("Hello World").waitFor();
});

test("get 500 errors", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/first-has-error.har", {
		update: false,
		updateContent: "embed",

		matcher: (request, entry) => {
			if (entry.response.status !== 500) {
				return -1;
			}
			return defaultMatcher(request, entry);
		},
	});
	let gotError = false;
	page.on("response", (response) => {
		expect(response.status()).toBe(500);
		gotError = true;
	});
	await page.goto("https://noam-gaash.co.il");
	expect(gotError).toBe(true);
});
