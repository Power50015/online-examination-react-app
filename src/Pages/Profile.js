import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function Profile() {
  const auth = getAuth();
  const db = getFirestore();

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    photo: "",
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
        docs.forEach((doc) => {
          setUserData({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            photo: doc.data().photo,
            type: "admins",
          });
        });
      }
    });
  }, []);

  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);

  const storage = getStorage();

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  function handleInput(e) {
    setUserData({ ...userData, name: e.target.value });
  }

  function handleUpload() {
    const db = getFirestore(); // initialize Firestore

    const docRef = doc(db, userData.type, userData.id);

    if (!file) {
      const data = {
        name: userData.name,
      };

      updateDoc(docRef, data)
        .then((docRef) => {
          console.log(
            "A New Document Field has been added to an existing document"
          );
          setUserData({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            photo: userData.photo,
            type: userData.type,
          });
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
              name: userData.name,
              photo: url,
            };

            updateDoc(docRef, data)
              .then((docRef) => {
                console.log(
                  "A New Document Field has been added to an existing document"
                );
                setUserData({
                  id: userData.id,
                  name: userData.name,
                  email: userData.email,
                  photo: url,
                  type: userData.type,
                });
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
    <div className="w-full">
      <div className="px-4 py-4  mb-4 flex justify-center flex-col align-middle items-center">
        <div className="w-96 border	rounded-lg border-green-500 px-4 py-4 bg-[#DFDFDF] flex justify-center flex-col align-middle items-center">
          <div className="user-img mb-5 flex justify-center flex-col align-middle items-center">
            <img
              src={userData.photo}
              width="135"
              className="rounded-full border-4 border-[#28ff6e]"
              alt=""
            />
            <h4>{userData.email}</h4>
            <h4>شئون طلبه</h4>
            <div className="flex justify-center flex-col align-middle items-center mt-5 pt-5">
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
                            focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none
                          "
              value={userData.name}
              onChange={handleInput}
              placeholder="الأسم"
            />

            <div className="flex justify-center flex-col align-middle items-center">
              <button
                onClick={handleUpload}
                className="mb-4 mt-3 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
              >
                تغير البيانات
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 max-w-sm my-12 mx-auto rounded-lg overflow-hidden border border-gray-300">
            <div
              className="bg-green-500 text-xs leading-none py-1"
              style={{ width: percent + "%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
