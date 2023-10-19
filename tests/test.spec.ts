import { expect, type Page } from '@playwright/test';
import { test } from '..';
import fs from 'fs';

test("sanity", async ({ page }) => {
    await page.routeFromHAR('tests/har/demo-todo-app.har', {
        update: false,
        updateContent: 'embed',
    });
    await page.goto('https://demo.playwright.dev/todomvc');
});

test("record", async ({ page }) => {
    await page.routeFromHAR('tests/har/temp-record.har', {
        update: true,
        updateContent: 'embed',
    });
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.close();
    const data = await fs.promises.readFile('tests/har/temp-record.har', { encoding: 'utf8' });
    const har = JSON.parse(data);
    expect(har.log.entries.length).toBeGreaterThan(0);
    expect(har.log.entries[0].request.url).toBe('https://demo.playwright.dev/todomvc');
    expect(har.log.entries[0].response.status).toBeGreaterThanOrEqual(200);
    expect(har.log.entries[0].response.status).toBeLessThan(400);
    fs.rmSync('tests/har/temp-record.har');
});



