import type { APIResponse, Request, Route, Cookie } from "@playwright/test";
import type { Entry } from "har-format";
import type { findEntry } from "./serveFromHar";

export type Matcher = (request: Request, entry: Entry) => number;

export type AdvancedMatcher = {
	findEntry?: typeof findEntry;
	matchFunction?: Matcher;
	postProcess?: (entry: Entry, route?: Route) => Entry;
}

export type Method = "POST" | "GET" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE";

export type RouteFromHAROptions = {
	/**
	 * - If set to 'abort' any request not found in the HAR file will be aborted.
	 * - If set to 'fallback' missing requests will be sent to the network.
	 * - If set to a function, it will be called for each request not found in the HAR file.
	 *
	 * Defaults to abort.
	 */
	notFound?: "abort" | "fallback" | ((route: Route) => Promise<void>);

	/**
	 * If specified, updates the given HAR with the actual network information instead of serving from file. The file is
	 * written to disk when
	 * [browserContext.close()](https://playwright.dev/docs/api/class-browsercontext#browser-context-close) is called.
	 */
	update?: boolean;

	/**
	 * Optional setting to control resource content management. If `attach` is specified, resources are persisted as
	 * separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
	 */
	updateContent?: "embed" | "attach";

	/**
	 * When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page,
	 * cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
	 */
	updateMode?: "full" | "minimal";

	/**
	 * A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the
	 * pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
	 */
	url?: string | RegExp;
	/**
	 * a function that rates the match between a request and an entry in the HAR file.
	 * The function receives the request and the HAR entry and returns a number.
	 * if the number is negative, the entry is not used.
	 * the entry with the highest score will be used to respond to the request.
	 */
	matcher?: Matcher | AdvancedMatcher;
};

export type AdvancedRouteFromHAR = (filename: string, options?: RouteFromHAROptions) => Promise<void>;

export async function requestResponseToEntry(request: Request, resp: APIResponse, requestCookies: Cookie[]): Promise<Entry> {
	const postData = request.postData();
	const body = await resp.body();
	const respHeaders = resp.headers();
	return {
		startedDateTime: new Date().toISOString(),
		time: 0, // TODO: get the actual time
		cache: {},
		timings: {
			send: 0, // TODO: get the actual time
			wait: 0, // TODO: get the actual time
			receive: 0, // TODO: get the actual time
		},
		request: {
			httpVersion: "HTTP/2.0", // TODO: is it possible to get this from playwright?
			bodySize: postData ? postData.length : 0,
			cookies: requestCookies.map((cookie) => ({
				...cookie,
				expires: cookie.expires?.toString(),
			})),
			headersSize: -1, // TODO: get the actual size
			queryString: Object.entries(request.url().split("?")[1] ?? {}).map(([name, value]) => ({ name, value })),
			url: request.url(),
			method: request.method(),
			headers: Object.entries(request.headers()).map(([name, value]) => ({ name, value })),
			postData: postData ? {
				text: postData,
				mimeType: request.headers()["content-type"],
			} : undefined,
		},
		response: {
			httpVersion: "HTTP/2.0", // TODO: is it possible to get this from playwright?
			bodySize: body.length,
			cookies: respHeaders["set-cookie"]?.split(";").map((cookie) => {
				const [name, value] = cookie.split("=");
				return { name, value };
			}),
			headersSize: -1, // TODO: get the actual size
			content: {
				text: body.toString(),
				size: body.length,
				mimeType: respHeaders["content-type"],
			},
			headers: Object.entries(resp.headers()).map(([name, value]) => ({ name, value })),
			redirectURL: resp.url(),
			status: resp.status(),
			statusText: resp.statusText(),
		},
	};
}
