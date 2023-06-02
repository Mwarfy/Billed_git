/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then", async () => {
      const store = mockStore;
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage,
      });
      const file = new File(["hello.png"], "chucknorris.png", {
        type: "image/png",
      });
      const dataTest = {
        preventDefault: () => {},
        target: {
          files: [file],
          value: "https://risibank.fr/cache/medias/0/21/2188/218864/full.png",
        },
      };
      const fileChange = screen.getByTestId("file");
      userEvent.upload(fileChange, file);
      const jestHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      fileChange.addEventListener("click", jestHandleChangeFile(dataTest));
      userEvent.click(fileChange);
      expect(jestHandleChangeFile).toHaveBeenCalled();

      const handleSubmit = jest.fn();
      const BtnSend = screen.getByTestId("btn-send-bill");
      BtnSend.addEventListener("click", handleSubmit);
      userEvent.click(BtnSend);
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
