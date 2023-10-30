import { Matcher } from "../types";
import { jsonEquals, scoreByHeaders } from "./comparators";

export const defaultMatcher: Matcher = (request, entry) => {
	if (request.method() !== entry.request.method) return -1;
	if (request.url() !== entry.request.url) return -1;
	if (["POST"].includes(entry.request.method)) {
		const reqData = request.postData() ?? "{}";
		const entryData = entry.request.postData?.text ?? "{}";
		if (!jsonEquals(reqData, entryData)) return -1;
	}
	return scoreByHeaders(request.headers(), entry.request.headers);
};
