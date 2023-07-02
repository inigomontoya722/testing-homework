const { assert } = require("chai");
const { describe } = require("node:test");

describe("Верстка меню", async function () {
  it("окно меню должно открываться при нажатии на 'гамбургер', а также закрываться при выборе элемента", async function ({
    browser,
  }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto("http://localhost:3000/hw/store");
    await page.click(".Application-Toggler");
    const menu1 = await this.browser.$(".Application-Menu");
    assert.ok(menu1, "Меню не открывается");
    await page.click(".nav-link");
    const menu2 = await this.browser.$(".Application-Menu");
    const display = await menu2.getCSSProperty("display");
    assert.equal(display.value, "none");
  });
});
describe("Каталог", async function () {
  it("каталог с продуктами рендериться корректно", async function ({
    browser,
  }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto("http://localhost:3000/hw/store/catalog");
    const title = await this.browser.$(".ProductItem-Name").getText();
    assert.notEqual(title, "");
  });
  it("страница продукта рендериться корректно", async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto("http://localhost:3000/hw/store/catalog/1");
    const title1 = await this.browser.$(".ProductDetails-Name").getText();
    assert.ok(title1);
  });
});
