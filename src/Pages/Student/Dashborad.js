import UserCardStudent from "../../Component/UserCardStudent";
import {
  collection,
  getDocs,
  getFirestore,
  where,
  query,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashborad() {
  const auth = getAuth();
  const db = getFirestore();
  const [tabData, setTabData] = useState([]);
  const [tabData2, setTabData2] = useState([]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photo: "",
    specialty: "",
    year: "",
    type: "",
  });


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        const q = query(
          collection(db, "students"),
          where("email", "==", user.email)
        );
        // Get Student Data
        const docs = await getDocs(q);
        docs.forEach((doc) => {
          setUserData({
            name: doc.data().name,
            email: doc.data().email,
            photo: doc.data().photo,
            specialty: doc.data().specialty,
            year: doc.data().year,
            type: "student",
          });
        });

        const q2 = query(
          collection(db, "studExams"),
          where("email", "==", userData.email)
        );

        const docs2 = await getDocs(q2);
        const ids2 = [];
        docs2.forEach((doc) => {
          ids2.push(doc.data().subjecId);
        });

        const q3 = query(
          collection(db, "exams"),
          where("subjectYear", "==", userData.year)
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
      }
    });
  }, [userData.year]);

  return (
    <div>
      <div className="container mx-auto mt-4 flex justify-center	">
        <div className="w-full flex justify-center">
          <div className="w-1/3 px-3 	 flex-col">
            <UserCardStudent />
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
                className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-white bg-green-500 text-white  hover:text-green-100 duration-300"
              >
                {row.subjectName}
              </Link>
            </div>
          ))}
        </div>
        <h4>النتائج</h4>
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
