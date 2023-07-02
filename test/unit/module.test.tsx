import { fireEvent, screen } from "@testing-library/react";

import { it, expect, describe, jest } from "@jest/globals";
import { LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { renderTestApp } from "./helper";
import beforeEach from "node:test";
import { router } from "../../src/server/routes";

const mockApi = {
  products: [{ data: [{ id: 1, name: "Test Product", price: 100 }] }],
  details: {
    1: [
      {
        data: {
          id: 1,
          name: "Test Product",
          price: 100,
          color: "Test Color",
          material: "Test Material",
          description: "Test Product",
        },
      },
    ],
  },
  latestOrderId: [{ data: { id: 1 } }],
};

const mockState = {
  cart: {},
  details: {},
};

describe("Проверка работы корзины", () => {
  beforeEach(() => jest.clearAllMocks());
  it("Пустая корзина должна рендериться", () => {
    const [store, component] = renderTestApp({
      initialEntries: "/cart",
      mockApi,
      mockState,
    });

    expect(component).toMatchSnapshot();
  });
  it("Не пустая корзина должна рендериться", () => {
    const mockProduct = { name: "Test Product", count: 1, price: 100 };
    const [store, component] = renderTestApp({
      initialEntries: "/cart",
      mockApi,
      mockState,
    });

    (store as any).dispatch({ type: "ADD_TO_CART", product: mockProduct });

    expect(component).toMatchSnapshot();
  });
  it("Если заполнить форму корректно, то закак оформиться успешно", () => {
    const mockProduct = { name: "Test Product", count: 1, price: 100 };

    const [store, component] = renderTestApp({
      initialEntries: "/cart",
      mockApi,
      mockState,
    });

    (store as any).dispatch({ type: "ADD_TO_CART", product: mockProduct });

    expect(component).toMatchSnapshot();

    const input = {
      name: "Dias",
      phone: "+77777777777",
      address: "Some address",
    };
    const input_name = screen.getByTestId("input-name");
    const input_phone = screen.getByTestId("input-phone");
    const input_address = screen.getByTestId("input-address");
    const button_submit = screen.getByTestId("button-submit");

    fireEvent.change(input_name, { target: { value: input.name } });
    fireEvent.change(input_phone, { target: { value: input.phone } });
    fireEvent.change(input_address, { target: { value: input.address } });
    fireEvent.click(button_submit);
    expect(component).toMatchSnapshot();
  });
});

describe("Проверка каталога продуктов", () => {
  it("если выбрать продукт и добавить в корзину, то он в ней отобразиться и не исчезнет при обновлении", async () => {
    const [store, component] = renderTestApp({
      initialEntries: "/catalog",
      mockApi,
      mockState,
    });
    expect(component).toMatchSnapshot();
    const button_product = screen.getByText("Details");
    fireEvent.click(button_product);
    expect(component).toMatchSnapshot();
    const button_add = screen.getByTestId("button-add");

    fireEvent.click(button_add);
    expect(screen.getByTestId("nav-link-cart").textContent).toContain("(1)");
    const localcart = await JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_CART_KEY) ?? "{}"
    );
    expect(localcart).toStrictEqual({
      "1": { count: 1, name: "Test Product", price: 100 },
    });
  });
});
