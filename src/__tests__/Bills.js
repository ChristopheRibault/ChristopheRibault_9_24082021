import { screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage"
import firebase from "../__mocks__/firebase"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("fetches bills from mock API GET", async () => {
      const billsBoard = new Bills({document, localstorage: localStorageMock, firestore: {bills: () => firebase}})
      const getSpy = jest.spyOn(billsBoard, "getBills")
      const bills = await billsBoard.getBills()
      expect(getSpy).toHaveBeenCalledTimes(1)
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

  describe('When I click on the new bill button', () => {
    test('I should navigate to new bill page', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'User'
      }))
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const billsBoard = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const newBillBtn = screen.getByTestId('btn-new-bill')
      const handleClickNewBillBtn = jest.fn(billsBoard.handleClickNewBill)
      newBillBtn.addEventListener('click', handleClickNewBillBtn)
      userEvent.click(newBillBtn)
      expect(handleClickNewBillBtn).toHaveBeenCalled()
    })
  })

  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'User'
      }))
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const billsBoard = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const eye = screen.getAllByTestId('icon-eye')[0]
      const handleClickIconEye = jest.fn(billsBoard.handleClickIconEye(eye))
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
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

// test d'intégration GET
describe("Given I am a user connected as User", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
