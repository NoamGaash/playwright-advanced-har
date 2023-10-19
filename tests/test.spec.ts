import { expect, type Page } from '@playwright/test';
import { test } from '..';


test("sanity", async ({ page }) => {
    await page.routeFromHAR('tests/har/demo-todo-app.har', {
        update: false,
        updateContent: 'embed',
    });
    await page.goto('https://demo.playwright.dev/todomvc');
});


