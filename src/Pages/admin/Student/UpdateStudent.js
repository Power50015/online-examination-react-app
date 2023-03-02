import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export default function UpdateStudent() {
  const { stuId } = useParams();
  let history = useNavigate();

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

  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);

  const storage = getStorage();

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  function handleInput(e) {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  }

  function handleForm(e) {
    e.preventDefault();

    const docRef = doc(db, studentData.type, studentData.id);

    if (!file) {
      const data = {
        name: studentData.name,
        photo: studentData.photo,
        type: "students",
        specialty: studentData.specialty,
        year: studentData.year,
      };

      updateDoc(docRef, data)
        .then((docRef) => {
          console.log(
            "A New Document Field has been added to an existing document"
          );
          setStudentData({
            id: studentData.id,
            name: studentData.name,
            email: studentData.email,
            photo: studentData.photo,
            type: studentData.type,
            specialty: studentData.specialty,
            year: studentData.year,
          });
          history("/students");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const storageRef = ref(storage, `/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress

          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);

            const data = {
              name: studentData.name,
              photo: url,
            };

            updateDoc(docRef, data)
              .then((docRef) => {
                console.log(
                  "A New Document Field has been added to an existing document"
                );
                setStudentData({
                  id: studentData.id,
                  name: studentData.name,
                  email: studentData.email,
                  photo: url,
                  type: studentData.type,
                  specialty: studentData.specialty,
                  year: studentData.year,
                });
                history("/students");
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
    }
  }

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <div className="FormContainer bg-[#DFDFDF] border-[#09103A] border-2 border-solid	w-1/2 rounded-lg">
        <div className="form px-3">
          <h2 className="text-[#09103A] text-center my-5  font-bold text-2xl">
            عمل حساب طالب
          </h2>
          <form onSubmit={handleForm}>
            <div className="user-img flex justify-center flex-col align-middle items-center">
              <img
                src={studentData.photo}
                width="135"
                className="rounded-full border-4 border-[#3281c0]"
                alt=""
              />
              <h4>{studentData.email}</h4>
            </div>
            <div className="user-img mb-5 flex justify-center flex-col align-middle items-center">
              <div className="flex justify-center flex-col align-middle items-center mt-5 pt-5">
                صوره الطالب
                <input type="file" onChange={handleChange} accept="" />
              </div>
            </div>
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
                value={studentData.name}
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
                value={studentData.specialty}
                onChange={handleInput}
              >
                <option value={"نظم و معلومات"}>نظم و معلومات</option>
                <option value={"علوم حاسب"}>علوم حاسب</option>
              </select>
              الفرقة
              <select
                name="year"
                value={studentData.year}
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
                {percent === 0 || percent === 100 ? (
                  <button className="rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300">
                    تعديل الحساب
                  </button>
                ) : (
                  <div
                    className="bg-green-500 text-xs leading-none py-1"
                    style={{ width: percent + "%" }}
                  ></div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
