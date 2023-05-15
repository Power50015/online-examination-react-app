import {
  collection,
  getCountFromServer,
  getFirestore,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function AdminBox() {
  
  const db = getFirestore();
  const [count, setCount] = useState();

  useEffect(() => {
     countData();
  }, []);
  
  async function countData() {
    const snapshot = await getCountFromServer(collection(db, "admins"));
    setCount(snapshot.data().count);
    return count;
  }

  return (
    <div className="bg-[#093a19] text-white px-4 py-4 rounded-lg mb-4">
      <h2 className="text-[#28ff6e] font-bold text-5xl mb-5">{count}</h2>
      <h2 className="text-3xl mb-5">عدد شئون الطلبه</h2>
      <div className="my-5 text-center py-5">
        <i className="fa-solid fa-users text-9xl"></i>
      </div>
      <div className="w-full text-center my-5 flex flex-col">
        <Link
          to="/admins"
          className="mb-4 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          معاينه شئون الطالبه
        </Link>
        <Link
          to="/create-admins"
          className="rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          إضافة شئون الطالبه
        </Link>
      </div>
    </div>
  );
}
