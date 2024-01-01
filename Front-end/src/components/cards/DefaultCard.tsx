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
  description: string;
  value: any | undefined;
  path: string;
  item: string;
}

const DefaultCard = (props: DefaultCardData) => {
  const cardStyle: React.CSSProperties = {
    maxWidth: "100%",
    textAlign: "center",
    height: "100%",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "60px",
  };

  const textStyle: React.CSSProperties = {
    minHeight: "55px",
  };

  const textDivStyle: React.CSSProperties = {
    margin: "auto",
  };

  return (
    <div className="col-12 card" style={cardStyle}>
      <div
        className="card-thumbnail"
        style={iconStyle}
        dangerouslySetInnerHTML={{ __html: props.thumbnail }}
      ></div>
      <span className="badge text-bg-warning" style={textDivStyle}>
        {props.value}
      </span>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <div className="text" style={textStyle}>
          <p className="card-text">{props.description}</p>
        </div>
        <button className="btn btn-success">
          <NavLink className="nav-link" to={props.path}>
            {props.item}
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default DefaultCard;
