import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState } from "react";
import logo from "../images/logo.png";
import firebase from "../firebase";
export default function Navbar() {
  const auth = getAuth(firebase);
  const [isLogin, setIsLogin] = useState(false);
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

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLogin(true);
      setIsLoading(true);
    } else {
      setIsLogin(false);
      setIsLoading(true);
    }
  });

  return (
    <nav className="nav py-4 mb-3">
      <div className="container mx-auto">
        <div className="flex justify-between items-center ">
          <div className="logo">
            {isLoading ? (
              isLogin ? (
                <a href="/admin-dashborad">
                  <img src={logo} alt="logo" width="100" />
                </a>
              ) : (
                <a href="/">
                  <img src={logo} alt="logo" width="100" />
                </a>
              )
            ) : (
              ""
            )}
          </div>
          <div className="btns ">
            {isLoading ? (
              isLogin ? (
                <button
                  className="rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300"
                  onClick={logout}
                >
                  تسجيل الخروج
                </button>
              ) : (
                <a
                  href="/login"
                  className="rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300"
                >
                  تسجيل الدخول
                </a>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
