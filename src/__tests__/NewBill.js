import { screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage"
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