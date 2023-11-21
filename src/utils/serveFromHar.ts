import { Content, Entry, Har } from "har-format";
import { Matcher } from "..";
import { Page, Request, Route, test } from "@playwright/test";
import path = require("path");
import { promises } from "fs";

export async function serveFromHar(
	har: Har,
	options: {
		notFound?: "abort" | "fallback" | ((route: Route) => Promise<void>);
		found?: (entry: Readonly<Entry>) => Promise<Entry>;
		url?: string | RegExp;
		matcher: Matcher;
		dirName: string;
	},
	page: Page,
): Promise<void> {
	options.notFound ??= "abort";
	options.url ??= /.*/;

	test.step(
		"advancedRouteFromHAR",
		async () => {
			await page.route(options.url!, async (route) => {
				let entry = findEntry(har, route.request(), options!);
				if (entry === null) {
					if (options.notFound === "fallback") {
						route.fallback();
					} else if (typeof options.notFound === "function") {
						await options.notFound(route);
					} else {
						route.abort();
					}
				} else {
					entry = (await options.found?.(entry)) ?? entry;
					route.fulfill({
						status: entry.response.status,
						headers: Object.fromEntries(entry.response.headers.map((header) => [header.name, header.value])),
						body: await parseContent(entry.response.content, options.dirName),
					});
				}
			});
		},
		{ box: true },
	);
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
	}, goodEntries[0]);
	return bestEntry?.entry ?? null;
}

async function parseContent(content: Content & { _file?: string }, dirName: string = ".") {
	if (!content) return undefined;
	if (content._file && !content.text) {
		const contentFilePath = path.join(dirName, content._file);
		content.text = await promises.readFile(contentFilePath, {
			encoding: "utf8",
		});
	}
	if (!content.text) return undefined;
	if (content.encoding === "base64") {
		return Buffer.from(content.text, "base64");
	} else {
		return content.text;
	}
}
