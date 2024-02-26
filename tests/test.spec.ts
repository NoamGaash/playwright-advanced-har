import { expect } from "@playwright/test";
import { defaultMatcher, test } from "../lib/index";
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

test("sanity with content attached", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/demo-todo-app-attachments/attached.har", {
		update: false,
		updateContent: "attach",
	});
	await page.goto("https://www.example.com");
	await page.getByRole("heading", { name: "Example Domain" }).waitFor();
});

test("only css was recorded", async () => {
	const fileContent = await waitForFile("tests/har/temp/demo.playwright.dev.css.har");
	const har = JSON.parse(fileContent);
	expect(har.log.entries.length).toBeGreaterThan(0);
	for (const entry of har.log.entries) {
		expect(entry.request.url).toMatch(/.*\.css/);
	}
});

test("validate recorded har", async ({}) => {
	const data = await waitForFile("tests/har/temp/demo.playwright.dev.har");
	const har = JSON.parse(data);
	expect(har.log.entries.length).toBeGreaterThan(0);
	expect(har.log.entries[0].request.url).toBe("https://demo.playwright.dev/todomvc");
	expect(har.log.entries[0].response.status).toBeGreaterThanOrEqual(200);
	expect(har.log.entries[0].response.status).toBeLessThan(400);
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

test("largest number", async ({ page, advancedRouteFromHAR }) => {
	// the file contains 3 responses - 42, 1234, 5
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: (request, entry) => {
			if (defaultMatcher(request, entry) >= 0) {
				return Number(entry.response.content.text);
			}
			return -1;
		},
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("1234").waitFor();
});

test("ignore port number", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/different-port.har", {
		matcher: (request, entry) => {
			const reqUrl = new URL(request.url());
			const entryUrl = new URL(entry.request.url);
			reqUrl.port = "80";
			entryUrl.port = "80";
			if (
				reqUrl.toString() === entryUrl.toString() &&
				request.method() === entry.request.method &&
				request.postData() == entry.request.postData?.text
			) {
				return 1;
			}
			console.log("no match", reqUrl.toString(), entryUrl.toString());
			return -1;
		},
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText("from different port").waitFor();
});

test("ignore search params", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/different-search-params.har", {
		matcher: (request, entry) => {
			const reqUrl = new URL(request.url());
			const entryUrl = new URL(entry.request.url);
			reqUrl.search = "";
			entryUrl.search = "";
			if (
				reqUrl.toString() === entryUrl.toString() &&
				request.method() === entry.request.method &&
				request.postData() == entry.request.postData?.text
			) {
				return 1;
			}
			console.log("no match", reqUrl.toString(), entryUrl.toString());
			return -1;
		},
	});
	await page.goto("https://noam-gaash.co.il?search=1");
	await page.getByText("from different search params").waitFor();
});

test("pick arbirtrary response", async ({ page, advancedRouteFromHAR }) => {
	// good when you're testing a long polling requests
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: (request, entry) => {
			if (defaultMatcher(request, entry) >= 0) {
				return Math.random();
			}
			return -1;
		},
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

async function waitForFile(path: string) {
	for (let attempt = 0; attempt < 10; attempt++) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
			const data = await fs.promises.readFile(path, { encoding: "utf8" });
			return data;
		} catch {
			void 0;
		}
	}
	throw "can't read file";
}

test("test a joke recording with postprocess", async ({ page, advancedRouteFromHAR }) => {
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

test("test a joke recording with different postprocess that was not recorded", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/joke-postprocess.har", {
		update: true,
		updateContent: "embed",
		matcher: {
			postProcess(entry) {
				entry.response.content.text = "This is not a joke";
				return entry;
			}
		}
	});
	await page.goto("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
	await page.waitForSelector("text=This is not a joke");
	await page.close();
});

test("test a postprocess that change only part of the output", async ({ page, advancedRouteFromHAR }) => {
	await advancedRouteFromHAR("tests/har/temp/joke-postprocess.har", {
		update: true,
		updateContent: "embed",
		matcher: {
			postProcess(entry) {
				const json = JSON.parse(entry.response.content.text ?? "{}");
				json.flags.custom = true;
				entry.response.content.text = JSON.stringify(json);
				return entry;
			}
		}
	});
	await page.goto("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
	const flags = await page.evaluate(() => {
		return JSON.parse(document.body.textContent ?? "{}").flags;
	});
	expect(flags.custom).toBe(true);
	expect(flags.nsfw).toBe(false);
	await page.close();
});


