import { Matcher, Method } from "../types";
import { scoreByHeaders, jsonEquals } from "./comparators";

/** 
    @experimental
*/
export const customMatcher: CustomMatcher = ({
	methodComparator = (a, b) => a === b,
	urlComparator = (a, b) => a === b,
	postDataComparator = {
		POST: jsonEquals,
	},
}) => {
	const compare: Matcher = (request, entry) => {
		if (!methodComparator(request.method(), entry.request.method)) return -1;
		if (!urlComparator(request.url(), entry.request.url)) return -1;
		const bodyCompare =
			typeof postDataComparator === "function"
				? postDataComparator
				: postDataComparator?.[entry.request.method as Method];
		if (bodyCompare && !bodyCompare(request.postData() ?? "{}", entry.request.postData?.text ?? "{}")) return -1;
		return scoreByHeaders(request.headers(), entry.request.headers);
	};
	return compare;
};

export type CustomMatcher = (options: {
	methodComparator?: (a: string, b: string) => boolean;
	urlComparator?: (a: string, b: string) => boolean;
	postDataComparator?:
		| Partial<{
				[method in Method]: (a: string, b: string) => boolean;
		  }>
		| ((a: string, b: string) => boolean);
}) => Matcher;
