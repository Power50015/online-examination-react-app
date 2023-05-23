import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import UserCardStudent from "../../../Component/UserCard";
import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function UpdateExam() {
  const db = getFirestore();
  const { examId } = useParams();
  const auth = getAuth();

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
            id: doc.data().uid,
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
          where("subjecId", "==", examId)
        );
        const docs2 = await getDocs(q2);
        docs2.forEach((doc) => {
          var date = new Date(doc.data().date * 1000);
          setSelectedSubjectData({
            index: examId,
            name: doc.data().subjectName,
            specialty: doc.data().subjectSpecialty,
            year: doc.data().subjectYear,
            totalScore: doc.data().totalScore,
            collectedScore: doc.data().collectedScore,
            Date: date.toUTCString(),
            stuName: doc.data().stuName,
          });
        });
      }
    });
  }, [userData.year]);

  const [selectedSubjectData, setSelectedSubjectData] = useState({
    index: null,
    name: null,
    specialty: null,
    year: null,
    totalScore: null,
    collectedScore: null,
    Date: null,
  });

  return (
    <div>
      <div className="container mx-auto mt-4 flex justify-center	">
        <div className="w-full flex justify-center">
          <div className="w-1/3 px-3 flex-col">{/* <UserCardStudent /> */}</div>
        </div>
      </div>
      <div className="container mx-auto mt-4 flex justify-center	">
        <div className="w-full flex justify-center">
          <div className="w-1/3 px-3 flex-col">
            <h2 className="font-bold">
              الطالب : {selectedSubjectData.stuName}
            </h2>
            <h2 className="font-bold">الإمتحان : {selectedSubjectData.name}</h2>
            <h2 className="font-bold">
              تاريخ الإمتحان : {selectedSubjectData.Date}
            </h2>
            <h2 className="font-bold">
              درجه الطالب فى الإمتحان : {selectedSubjectData.collectedScore}
            </h2>
            <h2 className="font-bold">
              الدرجه الكليه الإمتحان : {selectedSubjectData.totalScore}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
