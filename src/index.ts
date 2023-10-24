import { test as base, type Page, type Request } from "@playwright/test";
import type { Har } from "har-format";
import * as fs from "fs";

export const test = base.extend<{
	advancedRouteFromHAR: (filename: string, options?: RouteFromHAROptions) => Promise<void>;
}>({
	advancedRouteFromHAR: async ({ page }, use) => {
		const originalRouteFromHAR = page.routeFromHAR.bind(page);
		const advancedRouteFromHAR = async (filename: string, options?: RouteFromHAROptions): Promise<void> => {
			if (options?.update) {
				// on update, we want to record the HAR just like the original playwright method
				return originalRouteFromHAR(filename, options);
			} else {
				const har = JSON.parse(await fs.promises.readFile(filename, { encoding: "utf8" }));
				return serveFromHar(
					har,
					{
						...options,
						matcher: options?.matcher ?? defaultMatcher,
					},
					page,
				);
			}
		};

		await use(advancedRouteFromHAR);
	},
});

async function serveFromHar(
	har: Har,
	options: {
		notFound?: "abort" | "fallback";
		url?: string | RegExp;
		matcher: (request: Request, entry: Har["log"]["entries"][0]) => number;
	},
	page: Page,
): Promise<void> {
	options.notFound ??= "abort";
	options.url ??= /.*/;

	test.step("advancedRouteFromHAR", async () => {
		await page.route(options!.url!, async (route) => {
			const entry = findEntry(har, route.request(), options!);
			if (entry === null) {
				if (options?.notFound === "fallback") {
					route.fallback();
				} else {
					route.abort();
				}
			} else {
				route.fulfill({
					status: entry.response.status,
					headers: Object.fromEntries(entry.response.headers.map((header) => [header.name, header.value])),
					body: await parseContent(entry.response.content),
				});
			}
		});
	});
}

function findEntry(
	har: Har,
	request: Request,
	options: {
		matcher: (request: Request, entry: Har["log"]["entries"][0]) => number;
	},
) {
	const scoredEntries = har.log.entries
		.map((entry) => {
			return {
				entry,
				score: (options.matcher ?? defaultMatcher)(request, entry),
			};
		})
		.filter((entry) => entry.score >= 0);
	if (scoredEntries.length === 0) {
		return null;
	}
	const bestEntry = scoredEntries.reduce((a, b) => {
		return a.score > b.score ? a : b;
	});
	return bestEntry.entry;
}

export function defaultMatcher(request: Request, entry: Har["log"]["entries"][0]): number {
	if (request.method() !== entry.request.method) return -1;
	if (request.url() !== entry.request.url) return -1;
	if (["POST", "PUT", "PATCH"].includes(entry.request.method) && request.postData() !== entry.request.postData?.text) {
		return -1;
	}
	return scoreByHeaders(request, entry);
}

function scoreByHeaders(request: Request, entry: Har["log"]["entries"][0]): number {
	const matchingHeaders = Object.entries(entry.request.headers).filter(([name, value]) => {
		return request.headers()[name] === value.value;
	}).length;
	return matchingHeaders;
}

async function parseContent(content?: Har["log"]["entries"][0]["response"]["content"]) {
	if (!content || !content.text) return undefined;
	if (content.encoding === "base64") {
		return Buffer.from(content.text, "base64");
	} else {
		return content.text;
	}
}

type RouteFromHAROptions = {
	/**
	 * - If set to 'abort' any request not found in the HAR file will be aborted.
	 * - If set to 'fallback' missing requests will be sent to the network.
	 *
	 * Defaults to abort.
	 */
	notFound?: "abort" | "fallback";

	/**
	 * If specified, updates the given HAR with the actual network information instead of serving from file. The file is
	 * written to disk when
	 * [browserContext.close()](https://playwright.dev/docs/api/class-browsercontext#browser-context-close) is called.
	 */
	update?: boolean;

	/**
	 * Optional setting to control resource content management. If `attach` is specified, resources are persisted as
	 * separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
	 */
	updateContent?: "embed" | "attach";

	/**
	 * When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page,
	 * cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
	 */
	updateMode?: "full" | "minimal";

	/**
	 * A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the
	 * pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
	 */
	url?: string | RegExp;
	/**
	 * a function that rates the match between a request and an entry in the HAR file.
	 * The function receives the request and the HAR entry and returns a number.
	 * if the number is negative, the entry is not used.
	 * the entry with the highest score will be used to respond to the request.
	 */
	matcher?: (request: Request, entry: Har["log"]["entries"][0]) => number;
};
