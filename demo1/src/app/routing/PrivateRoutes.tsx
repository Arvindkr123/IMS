import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {useAuth} from '../modules/auth'
import {useAdmissionContext} from '../modules/auth/core/Addmission'
import StudentProfile from '../pages/student-profile/StudentProfile'
import UpdateAddmission from '../pages/UpdateAddmission'
import WhatsappMessageSuggestion from '../pages/email-template/WhatsappMessageSuggestion'
import PendingFeesStudents from '../pages/student-with-feesClear-and-remaining/PendingFeesStudents'
import ClearFeesStudents from '../pages/student-with-feesClear-and-remaining/ClearFeesStudents'
import GstSuggesstion from '../pages/email-template/GstSuggesstion'
import ViewDayBookAccount from '../pages/dayBook/ViewDayBookAccount'
import EditDayBookAccount from '../pages/dayBook/EditDayBookAccount'
import StudentCommission from '../pages/student-commission/StudentCommission'
import ShowSingleAccountDayBookData from '../pages/dayBook/ShowSingleAccountDayBookData'
import ViewDayBook from '../pages/dayBook/ViewDayBook'
import AddAccountDayBook from '../pages/dayBook/AddAccountDayBook'
import UpdateCompany from '../pages/compay/UpdateCompany'
import AddCompany from '../pages/compay/AddCompany'
import Company from '../pages/compay/Company'
import ProfilePage from '../modules/profile/ProfilePage'
import WizardsPage from '../modules/wizards/WizardsPage'
import AccountPage from '../modules/accounts/AccountPage'
import WidgetsPage from '../modules/widgets/WidgetsPage'
import ChatPage from '../modules/apps/chat/ChatPage'
import UsersPage from '../modules/apps/user-management/UsersPage'
import AddMissionForm from '../pages/AddMissionForm'
import MyPage from '../pages/MyPage'
import StudentsList from '../pages/StudentsList'
// import StudentProfile from '../pages/student-profile/StudentProfile'
import CourseTypes from '../pages/course/course-type'
import CourseCategory from '../pages/course/category'
import NumberOfYearsCourse from '../pages/course/Number Of Years'
import AddCourse from '../pages/course'
import AddCourseEditAndAdd from '../pages/course/course-type/AddCourseEditAndAdd'
import AddCourseTypeEdit from '../pages/course/course-type/AddCourseTypeEdit'
import AddNumberYearCourse from '../pages/course/Number Of Years/AddNumberYearCourse'
import AddCourseCategory from '../pages/course/category/AddCategory'
import AddCourseUpdateAndAdd from '../pages/course/AddCourse'
import EditCourse from '../pages/course/EditCourse'
import ViewCourse from '../pages/course/ViewCourse'
import MonthlyCollectionFee from '../pages/payment_option/MonthlyCollectionFee'
import AddPaymentOption from '../pages/payment_option/AddPaymentOption'
import EmailTemplate from '../pages/email-template/EmailTemplate'
import SendEmailSuggestion from '../pages/email-template/SendEmailSuggestion'
import CourseStudentSubjectMarks from '../pages/courseStudentSubjectsMarks/CourseStudentSubjectMarks'
import StudentMarksResult from '../pages/courseStudentSubjectsMarks/StudentMarksResult'
import StudentProfileDetailsPage from '../pages/monthly_collection_fee/StudentProfileDetailsPage'
const PrivateRoutes = () => {
  const {currentUser} = useAuth()
  //console.log(currentUser)

  const studentCTX = useAdmissionContext()

  // Fetch current student data based on currentUser's email
  const currentStudent = studentCTX?.useGetSingleStudentUsingWithEmail(currentUser?.email)
  //console.log(currentStudent.data)

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        {currentUser?.role !== 'Student' ? (
          <>
            {/* ================================  DayBook Start Here ============================== */}{' '}
            <Route
              path='/daybook/viewDaybook/:id'
              element={
                <>
                  <ViewDayBook />
                </>
              }
            />
            <Route
              path='/daybook/addAccount/:id'
              element={
                <>
                  <AddAccountDayBook />
                </>
              }
            />
            <Route
              path='/daybook/singleAccount/:id'
              element={
                <>
                  <ShowSingleAccountDayBookData />
                </>
              }
            />
            <Route
              path='/daybook/editAccount/:id'
              element={
                <>
                  <EditDayBookAccount />
                </>
              }
            />
            <Route
              path='/daybook/viewAccount/:id'
              element={
                <>
                  <ViewDayBookAccount />
                </>
              }
            />
            {/* ================================  DayBook End Here ============================== */}
            {/* ====================Start Course Here ==================== */}
            <Route
              path='/course/course-type'
              element={
                <>
                  <CourseTypes className='' />
                </>
              }
            />
            <Route
              path='/course/course-type/editAdd/:id'
              element={
                <>
                  <AddCourseEditAndAdd />
                </>
              }
            />
            <Route
              path='/course/course-type/edit/:id'
              element={
                <>
                  <AddCourseTypeEdit />
                </>
              }
            />
            <Route
              path='/course/category'
              element={
                <>
                  <CourseCategory className='' />
                </>
              }
            />
            <Route
              path='/course/category/add'
              element={
                <>
                  <AddCourseCategory />
                </>
              }
            />
            <Route
              path='/student/commission/:companyId'
              element={
                <>
                  <StudentCommission />
                </>
              }
            />
            {/* ======================================Add Number Of Years Course Type Start ============================================= */}
            <Route
              path='/course/no_of_years_course'
              element={
                <>
                  <NumberOfYearsCourse className='' />
                </>
              }
            />
            <Route
              path='/course/no_of_years_course/add'
              element={
                <>
                  <AddNumberYearCourse />
                </>
              }
            />
            {/* ======================================Add Number Of Years Course Type End ============================================= */}
            <Route
              path='/course/addCourse'
              element={
                <>
                  <AddCourse className='' />
                </>
              }
            />
            <Route
              path='/course/viewCourses'
              element={
                <>
                  <ViewCourse />
                </>
              }
            />
            <Route
              path='/course/addCourse/add'
              element={
                <>
                  <AddCourseUpdateAndAdd />
                </>
              }
            />
            <Route
              path='/course/addCourse/update'
              element={
                <>
                  <EditCourse />
                </>
              }
            />
            {/* ====================End Course Here ==================== */}
            <Route
              path='/my-page'
              element={
                <>
                  <MyPage />
                </>
              }
            />
            <Route
              path='/addmission-form/:id'
              element={
                <>
                  <AddMissionForm />
                </>
              }
            />
            <Route
              path='/update-addmission-form/:id'
              element={
                <>
                  <UpdateAddmission />
                </>
              }
            />
            <Route
              path='/students/:id'
              element={
                <>
                  <StudentsList className='' />
                </>
              }
            />
            <Route
              path='/students-clearFee/:id'
              element={
                <>
                  <ClearFeesStudents />
                </>
              }
            />
            <Route
              path='/students-remainingFee/:id'
              element={
                <>
                  <PendingFeesStudents />
                </>
              }
            />
            <Route path='/student/:id' element={<StudentProfile />} />
            <Route path='/profile/student/:id' element={<StudentProfileDetailsPage />} />
            {/* *************************************** Monthly Collection fees start here.************************** */}
            <Route
              path='/monthlyCollectionFees/:id'
              element={
                <>
                  <MonthlyCollectionFee />
                </>
              }
            />
            {/* *************************************** Monthly Collection fees End here.. ******************************************* */}
            {/* ******************************......... Manage Company start here.....***************************** */}
            <Route
              path='/company'
              element={
                <>
                  <Company />
                </>
              }
            />
            <Route
              path='/add-company'
              element={
                <>
                  <AddCompany />
                </>
              }
            />
            <Route
              path='/update-company'
              element={
                <>
                  <UpdateCompany />
                </>
              }
            />
            {/* ******************************................ Manage Company End here..............******************************************* */}
            {/* ------------------------------- Email Template Start ----------------------------------- */}
            <Route
              path='/general-settings'
              element={
                <>
                  <div className='d-flex flex-column gap-10'>
                    <SendEmailSuggestion />
                    <WhatsappMessageSuggestion />
                    <GstSuggesstion />
                    <AddPaymentOption />
                    <EmailTemplate />
                  </div>
                </>
              }
            />
            <Route
              path='/course-subjects-addMarks'
              element={
                <>
                  <CourseStudentSubjectMarks />
                </>
              }
            />
            {/* Pages */}
            <Route path='dashboard' element={<DashboardWrapper />} />
            <Route path='builder' element={<BuilderPageWrapper />} />
            <Route path='menu-test' element={<MenuTestPage />} />
            {/* Lazy Modules */}
            <Route
              path='crafted/pages/profile/*'
              element={
                <>
                  <ProfilePage />
                </>
              }
            />
            <Route
              path='crafted/pages/wizards/*'
              element={
                <>
                  <WizardsPage />
                </>
              }
            />
            <Route
              path='crafted/widgets/*'
              element={
                <>
                  <WidgetsPage />
                </>
              }
            />
            <Route
              path='crafted/account/*'
              element={
                <>
                  <AccountPage />
                </>
              }
            />
            <Route
              path='apps/chat/*'
              element={
                <>
                  <ChatPage />
                </>
              }
            />
            <Route
              path='apps/user-management/*'
              element={
                <>
                  <UsersPage />
                </>
              }
            />
            {/* <Route path='*' element={<Navigate to='/error/404' />} /> */}
          </>
        ) : (
          <>
            <Route path='dashboard' element={<DashboardWrapper />} />
            <Route
              path='/student/:id'
              element={
                <>
                  <StudentProfile />
                </>
              }
            />

            {/* Page Not Found */}
            <Route
              path='*'
              element={
                <Navigate
                  to={`/student/${currentStudent?.data?._id}`}
                  state={currentStudent?.data}
                />
              }
            />
          </>
        )}
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
