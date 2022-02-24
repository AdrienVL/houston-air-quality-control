import React from "react";
import airquality from '../components/air-quality.png'

//Header Function
const Header = props => {
  return (
    <div className="sidebarStyle">
      <img className="air-quality-image" src={airquality} alt="" />
      <h1 className="title">Houston Air Quality Control</h1>
      <hr className="rounded"></hr>
      {props.action}

    </div>
  );
}; 
 
export default Header;