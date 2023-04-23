import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function ReadStudent() {
  const { stuId } = useParams();

  const db = getFirestore();

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
    </div>
  );
}
