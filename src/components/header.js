import React from "react";
import airquality from '../components/air-quality.png'
import './header.css';

//Header Function
const Header = () => {
  return (
    <div>
      <img className="air-quality-image" src={airquality} alt="" />
      <h1 className="title">Houston Air Quality Control</h1>
      <hr className="rounded"></hr>
    </div>
  );
}; 
 
export default Header;