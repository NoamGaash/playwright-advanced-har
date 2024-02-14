import { customMatcher, test } from "../lib/index";

test("largest number squared - using explicit findEntry", async ({ page, advancedRouteFromHAR }) => {
	// the file contains 3 responses - 42, 1234, 5
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: {
			findEntry(har) {
				const chosen = har.log.entries.reduce((max, entry) => {
					const number = parseInt(entry.response.content.text || "0");
					const maxNumber = parseInt(max.response.content.text || "0");
					return number > maxNumber ? entry : max;
				});
				return {
					...chosen,
					response: {
						...chosen.response,
						content: {
							...chosen.response.content,
							text: (parseInt(chosen.response.content.text || "0") ** 2).toString(),
						},
					},
				};
			}
		}
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText((1234**2).toString()).waitFor();
});

test("largest number squared - using postprocess", async ({ page, advancedRouteFromHAR }) => {
	// the file contains 3 responses - 42, 1234, 5
	await advancedRouteFromHAR("tests/har/differentNumbers.har", {
		matcher: {
			postProcess(entry) {
				entry.response.content.text = (parseInt(entry.response.content.text || "0") ** 2).toString();
				return entry;
			},
			matchFunction: customMatcher({
				scoring: (request, entry) => parseInt(entry.response.content.text || "0"),
			}),
		}
	});
	await page.goto("https://noam-gaash.co.il");
	await page.getByText((1234**2).toString()).waitFor();
	await page.reload();
	// note - the postProcess is called again, and the number is squared again each time the response is used
	await page.getByText((1234**4).toString()).waitFor();
});


