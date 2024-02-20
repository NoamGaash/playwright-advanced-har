import { test as base } from "@playwright/test";
import * as fs from "fs";
import { AdvancedRouteFromHAR, requestResponseToEntry } from "./utils/types";
import { parseContent, serveFromHar } from "./utils/serveFromHar";
import { defaultMatcher } from "./utils/matchers/defaultMatcher";
export { Matcher, AdvancedRouteFromHAR } from "./utils/types";
export { defaultMatcher } from "./utils/matchers/defaultMatcher";
export { customMatcher } from "./utils/matchers/customMatcher";
import * as path from "path";

export const test = base.extend<{
	advancedRouteFromHAR: AdvancedRouteFromHAR;
}>({
	advancedRouteFromHAR: async ({ page }, use) => {
		const originalRouteFromHAR = page.routeFromHAR.bind(page);
		const advancedRouteFromHAR: AdvancedRouteFromHAR = async (filename, options) => {
			if (options?.update) {
				const {matcher} = options;
				if (matcher && "postProcess" in matcher) {
					await page.route(options.url || /.*/, async (route, request) => {
						const resp = await route.fetch();
						const response = matcher.postProcess?.(await requestResponseToEntry(request, resp, await page.context().cookies())).response;
						if(response)
							route.fulfill({
								status: response.status,
								headers: Object.fromEntries(response.headers.map((header) => [header.name, header.value])),
								body: await parseContent(response.content, path.dirname(filename)),
							});
					});
				}
				// on update, we want to record the HAR just like the original playwright method
				return originalRouteFromHAR(filename, {
					update: true,
					updateContent: options?.updateContent,
					updateMode: options?.updateMode,
				});
			} else {
				const har = JSON.parse(await fs.promises.readFile(filename, { encoding: "utf8" }));
				return serveFromHar(
					har,
					{
						...options,
						matcher: options?.matcher ?? defaultMatcher,
						dirName: path.dirname(filename),
					},
					page,
				);
			}
		};

		await use(advancedRouteFromHAR);
	},
});
