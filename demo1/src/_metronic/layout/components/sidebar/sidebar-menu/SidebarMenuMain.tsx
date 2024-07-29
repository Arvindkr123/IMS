/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useCompanyContext} from '../../../../../app/pages/compay/CompanyContext'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()

  const companyCTX = useCompanyContext()
  //console.log(companyCTX.getCompanyLists.data)
  const {currentUser} = useAuth()
  //console.log(currentUser)

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      {/* <SidebarMenuItem to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' /> */}

      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div> */}
      {/* <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='cross-circle'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='element-7'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div> */}
      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub> */}

      {currentUser?.role !== 'Student' ? (
        <>
          {/* ----------------------------- Company Menu Start Here ............................... */}
          {companyCTX.getCompanyLists?.data?.map((CompanyListData: any, index: number) => (
            <React.Fragment key={index}>
              <SidebarMenuItemWithSub
                key={CompanyListData?._id}
                to='/apps/chat'
                title={CompanyListData.companyName}
                fontIcon='bi-chat-left'
                icon='message-text-2'
              >
                <SidebarMenuItem
                  to={`/students/${CompanyListData?._id}`}
                  title='All Students'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/monthlyCollectionFees/${CompanyListData?._id}`}
                  title='Monthly Collections'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/student/commission/${CompanyListData?._id}`}
                  title='Commission'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/addmission-form/${CompanyListData?._id}`}
                  title='Admission Form'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/students-remainingFee/${CompanyListData?._id}`}
                  title='Pending Fess Students'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/students-clearFee/${CompanyListData?._id}`}
                  title='Clear Fess Students'
                  hasBullet={true}
                />

                {/* ------------------------------------ Start Day Book here ---------------------------------- */}
                <SidebarMenuItemWithSub
                  to='/apps/chat'
                  title='Day Book'
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItem
                    to={`/daybook/viewDaybook/${CompanyListData._id}`}
                    title='View DayBook'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/daybook/addAccount/${CompanyListData._id}`}
                    title='Add Account'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/daybook/viewAccount/${CompanyListData._id}`}
                    title='View Account'
                    hasBullet={true}
                  />
                </SidebarMenuItemWithSub>
                {/* ------------------------------------ End Day Book here ---------------------------------- */}
              </SidebarMenuItemWithSub>
            </React.Fragment>
          ))}
          {/* ----------------------------- Company Menu END Here ............................... */}

          {/* ************* Manage Courses Start   ****************** */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Manage Courses'
            fontIcon='bi-chat-left'
            icon='message-text-2'
          >
            <SidebarMenuItem to='/course/course-type' title='Add Course Type' hasBullet={true} />
            <SidebarMenuItem to='/course/category' title='Add Course Category' hasBullet={true} />
            <SidebarMenuItem
              to='/course/no_of_years_course'
              title='Add Course Number Of Years'
              hasBullet={true}
            />
            <SidebarMenuItem to='/course/addCourse' title='Add Course' hasBullet={true} />
            <SidebarMenuItem to='/course/viewCourses' title='View All Courses' hasBullet={true} />
            {/* <SidebarMenuItem to='/addmission-form' title='Add Course Category' hasBullet={true} /> */}
          </SidebarMenuItemWithSub>
          {/* ************* Manage Courses END   ****************** */}

          {/* ************************************* Manage Company Start ******************************** */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Manage Company'
            fontIcon='bi-chat-left'
            icon='message-text-2'
          >
            <SidebarMenuItem to='/company' title='Company' hasBullet={true} />
            <SidebarMenuItem to='/add-company' title='Add Company' hasBullet={true} />
          </SidebarMenuItemWithSub>
          {/* *************************************  Manage Company End ******************************** */}

          {/* ------------------------------ Settings Page Start ----------------------------------------- */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Settings'
            fontIcon='bi-chat-left'
            icon='abstract-29'
          >
            <SidebarMenuItem to='/general-settings' title='General Settings' hasBullet={true} />
          </SidebarMenuItemWithSub>
          {/* <SidebarMenuItem to='/email-template' title='Email Template' hasBullet={true} />
      <SidebarMenuItem to='/email-suggesstions' title='Send Email Suggestion' hasBullet={true} />
      <SidebarMenuItem to='/payment-option' title='Add Payment Option' hasBullet={true} /> */}

          {/* ------------------------------ Settings Page End ------------------------------------------- */}

          <SidebarMenuItem
            to='/apps/user-management/users'
            icon='abstract-28'
            title='User management'
            fontIcon='bi-layers'
          />
        </>
      ) : (
        <>
          <SidebarMenuItem
            to='/student'
            icon='abstract-28'
            title='Student Profile'
            fontIcon='bi-layers'
          />
        </>
      )}

      {/* ******************  Manage Student added Started------- **************************** */}
      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Manage Students'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem to='/my-page' title='Users' hasBullet={true} />
        <SidebarMenuItem to='/students' title='Students' hasBullet={true} />
        <SidebarMenuItem to='/addmission-form' title='Admission Form' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* ******************  Manage Student added end ------- **************************** */}

      {/********************** Manage Monthy Collection of Student Course Fees Installment Start***********************  */}
      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Manage Monthly Collection'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem
          to='/monthlyCollectionFees'
          title='Monthly Collection Fees'
          hasBullet={true}
        />
      </SidebarMenuItemWithSub> */}
      {/********************** Manage Monthy Collection of Student Course Fees Installment End***********************  */}

      {/* <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}

export {SidebarMenuMain}
