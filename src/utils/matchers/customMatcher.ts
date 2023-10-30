import { Matcher, Method } from "../types";
import { scoreByHeaders, jsonEquals } from "./comparators";

/** 
    @experimental
*/
export const customMatcher: CustomMatcher = (options = defaultArgs) => {
	const { methodComparator, urlComparator, postDataComparator, scoring } = { ...defaultArgs, ...options };
	const compare: Matcher = (request, entry) => {
		if (!methodComparator(request.method(), entry.request.method)) return -1;
		if (!urlComparator(request.url(), entry.request.url)) return -1;
		const bodyCompare =
			typeof postDataComparator === "function"
				? postDataComparator
				: postDataComparator?.[entry.request.method as Method];
		if (bodyCompare && !bodyCompare(request.postData() ?? "{}", entry.request.postData?.text ?? "{}")) return -1;
		return scoring(request, entry);
	};
	return compare;
};

const defaultArgs: {
	methodComparator: (a: string, b: string) => boolean;
	urlComparator: (a: string, b: string) => boolean;
	postDataComparator:
		| Partial<{
				[method in Method]: (a: string, b: string) => boolean;
		  }>
		| ((a: string, b: string) => boolean);
	scoring: Matcher;
} = {
	methodComparator: (a, b) => a === b,
	urlComparator: (a, b) => a === b,
	postDataComparator: {
		POST: jsonEquals,
	},
	scoring: (request, entry) => scoreByHeaders(request.headers(), entry.request.headers),
};

export type CustomMatcher = (options?: Partial<typeof defaultArgs>) => Matcher;
