import { Har } from "har-format";
import { Matcher } from "..";
import { Page, Request, test } from "@playwright/test";

export async function serveFromHar(
	har: Har,
	options: {
		notFound?: "abort" | "fallback";
		url?: string | RegExp;
		matcher: Matcher;
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
		matcher: Matcher;
	},
) {
	// score each entry
	const entriesWithScore = har.log.entries.map((entry) => ({ entry, score: options.matcher(request, entry) }));

	// filter out entries with negative scores
	const goodEntries = entriesWithScore.filter(({ score }) => score >= 0);

	const bestEntry = goodEntries.reduce((a, b) => {
		return a.score >= b.score ? a : b;
	});
	return bestEntry.entry;
}

async function parseContent(content?: Har["log"]["entries"][0]["response"]["content"]) {
	if (!content || !content.text) return undefined;
	if (content.encoding === "base64") {
		return Buffer.from(content.text, "base64");
	} else {
		return content.text;
	}
}
