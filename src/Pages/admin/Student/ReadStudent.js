import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  where,
  query,
} from "firebase/firestore";

export default function ReadStudent() {
  const { stuId } = useParams();

  const db = getFirestore();
  const [tabData, setTabData] = useState([]);
  const [tabData2, setTabData2] = useState([]);

  const [studentData, setStudentData] = useState({
    id: "",
    name: "",
    email: "",
    photo: "",
    type: "",
    specialty: "",
    year: "",
  });

  const getData = async () => {
    const q = query(collection(db, "students"), where("uid", "==", stuId));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      setStudentData({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        photo: doc.data().photo,
        type: "students",
        specialty: doc.data().specialty,
        year: doc.data().year,
      });
    });

    const q2 = query(
      collection(db, "studExams"),
      where("stuId", "==", stuId)
    );

    const docs2 = await getDocs(q2);
    const ids2 = [];
    docs2.forEach((doc) => {
      ids2.push(doc.data().subjecId);
    });

    const q3 = query(
      collection(db, "exams")
    );
    
    const docs3 = await getDocs(q3);
    const newData2 = [];
    const newData3 = [];
    const ids3 = [];
    docs3.forEach((doc) => {
      ids3.push(doc.id);
      if (ids2.includes(doc.data().subjecId)) newData2.push(doc.data());
      else newData3.push(doc.data());
    });

    setTabData(newData3);
    setTabData2(newData2);
  };

  useEffect(() => getData, []);

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <div className="FormContainer bg-[#DFDFDF] border-[#093a19] border-2 border-solid	w-1/2 rounded-lg p-3">
        <div className="form px-3">
          <div className="user-img flex justify-center flex-col align-middle items-center">
            <img
              src={studentData.photo}
              width="135"
              className="rounded-full border-4 border-[#28ff6e]"
              alt=""
            />
            <h2 className="text-[#093a19] text-center my-5  font-bold text-2xl">
              {studentData.name}
            </h2>
            <h4 className="text-[#093a19] text-center  font-bold text-2xl">
              {studentData.email}
            </h4>
            <h4 className="text-[#093a19] text-center  font-bold text-2xl mt-3">
              {studentData.specialty}
            </h4>
            <h4 className="text-[#093a19] text-center  font-bold text-2xl mt-3">
              الفرقه :{studentData.year === "1" && <span>الأولى</span>}
              {studentData.year === "2" && <span>الثانيه</span>}
              {studentData.year === "3" && <span>الثالثه</span>}
              {studentData.year === "4" && <span>الرابعه</span>}
            </h4>
          </div>
        </div>
      </div>
      <div>
      <h4>نتائج الإمتحنات التى تم امتحانها</h4>
        <div className="grid grid-cols-4	">
          {tabData2?.map((row, i) => (
            <div
              className="flex justify-between items-center align-middle py-3 hover:text-green-600   basis-1/4 mx-3"
              key={i}
            >
              <Link
                to={`/student-certificate/${row.subjecId}`}
                className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-white bg-green-500 text-white  hover:text-green-100 duration-300"
              >
                {row.subjectName}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
