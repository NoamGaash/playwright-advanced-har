import { test } from "../lib/index";
import fs from "fs";

test("teardown", async ({}) => {
	// clean up
	await fs.promises.rm("tests/har/temp/demo.playwright.dev.har");
});
