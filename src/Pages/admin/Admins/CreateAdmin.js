import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
  } from "firebase/firestore";
  import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
  
  export default function CreateAdmin() {
    let history = useNavigate();
    const [userData, setUserData] = useState({
      name: "",
      email: "",
      password: "",
      photo: "",
    });
  
    const [myUserData, setMyUserData] = useState({
      email: "",
      password: "",
    });
  
    const auth = getAuth();
    const db = getFirestore();
  
    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const q = query(
            collection(db, "admins"),
            where("email", "==", user.email)
          );
          const docs = await getDocs(q);
          docs.forEach((doc) => {
            setMyUserData({
              email: doc.data().email,
              password: doc.data().password,
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
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  
    function handleForm(e) {
      e.preventDefault();
  
      const db = getFirestore(); // initialize Firestore
  
      // const docRef = doc(db, userData.type, userData.id);
  
      if (file) {
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
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              try {
                const res = await createUserWithEmailAndPassword(
                  auth,
                  userData.email,
                  userData.password
                );
                const user = res.user;
                await addDoc(collection(db, "admins"), {
                  uid: user.uid,
                  name: userData.name,
                  email: userData.email,
                  password: userData.password,
                  photo: url,

                }).then(async () => {
                  setUserData({
                    name: "",
                    email: "",
                    password: "",
                    photo: url,
                  });
                  signOut(auth);
                  await signInWithEmailAndPassword(
                    auth,
                    myUserData.email,
                    myUserData.password
                  ).then(()=>{
                    
                    history("/admins");
                  });
                });
              } catch (err) {
                console.error(err);
                alert(err.message);
              }
            });
          }
        );
      }
    }
  
    return (
      <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
        <div className="FormContainer bg-[#DFDFDF] border-[#093a19] border-2 border-solid	w-1/2 rounded-lg">
          <div className="form px-3">
            <h2 className="text-[#093a19] text-center my-5  font-bold text-2xl">
              عمل حساب شئون طلبه
            </h2>
            <form onSubmit={handleForm}>
              <div className="user-img mb-5 flex justify-center flex-col align-middle items-center">
                <div className="flex justify-center flex-col align-middle items-center mt-5 pt-5">
                  صوره 
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
                  placeholder="الأسم"
                  value={userData.name}
                  onChange={handleInput}
                />
              </div>
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
                  placeholder="البريد الإلكترونى"
                  value={userData.email}
                  onChange={handleInput}
                />
              </div>
              <div className="mb-3">
                <label className="form-label inline-block mb-2 text-gray-700">
                  كلمه المرور
                </label>
                <input
                  type="password"
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
                  value={userData.password}
                  onChange={handleInput}
                />
              </div>
              <div className="w-full text-center my-5">
                <div className="w-full  max-w-sm my-12 mx-auto rounded-lg overflow-hidden ">
                  {percent == 0 || percent == 100 ? (
                    <button className="rounded-lg px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-green-100 duration-300">
                      تسجيل الحساب
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
  