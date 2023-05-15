import {
  collection,
  getCountFromServer,
  getFirestore,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ExamsBox() {
  const db = getFirestore();
  const [count, setCount] = useState();
  useEffect(() => {
    countData();
  }, []);

  async function countData() {
    const coll = collection(db, "exams");
    const snapshot = await getCountFromServer(coll);
    setCount(snapshot.data().count);
    return count;
  }

  return (
    <div className="bg-[#093a19] text-white px-4 pb-4 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[#28ff6e] font-bold text-5xl">{count}</h2>
        <div className="my-5 text-center">
          <i className="fa-regular fa-copy text-7xl"></i>
        </div>
      </div>
      <h2 className="text-3xl mb-3">إمتحان إلكترونى</h2>
      <div className="w-full text-center my-5 flex flex-col pt-5">
        <Link
          to="/exams"
          className="mb-2 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          معاينه الإمتحنات
        </Link>
        <Link
          to="/create-exams"
          className="rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          إضافة إمتحان
        </Link>
      </div>
    </div>
  );
}
