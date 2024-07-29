import clsx from 'clsx'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import {useAuth} from '../../../../app/modules/auth'
import {useAdmissionContext} from '../../../../app/modules/auth/core/Addmission'

const itemClass = 'ms-1 ms-md-4'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px'
const userAvatarClass = 'symbol-35px'
const btnIconClass = 'fs-2'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const Navbar = () => {
  const {config} = useLayout()
  const {currentUser} = useAuth()
  //console.log(currentUser?.role)
  const studentCTX = useAdmissionContext()

  // Fetch current student data based on currentUser's email
  const currentStudent = studentCTX?.useGetSingleStudentUsingWithEmail(currentUser?.email)

  return (
    <div className='app-navbar flex-shrink-0'>
      <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img
            src={
              currentStudent?.data?.image
                ? BASE_URL_Image + '/' + currentStudent?.data?.image
                : '/300-1.jpg'
            }
            alt=''
          />
        </div>
        {currentStudent && <HeaderUserMenu currentStudent={currentStudent?.data} />}
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
