import { collection, getDocs, getFirestore } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Subjects() {
  const db = getFirestore();
  const [tabData, setTabData] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(db, "subjects")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTabData(newData);
      // console.log(tabData, newData);
    });
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div className="container mx-auto mt-4">
      <div className="w-full">
        {tabData?.map((row, i) => (
          <div
            className="flex justify-between items-center align-middle mb-5 hover:text-green-600 border-b border-black"
            key={i}
          >
            <div className="w-[85%] flex justify-between items-center align-middle mb-5 hover:text-green-600 ">
              <h2 className="text-3xl	 font-black	w-1/3 text-right">{row.name}</h2>
              <h2 className="text-2xl	 font-black	w-1/3 text-center">{row.specialty}</h2>
              <h2 className="text-2xl	 font-black	w-1/3 text-left">
                الفرقه :{row.year === "1" && <span>الأولى</span>}
                {row.year === "2" && <span>الثانيه</span>}
                {row.year === "3" && <span>الثالثه</span>}
                {row.year === "4" && <span>الرابعه</span>}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
