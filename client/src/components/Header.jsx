import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
    <div className='flex justify-between items-center p-4 bg-gray-800 text-white h-1 w-full'>
      title 
      home

      <span>
       
       <Link className='' to='/login'>
        login 
        </Link>
        <Link to = '/register'>
         register    
       </Link>
      </span>
    </div>
    <div className='flex'>

    </div>
    </>
  )
}

export default Header
