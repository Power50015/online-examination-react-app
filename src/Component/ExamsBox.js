import React from "react";
import { Link } from "react-router-dom";

export default function ExamsBox() {
  return (
    <div className="bg-[#09103a] text-white px-4 pb-4 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[#3281c0] font-bold text-5xl">25</h2>
        <div className="my-5 text-center">
          <i className="fa-regular fa-copy text-7xl"></i>
        </div>
      </div>
      <h2 className="text-3xl mb-3">إمتحان إلكترونى</h2>
      <div className="w-full text-center my-5 flex flex-col pt-5">
        <Link
          to="/exams"
          className="mb-2 rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
        >
          معاينه الإمتحنات
        </Link>
        <Link
          to="/create-exams"
          className="rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
        >
          إضافة إمتحان
        </Link>
      </div>
    </div>
  );
}
