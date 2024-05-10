import { test } from "../lib/index";

test("record", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/demo.playwright.dev.har", {
		update: true,
		updateContent: "embed",
	});
	await page.goto("https://demo.playwright.dev/todomvc");
	await page.close();
});

test("record test with a joke", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/joke.har", {
		update: true,
		updateContent: "embed",
	});
	await page.goto("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
	await page.close();
});

test("record test with a joke and postprocess", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/joke-postprocess.har", {
		update: true,
		updateContent: "embed",
		matcher: {
			postProcess(entry) {
				entry.response.content.text = "This is a joke";
				return entry;
			}
		}
	});
	await page.goto("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
	await page.waitForSelector("text=This is a joke");
	await page.close();
});


test("record not embedded", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/not-embedded.har", {
		update: true,
	});
	await page.goto("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
});
