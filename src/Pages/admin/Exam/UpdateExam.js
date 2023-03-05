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

  function removeQuestion(i) {
    setQuestionData(
      questionData.filter((x, y) => {
        return y !== i;
      })
    );
  }

  function addQuestion() {
    setQuestionData([
      ...questionData,
      {
        q: "",
        score: 10,
        asn: ["", "", "", ""],
        trueAns: 0,
      },
    ]);
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 1);
  }

  const totalScore = () => {
    let x = 0;
    questionData.map((i) => {
      x = x + i.score * 1;
    });
    return x;
  };

  // Add Question
  async function saveExam() {
    await getDocs(
      query(collection(db, "questions"), where("subjecId", "==", examId))
    ).then((querySnapshot) => {
      querySnapshot.docs.map((docD) =>
        deleteDoc(doc(db, "questions", docD.id))
      );
    });

    questionData.map(async (item) => {
      await addDoc(collection(db, "questions"), {
        q: item.q,
        score: item.score,
        asn: item.asn,
        trueAns: item.trueAns,
        subjecId: examId,
      }).then(() => history("/exams"));
    });
  }

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <h2 className="text-[#09103A] text-center my-5  font-bold text-2xl">
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
          <h4 className="text-lg font-bold text-blue-700">
            إجمالى الدرجات : <span> {totalScore()}</span>
          </h4>
          <div
            onClick={() => saveExam()}
            className="cursor-pointer mb-2 rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
          >
            تسجيل الامتحان
          </div>
        </div>
        {questionData?.map((row, i) => (
          <div className="border border-black p-3 my-3" key={i}>
            <div className="w-full flex justify-between">
              <div className="my-4">{i + 1} :</div>
              <div
                onClick={() => removeQuestion(i)}
                className="cursor-pointer mb-2 rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
              >
                X
              </div>
            </div>
            <div className="flex">
              <h4 className="text-lg flex items-center w-full">
                <span>السؤال</span>
                <span className="px-3 w-full">
                  <input
                    type="text"
                    value={row.q}
                    name="q"
                    onChange={(e) => handleInput(e, i)}
                    className="w-full  p-3"
                    placeholder="السؤال"
                  />
                </span>
              </h4>
              <h4 className="text-lg flex items-center">
                <span className="">الدرجه </span>
                <span className="px-3">
                  <input
                    type="number"
                    value={row.score}
                    name="score"
                    onChange={(e) => handleInputNumber(e, i)}
                    className="w-full  p-3"
                  />
                </span>
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
                    checked={i2 === row.trueAns * 1}
                    onChange={(e) => handleInputTrueAns(e, i, i2)}
                  />

                  <label className="w-full  px-3 ">
                    <input
                      type="text"
                      value={anRow}
                      className="w-full  p-3"
                      onChange={(e) => handleInputAns(e, i, i2)}
                      placeholder="إجابه محتمله"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div
          onClick={() => addQuestion()}
          className="cursor-pointer mb-2 rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
        >
          أضف سوال
        </div>
      </div>
    </div>
  );
}
