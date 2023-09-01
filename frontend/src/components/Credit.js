import React from 'react';
import "./Credit.css"
import visa from "../assets/visa.png"
import chip from "../assets/chip.png"
const Credit = () => {
  return (
    <>


<div className="card">
  <div className="card__front card__part">
    <img className="card__front-square card__square" src={chip} alt='chip'/>
    <img className="card__front-logo card__logo" src={visa} alt="visa"/>
    <p className="card_numer">**** **** **** 6258</p>
    <div className="card__space-75">
      <span className="card__label">Card holder</span>
      <p className="card__info">John Doe</p>
    </div>
    <div className="card__space-25">
      <span className="card__label">Expires</span>
            <p className="card__info">10/25</p>
    </div>
  </div>
  
  <div className="card__back card__part">
    <div className="card__black-line"></div>
    <div className="card__back-content">
      <div className="card__secret">
        <p className="card__secret--last">420</p>
      </div>
      <img className="card__back-square card__square" src={chip} alt='chip'/>
      <img className="card__back-logo card__logo"src={visa} alt="visa"/>
      
    </div>
  </div>
  
</div></>
  )
}

export default Credit
