import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getCountFromServer,
  getFirestore,
} from "firebase/firestore";

export default function SubjectBox() {
  const db = getFirestore();
  const [count, setCount] = useState();
  useEffect(() => {
    countData();
  }, []);

  async function countData() {
    const coll = collection(db, "subjects");
    const snapshot = await getCountFromServer(coll);
    setCount(snapshot.data().count);
    return count;
  }

  return (
    <div className="bg-[#093a19] text-white px-4 py-4 rounded-lg mb-4">
      <h2 className="text-[#28ff6e] font-bold text-5xl mb-5">{count}</h2>
      <h2 className="text-3xl mb-5">عدد شئون الطلبه</h2>
      <div className="my-5  py-5 flex flex-col w-full">
        <div className="text-center">
          <i className="fa-solid fa-book text-8xl my-3"></i>
        </div>
        <div className="text-center">
          <i className="fa-solid fa-laptop text-8xl my-3"></i>
        </div>
        <div className="text-center">
          <i className="fa-solid fa-note-sticky text-8xl my-3"></i>
        </div>
      </div>
      <div className="w-full text-center my-5 flex flex-col">
        <Link
          to="/create-subjects"
          className="mb-4 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          إضافه مادة
        </Link>
        <Link
          to="/subjects"
          className="rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          معاينه المواد
        </Link>
      </div>
    </div>
  );
}
