import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Admins() {
  const db = getFirestore();
  const [tabData, setTabData] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(db, "admins")).then((querySnapshot) => {
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
              <img
                src={row.photo}
                width="100"
                height="100"
                className="rounded-full border-4 border-[#093a19] w-[100px] h-[100px]"
                alt=""
              />
              <h2 className="text-3xl	 font-black	">{row.name}</h2>
              <h2 className="text-3xl	 font-black	">{row.email}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
