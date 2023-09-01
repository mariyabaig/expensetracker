import React from 'react'
import BB from "../assets/manage.png";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()
    const goToHome = () => {
        navigate("/");
      };
  return (
    <div>
     <nav className="h-20 flex items-center p-12 text-5xl" onClick={goToHome}>
        BudgetBuddy <img src={BB} alt="Dashboard Icon" className='h-20' /> 
      </nav>
    </div>
  )
}

export default Header
