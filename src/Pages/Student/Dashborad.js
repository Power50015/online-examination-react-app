import UserCard from "../../Component/UserCard";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Dashborad() {
  const db = getFirestore();
  const [tabData, setTabData] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(db, "exams")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTabData(newData);
    });
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div>
      <div className="container mx-auto mt-4 flex justify-center	">
        <div className="w-full flex justify-center">
          <div className="w-1/3 px-3 	 flex-col">
            <UserCard />
          </div>

        </div>
      </div>
      <div className="w-full flex justify-center  flex-col items-center	">
        <h4>أمتحنات لم تمتحن بعد</h4>
        <div className="grid grid-cols-4	">
         
          {tabData?.map((row, i) => (
          <div
            className="flex justify-between items-center align-middle py-3 hover:text-green-600   basis-1/4 mx-3"
            key={i}
          >

<Link
              to={`/student-exam/${row.subjecId}`}
            className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300"
          >
            {row.subjectName}
          </Link>
          </div>
        ))}
          </div>
        <h4>النتائج</h4>
        <div className="flex">
        <Link
          to="/profile"
          className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300"
        >
          نظم و معلومات
        </Link>
        <Link
          to="/profile"
          className="mb-4 mt-3 mx-3 rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300"
        >
          إدارة موارد بشريه
        </Link>
        <Link
          to="/profile"
          className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300"
        >
          الصفحه الشخصيه
        </Link>
        </div>
      </div>
    </div>
  );
}
