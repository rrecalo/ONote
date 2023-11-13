import React from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'

function SideMenuButton({toggleCollapsed, collapsed}) {
  return (
    <div className='absolute top-3 left-3 block sm:hidden z-30'>
        <GiHamburgerMenu className='w-5 h-5' onClick={toggleCollapsed}/>
    </div>
  )
}

export default SideMenuButton