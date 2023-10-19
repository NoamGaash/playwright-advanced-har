import { test as base } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        const originalRouteFromHAR = page.routeFromHAR.bind(page);
        page.routeFromHAR =(har: string, options?: {
            /**
             * - If set to 'abort' any request not found in the HAR file will be aborted.
             * - If set to 'fallback' missing requests will be sent to the network.
             *
             * Defaults to abort.
             */
            notFound?: "abort"|"fallback";
        
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
            updateContent?: "embed"|"attach";
        
            /**
             * When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page,
             * cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
             */
            updateMode?: "full"|"minimal";
        
            /**
             * A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the
             * pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
             */
            url?: string|RegExp;
          }): Promise<void> => {
            return originalRouteFromHAR(har, options);
          }

        await use(
            page
        );
    },
});
