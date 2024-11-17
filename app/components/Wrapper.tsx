import React from 'react'
import Navbarr from './Navbarr'
interface Wrapperprops {
    children: React.ReactNode
}
const Wrapper = ({children}: Wrapperprops) => {
  return (
    <>
        <Navbarr />
        <div className="px-5 mt-10-mb-10">
          {children}
        </div>
        
     </>
  )
}

export default Wrapper