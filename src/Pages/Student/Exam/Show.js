import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function UpdateExam() {
  const db = getFirestore();
  const { examId } = useParams();
  let history = useNavigate();
  const auth = getAuth();

  const [questionData, setQuestionData] = useState([]);

  const [selectedSubjectData, setSelectedSubjectData] = useState({
    index: null,
    name: null,
    specialty: null,
    year: null,
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photo: "",
    specialty: "",
    year: "",
    type: "",
  });

  const fetchQuestion = async () => {
    const size = 3; // size of Exam
    await getDocs(
      query(collection(db, "questions"), where("subjecId", "==", examId))
    ).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        stuAns: null,
        ...doc.data(),
      }));
      let tempData = [];
      do {
        let item = newData[(newData.length * Math.random()) | 0];
        if (!tempData.includes(item)) {
          tempData.push(item);
        }
      } while (tempData.length < size);
      setQuestionData(tempData);
    });
  };

  const fetchSub = async () => {
    const q = query(collection(db, "exams"), where("subjecId", "==", examId));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      setSelectedSubjectData({
        index: examId,
        name: doc.data().subjectName,
        specialty: doc.data().subjectSpecialty,
        year: doc.data().subjectYear,
      });
    });
  };

  function handleInputTrueAns(e, i, i2) {
    //stuAns
    let tempData = questionData;
    tempData[i].stuAns = e.target.value;
    setQuestionData([...tempData]);
  }

  const collectedScore = () => {
    let x = 0;
    questionData.map((i) => {
      if (i.trueAns + 1 === i.stuAns + 1) x = x + i.score * 1;
    });
    return x;
  };

  const totalScore = () => {
    let x = 0;
    questionData.map((i) => {
      x = x + i.score * 1;
    });
    return x;
  };

  // Add Question
  async function saveExam() {
    await addDoc(collection(db, "studExams"), {
      subjecId: selectedSubjectData.index,
      subjectName: selectedSubjectData.name,
      subjectSpecialty: selectedSubjectData.specialty,
      subjectYear: selectedSubjectData.year,
      totalScore: totalScore(),
      collectedScore: collectedScore(), 
      stuId: userData.id, 
      stuName: userData.name, 
      email: userData.email, 
      date: Date.now()
    }).then((res) => {
      questionData.map(async (item) => {
        await addDoc(collection(db, "studQuestions"), {
          q: item.q,
          score: item.score,
          asn: item.asn,
          trueAns: item.trueAns,
          stuAns: item.stuAns,
          subjecId: selectedSubjectData.index,
          stuId: userData.id, 
          stuName: userData.name, 
          email: userData.email, 
        }).then(() => history("/"));
      });
    });
  }

  useEffect(() => {
    fetchSub();
    fetchQuestion();
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
      }
    });
  }, [userData.year]);
  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <h2 className="text-[#093a19] text-center my-5  font-bold text-2xl">
        عمل إمتحان
      </h2>
      <div className="w-full">
        <div className="flex justify-between mt-4">
          <h4 className="text-lg">
            المادة : <span> {selectedSubjectData.name}</span>
          </h4>
          <h4 className="text-lg">
            الشعبه : <span> {selectedSubjectData.specialty}</span>
          </h4>
          <h4 className="text-lg">
            الفرقه :
            <span>
              {selectedSubjectData.year === "1" && "الأولى"}
              {selectedSubjectData.year === "2" && "الثانيه"}
              {selectedSubjectData.year === "3" && "الثالثه"}
              {selectedSubjectData.year === "4" && "الرابعه"}
            </span>
          </h4>
          <h4 className="text-lg font-bold text-green-700">
            إجمالى الدرجات : <span> {totalScore()}</span>
            <span className="hidden">{collectedScore()}</span>
          </h4>
          <div
            onClick={() => saveExam()}
            className="cursor-pointer mb-2 rounded-lg px-4 py-2  bg-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
          >
            إنهاء الامتحان
          </div>
        </div>
        {questionData?.map((row, i) => (
          <div className="border border-black p-3 my-3" key={i}>
            <div className="w-full flex justify-between">
              <div className="my-4">{i + 1} :</div>
            </div>
            <div className="flex">
              <h4 className="text-lg flex items-center w-full">
                <span>السؤال</span>
                <span className="px-3 w-full bg-white p-2 m-1">{row.q}</span>
              </h4>
              <h4 className="text-lg flex items-center">
                <span className="">الدرجه </span>
                <span className="px-3">{row.score}</span>
              </h4>
            </div>
            <div className=" mt-3">
              <div className="mb-3 text-lg font-bold">الإجابات</div>
              {row.asn?.map((anRow, i2) => (
                <div className="mb-3 flex" key={i2}>
                  <input
                    type="radio"
                    name={`radio` + i}
                    value={i2}
                    onChange={(e) => handleInputTrueAns(e, i, i2)}
                  />

                  <span className="mx-2">{anRow}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
