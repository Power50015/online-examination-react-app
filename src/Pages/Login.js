import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import firebase from "../firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [userType, setUserType] = useState("student");
  let history = useNavigate();
  const auth = getAuth(firebase);

  const [form, setForm] = useState({
    email: "admin@admin.com",
    password: "admin@admin.com",
  });

  async function handleForm(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
        .then((res) => {
          if (userType === "admin") history("/login");
          else history("/login");
        })
        .catch((e) => {
          console.log("Login 1 - err", e);
        });
    } catch (err) {
      console.error("Login 2 - err", err.message);
    }
  }

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        history("/");
      }
    });
  });

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <div className="text-right w-full my-5">
        <h2 className="text-[#28ff6e] font-bold text-3xl">تسجيل الدخول</h2>
      </div>
      <div className="btns flex justify-center mb-5">
        <div
          className={`
          btn
          mx-3
          text-lg
          font-bold px-5 cursor-pointer rounded-lg py-2 border-2 border-[#28ff6e] bg-[#093a19]
          ${userType === "student" ? "text-[#28ff6e]" : "text-white"}
           duration-300`}
          onClick={() => {
            setUserType("student");
          }}
        >
          طالب
        </div>
        <div
          className={`
          btn
          mx-3
          text-lg
          font-bold px-5 cursor-pointer rounded-lg py-2 border-2 border-[#28ff6e] bg-[#093a19]
          ${userType === "admin" ? "text-[#28ff6e]" : "text-white"}
           duration-300`}
          onClick={() => {
            setUserType("admin");
          }}
        >
          شئون الطلبة
        </div>
      </div>
      <div className="FormContainer bg-[#DFDFDF] border-[#093a19] border-2 border-solid	w-1/2 rounded-lg">
        <div className="flex justify-center items-center bg-[#093a19] py-4">
          <Link to="/">
            <img src={logo} alt="logo" width="150" />
          </Link>
        </div>
        <div className="form px-3">
          <h2 className="text-[#093a19] text-center my-5  font-bold text-2xl">
            تسجيل الدخول إلى حسابك
          </h2>
          <form onSubmit={handleForm}>
            <div className="mb-3 ">
              <label className="form-label inline-block mb-2 text-gray-700">
                البريد الإلكترونى
              </label>
              <input
                type="text"
                name="email"
                className="
                            form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none
                          "
                value={form.email}
                onChange={handleInput}
                placeholder="البريد الإلكترونى"
              />
            </div>
            <div className="mb-3">
              <label className="form-label inline-block mb-2 text-gray-700">
                كلمه المرور
              </label>
              <input
                type="password"
                value={form.password}
                onChange={handleInput}
                name="password"
                className="
                            form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none
                          "
                placeholder="كلمه المرور"
              />
            </div>

            <div className="w-full text-center my-5">
              <button className="rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300">
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
