import { test } from "../lib/index";
import fs from "fs";

test("teardown", async ({}) => {
	// clean up
	await fs.promises.rmdir("tests/har/temp", { recursive: true });
});
