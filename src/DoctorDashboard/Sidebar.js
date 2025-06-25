import React from "react";
import { FaTachometerAlt, FaCalendarCheck, FaComments, FaUserMd } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">MEDEASE</h1>

      <ul className="space-y-4">
        <li className="flex items-center p-2 bg-gray-700 rounded">
          <FaTachometerAlt className="mr-3" /> Dashboard
        </li>
        <li className="flex items-center p-2 hover:bg-gray-700 rounded">
          <FaCalendarCheck className="mr-3" /> Appointments
        </li>
        <li className="flex items-center p-2 hover:bg-gray-700 rounded">
          <FaComments className="mr-3" /> Messages
        </li>
        <li className="flex items-center p-2 hover:bg-gray-700 rounded">
          <FaUserMd className="mr-3" /> Patients
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
