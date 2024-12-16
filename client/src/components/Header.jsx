import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
    <div className='flex justify-between items-center p-4 bg-gray-800 text-white h-1 w-full'>
      <span className='flex flex-row gap-10 justify-evenly font-bold'>
      title 
     <Link to={'/profile'}>Profile</Link> 

     </span>
      <span className=' flex flex-end justify-evenly text-gray-400 gap-x-10'>
       
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
