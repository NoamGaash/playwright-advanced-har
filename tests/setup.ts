import { test } from "../lib/index";

test("record", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/demo.playwright.dev.har", {
		update: true,
		updateContent: "embed",
	});
	await page.goto("https://demo.playwright.dev/todomvc");
	await page.close();
});
