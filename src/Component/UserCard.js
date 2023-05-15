import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function UserCard() {
  const auth = getAuth();
  const db = getFirestore();

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
          collection(db, "admins"),
          where("email", "==", user.email)
        );
        const docs = await getDocs(q);
        if (docs.empty) {
          const q = query(
            collection(db, "students"),
            where("email", "==", user.email)
          );
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
        } else {
          docs.forEach((doc) => {
            setUserData({
              name: doc.data().name,
              email: doc.data().email,
              photo: doc.data().photo,
              type: "admin",
            });
          });
        }
      }
    });
  }, []);

  return (
    <div className="bg-[#093a19] text-white flex justify-between px-4 py-4 rounded-lg mb-4">
      <div className="user-img ml-3">
        <img
          src={userData.photo}
          width="135"
          className="rounded-full border-4 border-[#28ff6e]"
          alt=""
        />
      </div>
      <div className="user-data text-left flex justify-between flex-col items-center">
        <h4>{userData.name}</h4>
        <h4>{userData.email}</h4>
        <h4>{userData.specialty}</h4>
        {userData.year ? (<h4> الفرقه : {userData.year}</h4>):("")}
        {userData.year ? (<h4>الطالب</h4>):(<h4>شئون طلبه</h4>)}
        
        <Link
          to="/profile"
          className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          الصفحه الشخصيه
        </Link>
      </div>
    </div>
  );
}
