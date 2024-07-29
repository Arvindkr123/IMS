/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC, lazy} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const StudentMarksResult = lazy(
    () => import('../pages/courseStudentSubjectsMarks/StudentMarksResult')
  )
  const PrintStudentResult = lazy(
    () => import('../pages/courseStudentSubjectsMarks/PrintStudentResult')
  )
  const PrintStudentFeesRecipt = lazy(
    () => import('../pages/print-student-fee-recipt/PrintStudentFeesRecipt')
  )
  const {currentUser} = useAuth()
  //console.log(currentUser)
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route path='/student-result' element={<StudentMarksResult />} />
              <Route path='/print-student-result' element={<PrintStudentResult />} />
              <Route path='/print-student-fees-recipt' element={<PrintStudentFeesRecipt />} />

              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
