import React from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'

function SideMenuButton({toggleCollapsed, collapsed}) {
  return (
    <div className='block top-3 left-3 sm:hidden z-30 p-1 pl-3 pe-3'>
        <GiHamburgerMenu className='w-6 h-6' onClick={toggleCollapsed}/>
    </div>
  )
}

export default SideMenuButton
