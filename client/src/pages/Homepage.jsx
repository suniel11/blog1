import React from 'react'
import SearchAndFollow from '../components/SearchAndFollow'
import UserProfile from '../components/UserProfile'

const Homepage = () => {
  return (
    <div className="bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Find and Follow Users
        </h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <SearchAndFollow />
       
        </div>
      </div>
    </div>
  )
}

export default Homepage
