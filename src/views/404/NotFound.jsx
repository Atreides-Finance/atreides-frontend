import AtreidesIcon from "../../assets/icons/atreides.svg";
import "./notfound.scss";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://app.atreidesdao.com" target="_blank">
          <img className="branding-header-icon" src={AtreidesIcon} alt="AtreidesDAO" />
        </a>

        <h2 style={{ textAlign: "center" }}>Page not found</h2>
      </div>
    </div>
  );
}
