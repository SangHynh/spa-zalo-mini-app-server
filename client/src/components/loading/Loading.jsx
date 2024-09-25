import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="text-4xl animate-spin" />
    </div>
  );
};

export default Loading;
