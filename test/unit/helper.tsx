import React from "react";

import { render } from "@testing-library/react";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { jest } from "@jest/globals";

export const renderTestApp = (options: {
  initialEntries: string;
  mockApi: any;
  mockState: any;
}) => {
  const api = new ExampleApi("/");
  jest.spyOn(api, "getProducts").mockImplementation(() => {
    return options.mockApi.products;
  });
  jest.spyOn(api, "getProductById").mockImplementation((id) => {
    return options.mockApi.details[id];
  });
  jest.spyOn(api, "checkout").mockImplementation((form, cart) => {
    return options.mockApi.latestOrderId;
  });
  const cart = new CartApi();
  cart.setState(options.mockState.cart);
  const store = initStore(api, cart);

  return [
    store,
    render(
      <MemoryRouter initialEntries={[options?.initialEntries]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    ),
  ];
};
