import { Content, Har } from "har-format";
import { type Matcher, defaultMatcher } from "..";
import { type Page, type Request, type Route, test } from "@playwright/test";
import path = require("path");
import { promises } from "fs";
import { AdvancedMatcher } from "./types";

export async function serveFromHar(
	har: Har,
	options: {
		notFound?: "abort" | "fallback" | ((route: Route) => Promise<void>);
		url?: string | RegExp;
		matcher: Matcher | AdvancedMatcher;
		dirName: string;
	},
	page: Page,
): Promise<void> {
	options.notFound ??= "abort";
	options.url ??= /.*/;

	test.step(
		"advancedRouteFromHAR",
		async () => {
			await page.route(options.url ?? /.*/, async (route) => {
				let entry = typeof options.matcher === "function" ?
					await findEntry(har, route.request(), options!.matcher) :
					await (options.matcher.findEntry ?? findEntry)(har, route.request(), options!.matcher.matchFunction);
				if("postProcess" in options.matcher && options.matcher.postProcess) {
					entry = options.matcher.postProcess(entry, route);
				}
				if (entry === null) {
					if (options?.notFound === "fallback") {
						route.fallback();
					} else if (typeof options?.notFound === "function") {
						await options?.notFound?.(route);
					} else {
						route.abort();
					}
				} else {
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

export async function findEntry(
	har: Har,
	request: Request,
	matcher: Matcher = defaultMatcher
) {
	// score each entry
	const entriesWithScore = await Promise.all(har.log.entries.map(async (entry) => ({ entry, score: await matcher(request, entry) })));

	// filter out entries with negative scores
	const goodEntries = entriesWithScore.filter(({ score }) => score >= 0);

	const bestEntry = goodEntries.reduce((a, b) => {
		return a.score >= b.score ? a : b;
	}, goodEntries[0]);
	return bestEntry?.entry ?? null;
}

export async function parseContent(
	content: Omit<Content & { _file?: string }, "text"> & { text?: Buffer | string },
	dirName: string = ".",
) {
	if (!content) return undefined;
	if (content._file && !content.text) {
		const contentFilePath = path.join(dirName, content._file);
		content.text = await promises.readFile(contentFilePath);
	}
	if (!content.text) return undefined;
	if (content.encoding === "base64" && typeof content.text === "string") {
		return Buffer.from(content.text, "base64");
	} else {
		return content.text;
	}
}
