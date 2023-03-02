import {
  collection,
  getCountFromServer,
  getFirestore,
  
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function StudentBox() {
  const db = getFirestore();
  const [count, setCount] = useState();
  useEffect(() => {
     countData();
  }, []);

  async function countData() {
    const coll = collection(db, "students");
    const snapshot = await getCountFromServer(coll);
    setCount(snapshot.data().count);
    return count;
  }

  return (
    <div className="bg-[#09103a] text-white px-4 pb-4 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[#3281c0] font-bold text-5xl">{count}</h2>
        <div className="my-5 text-center">
          <i className="fa-regular fa-circle-user text-7xl"></i>
        </div>
      </div>
      <h2 className="text-3xl mb-3">عدد الطلاب</h2>
      <div className="w-full text-center my-5 flex flex-col pt-5">
        <Link
          to="/students"
          className="mb-2 rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
        >
          معاينه الطلاب
        </Link>
        <Link
          to="/create-student"
          className="rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
        >
          إضافة طالب
        </Link>
      </div>
    </div>
  );
}