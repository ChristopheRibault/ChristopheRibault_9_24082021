import { screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage"
import firebase from "../__mocks__/firebase"
import { ROUTES } from "../constants/routes"

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}
const file = new File(['hello'], 'hello.png', {type: 'image/png'})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'User'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

    })
    test("If I change file from input, handleCahngeFile should be called", () => {
      const newBillPage = new NewBill({document, onNavigate, localStorage: window.localStorage})
      const handleChangeFile = jest.fn(newBillPage.handleChangeFile)
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)
      userEvent.upload(fileInput, file)

      expect(handleChangeFile).toHaveBeenCalled()
    })
    test("If I submit a new bill handleSubmit should be called", () => {
      const newBillPage = new NewBill({document, onNavigate, localStorage: window.localStorage})
      const handleSubmit = jest.fn(newBillPage.handleSubmit)
      const submitBtn = screen.getByTestId('btn-send-bill')
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)

      userEvent.click(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
      
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as User", () => {
  describe("When I navigate to New bill", () => {
    test("post bills from mock API POST", async () => {
      const newBill = {
        "id": "iuCK0SzECmaYAGRrHpaD",
        "status": "refused",
        "pct": 20,
        "amount": 100,
        "email": "a@a",
        "name": "test3",
        "vat": "40",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2002-02-02",
        "commentAdmin": "nop",
        "commentary": "test3",
        "type": "Restaurants et bars",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
      }
      const postSpy = jest.spyOn(firebase, "post")
      const postedBill = await firebase.post(newBill)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(postedBill).toBe(newBill)
    })
    test("get bills from mock API GET should include newlly added bill", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })

  })
})