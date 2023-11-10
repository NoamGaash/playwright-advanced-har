import { test as base } from "@playwright/test";
import * as fs from "fs";
import { AdvancedRouteFromHAR } from "./utils/types";
import { serveFromHar } from "./utils/serveFromHar";
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
