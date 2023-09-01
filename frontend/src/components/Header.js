import React from 'react'
import BB from "../assets/manage.png";

const Header = () => {
  return (
    <div>
     <nav className="h-20 flex items-center p-12">
        BudgetBuddy <img src={BB} alt="Dashboard Icon" className='h-20' /> 
      </nav>
    </div>
  )
}

export default Header
