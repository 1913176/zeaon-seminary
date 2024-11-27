import "./Dashboard.css";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="sidebarBox">
        <Sidebar />
      </div>
      <div className="outletBox">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
