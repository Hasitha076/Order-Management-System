import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

interface productProps {
  name: string;
  image: string;
  description: string;
  qtyOnHand: number;
}

function MinQtyCard(props: productProps) {
  const textDivStyle: React.CSSProperties = {
    margin: "auto",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: "100%",
    textAlign: "left",
    height: "100%",
  };

  const qtyStyle: React.CSSProperties = {
    display: "inline-flex",
    gap: "5px",
  };

  return (
    <div className="card" style={cardStyle}>
      <div>
        <img src={props.image} className="card-img-top img-fluid" alt="..." />
      </div>

      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <div style={qtyStyle}>
          <h6>
            <strong>Qty:</strong>
          </h6>
          <span className="badge text-bg-warning" style={textDivStyle}>
            {props.qtyOnHand}
          </span>
        </div>
        <div className="pt-2">
          <h6>
            <strong>Description:</strong>
          </h6>
          <p className="card-text">{props.description}</p>
        </div>
      </div>
    </div>
  );
}

export default MinQtyCard;
