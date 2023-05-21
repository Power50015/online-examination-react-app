import UserCard from "../Component/UserCard";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import firebase from "../firebase";
import AdminDashborad from "./admin/Dashborad";
import StudentDashborad from "./Student/Dashborad";

export default function Navbar() {
  const db = getFirestore();
  const auth = getAuth(firebase);
  const [isLogin, setIsLogin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function logout() {
    return signOut(auth)
      .then((res) => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.log("Nav - err", e);
      });
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setIsLogin(true);
      setIsLoading(true);

      const q = query(
        collection(db, "admins"),
        where("email", "==", user.email)
      );
      const docs = await getDocs(q);
      setIsStudent(!docs.empty);
      console.log(isStudent);
    } else {
      setIsLogin(false);
      setIsLoading(true);
    }
  });
  return (
    <div>
      <div className=" ">
        {isLoading ? (
          isLogin ? (
            isStudent ? (
              <AdminDashborad />
            ) : (
              <StudentDashborad />
            )
          ) : (
            "غير مسجل"
          )
        ) : (
          "غير مسجل"
        )}
      </div>
    </div>
  );
}
