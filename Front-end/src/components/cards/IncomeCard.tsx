import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

interface DefaultCardData {
  thumbnail: string;
  title: string;
  value: any | undefined;
}

const IncomeCard = (props: DefaultCardData) => {
  const cardStyle: React.CSSProperties = {
    maxWidth: "100%",
    textAlign: "center",
    height: "100%",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "60px",
  };

  const textDivStyle: React.CSSProperties = {
    margin: "auto",
    fontSize: "30px",
  };

  return (
    <div className="col-12 card" style={cardStyle}>
      <div
        className="card-thumbnail"
        style={iconStyle}
        dangerouslySetInnerHTML={{ __html: props.thumbnail }}
      ></div>
      <div className="card-body">
        <h2 className="card-title">{props.title}</h2>
        <span className="badge text-bg-warning" style={textDivStyle}>
          {props.value}
        </span>
      </div>
    </div>
  );
};

export default IncomeCard;
