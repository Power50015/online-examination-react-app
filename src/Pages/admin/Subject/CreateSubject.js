import { getFirestore, collection, addDoc } from "firebase/firestore";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSubject() {
  let history = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    specialty: "نظم و معلومات",
    year: "1",
    exam: false,
  });

  function handleInput(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  async function handleForm(e) {
    e.preventDefault();

    const db = getFirestore(); // initialize Firestore

    await addDoc(collection(db, "subjects"), {
      name: userData.name,
      specialty: userData.specialty,
      year: userData.year,
    }).then(() => history("/subjects"));
  }

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <div className="FormContainer bg-[#DFDFDF] border-[#09103A] border-2 border-solid	w-1/2 rounded-lg">
        <div className="form px-3">
          <h2 className="text-[#09103A] text-center my-5  font-bold text-2xl">
            إضافه مادة
          </h2>
          <form onSubmit={handleForm}>
            <div className="user-data text-left flex justify-between flex-col items-center">
              <input
                type="text"
                name="name"
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
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                            "
                placeholder="الأسم"
                value={userData.name}
                onChange={handleInput}
              />
            </div>
            <div className="mb-3 ">
              الشعبه
              <select
                name="specialty"
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
                              specialty
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                            "
                value={userData.specialty}
                onChange={handleInput}
              >
                <option value={"نظم و معلومات"}>نظم و معلومات</option>
                <option value={"علوم حاسب"}>علوم حاسب</option>
              </select>
              الفرقة
              <select
                name="year"
                value={userData.year}
                onChange={handleInput}
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
                              
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                            "
              >
                <option value={1}> الأولى </option>
                <option value={2}> الثانيه </option>
                <option value={3}> الثالثه </option>
                <option value={4}> الرابعه </option>
              </select>
            </div>
            <div className="w-full text-center my-5">
              <div className="w-full  max-w-sm my-12 mx-auto rounded-lg overflow-hidden ">
                <button className="rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300">
                  تسجيل المادة
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
