import React from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'

function SideMenuButton({toggleCollapsed, collapsed}) {
  return (
    <div className='block top-3 left-3 z-30 p-1 pl-3 pe-3 w-full sm:w-0 sm:p-0'>
        <GiHamburgerMenu className='sm:w-0 w-6 h-6' onClick={toggleCollapsed}/>
    </div>
  )
}

export default SideMenuButton
