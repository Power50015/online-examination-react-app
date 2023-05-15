import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function UpdateExam() {
  const db = getFirestore();
  const { examId } = useParams();
  let history = useNavigate();

  const [questionData, setQuestionData] = useState([]);

  const [selectedSubjectData, setSelectedSubjectData] = useState({
    index: null,
    name: null,
    specialty: null,
    year: null,
  });

  const fetchQuestion = async () => {
    await getDocs(
      query(collection(db, "questions"), where("subjecId", "==", examId))
    ).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestionData(newData);
    });
  };

  const fetchSub = async () => {
    const q = query(collection(db, "exams"), where("subjecId", "==", examId));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      setSelectedSubjectData({
        index: doc.id,
        name: doc.data().subjectName,
        specialty: doc.data().subjectSpecialty,
        year: doc.data().subjectYear,
      });
    });
  };

  useEffect(() => {
    fetchSub();
    fetchQuestion();
  }, []);

  function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  }

  function handleInput(e, i) {
    let tempData = questionData;
    let tempRow = {
      ...questionData[i],
      [e.target.name]: e.target.value,
    };
    tempData[i] = tempRow;
    setQuestionData([...tempData]);
  }

  function handleInputNumber(e, i) {
    if (isNumeric(e.target.value)) {
      let tempData = questionData;
      let tempRow = {
        ...questionData[i],
        [e.target.name]: e.target.value,
      };
      tempData[i] = tempRow;
      setQuestionData([...tempData]);
    }
  }

  function handleInputAns(e, i, i2) {
    let tempData = questionData;
    tempData[i].asn[i2] = e.target.value;
    setQuestionData([...tempData]);
  }

  function handleInputTrueAns(e, i, i2) {
    let tempData = questionData;
    tempData[i].trueAns = e.target.value;
    setQuestionData([...tempData]);
  }

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
        </div>
        {questionData?.map((row, i) => (
          <div className="border border-black p-3 my-3" key={i}>
            <div className="w-full flex justify-between">
              <div className="my-4">{i + 1} :</div>
            </div>
            <div className="flex">
              <h4 className="text-lg flex items-center w-full">
                <span className="px-3 w-full bg-slate-400 p-3">{row.q}</span>
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
                  {i2 === row.trueAns * 1 ? (
                    <div className="text-white w-full bg-slate-500 p-3">{anRow}</div>
                  ) : (
                    <div className="w-full bg-slate-300 p-3">{anRow}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
