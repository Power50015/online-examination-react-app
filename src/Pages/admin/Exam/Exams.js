import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Exams() {
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
    <div className="container mx-auto mt-4">
      <div className="w-full">
        {tabData?.map((row, i) => (
          <div
            className="flex justify-between items-center align-middle py-3 hover:text-green-600  border-b border-black"
            key={i}
          >
            <Link
              to={`/exam/${row.subjecId}`}
              className="w-[85%] flex justify-between items-center align-middle hover:text-green-600 "
            >
              <h2 className="text-2xl	 font-black	">المادة : {row.subjectName}</h2>
              <h2 className="text-2xl	 font-black	">الشعبه : {row.subjectSpecialty}</h2>
              <h2 className="text-2xl	 font-black	">
                الفرقه :{row.subjectYear === '1' && <span>الأولى</span>}
                {row.subjectYear === '2' && <span>الثانيه</span>}
                {row.subjectYear === '3' && <span>الثالثه</span>}
                {row.subjectYear === '4' && <span>الرابعه</span>}
              </h2>
              <h2 className="text-2xl	 font-black	">مجموع الدرجات : {row.totalScore}</h2>
            </Link>
            <Link
              to={"/update-exam/" + row.subjecId}
              className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
            >
              تعديل البيانات
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
