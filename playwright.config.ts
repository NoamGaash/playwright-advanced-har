import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "setup",
			use: { ...devices["Desktop Chrome"] },
			testMatch: /tests\/setup\.spec\.ts/,
		},
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
			dependencies: ["setup"],
			teardown: "delete temp har files",
			testMatch: /tests\/(?!setup|teardown).+\.spec\.ts/,
		},
		{
			name: "delete temp har files",
			use: { ...devices["Desktop Chrome"] },
			testMatch: /tests\/teardown\.spec\.ts/,
		}
	],
});
