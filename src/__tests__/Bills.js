import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage"
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When bill page is loading", () => {
    test("Then Loading page should be displayed", async () => {
      const html = BillsUI({ data: [], loading: true })
      document.body.innerHTML = html
      const loader = await screen.findByTestId('loading')
      expect(loader).toBeDefined()
    })
  })

  describe("When bill page has error", () => {
    test("Then arror page should be displayed", async () => {
      const html = BillsUI({ data: [], error: new Error('Test error') })
      document.body.innerHTML = html
      const error = await screen.findByTestId('error-message')
      expect(error).toBeDefined()
    })
  })
})