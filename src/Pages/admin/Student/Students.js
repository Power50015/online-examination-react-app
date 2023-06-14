import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Students() {
  const db = getFirestore();
  const [tabData, setTabData] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(db, "students")).then((querySnapshot) => {
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
            className="flex justify-between items-center align-middle py-3 hover:text-green-600  border-b border-black"
            key={i}
          >
            <Link
              to={`/student/${row.uid}`}
              className="w-[85%] flex justify-between items-center align-middle hover:text-green-600 "
            >
              <img
                src={row.photo}
                width="100"
                height="100"
                className="rounded-full border-4 border-[#093a19] w-[100px] h-[100px]"
                alt=""
              />
              <h2 className="text-2xl	 font-black	w-1/6 text-center">{row.name}</h2>
              <h2 className="text-2xl	 font-black	w-2/6 text-center">{row.email}</h2>
              <h2 className="text-2xl	 font-black	w-1/6 text-center">{row.specialty}</h2>
              <h2 className="text-2xl	 font-black	w-2/6 text-center">
                الفرقه :{row.year === '1' && <span>الأولى</span>}
                {row.year === '2' && <span>الثانيه</span>}
                {row.year === '3' && <span>الثالثه</span>}
                {row.year === '4' && <span>الرابعه</span>}
              </h2>
            </Link>
            <Link
              to={"/update-students/" + row.uid}
              className="w-1/6 mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
            >
              تعديل البيانات
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
