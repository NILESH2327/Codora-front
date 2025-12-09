import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserEdit,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const NgoSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/ngo/dashboard", icon: <FaTachometerAlt /> },
    { name: "Profile", path: "/ngo/profile", icon: <FaUserEdit /> },
    { name: "Loan Requests", path: "/ngo/loan-requests", icon: <FaClipboardList /> },
    // { name: "Notifications", path: "/ngo/notifications", icon: <FaBell /> },
  ];

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <div
        className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 
        ${collapsed ? "w-20" : "w-64"} fixed md:relative z-20`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h1 className="text-xl font-bold text-green-600">NGO Panel</h1>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        {/* Menu */}
        <div className="mt-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                to={item.path}
                key={item.name}
                className={`flex items-center gap-4 px-4 py-3 text-sm font-medium transition rounded-lg mx-2 mb-2
                  ${
                    active
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Logout */}
        <div className="absolute bottom-4 w-full px-4">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Content Area Placeholder */}
      <div className="flex-1 ml-20 md:ml-0 p-4">
        {/* This is where your routed pages will appear */}
      </div>
    </div>
  );
};

export default NgoSidebar;
