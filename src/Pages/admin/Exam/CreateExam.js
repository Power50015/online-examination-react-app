import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateExam() {
  const db = getFirestore();
  let history = useNavigate();


  const [subjectData, setSubjectData] = useState([]);

  const [questionData, setQuestionData] = useState([]);

  const [selectedSubjectData, setSelectedSubjectData] = useState({
    index: null,
    name: null,
    specialty: null,
    year: null,
  });

  const fetchSub = async () => {
    await getDocs(collection(db, "subjects")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => {
        var flag = !doc.data().exam;
        if (flag) {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }
      });
      setSubjectData(newData);
    });
  };

  useEffect(() => {
    fetchSub();
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

  function selectSubject(e) {
    setSelectedSubjectData({
      id: subjectData[e.target.value].id,
      name: subjectData[e.target.value].name,
      specialty: subjectData[e.target.value].specialty,
      year: subjectData[e.target.value].year,
    });
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
        trueAns: "",
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

  function saveExam() {
    const db = getFirestore(); // initialize Firestore

    updateDoc(doc(db, "subjects", selectedSubjectData.id), {
      name: selectedSubjectData.name,
      specialty: selectedSubjectData.specialty,
      year: selectedSubjectData.year,
      exam: true,
    })
      .then(async () => {
        await addDoc(collection(db, "exams"), {
          subjecId: selectedSubjectData.id,
          subjectName: selectedSubjectData.name,
          subjectSpecialty: selectedSubjectData.specialty,
          subjectYear: selectedSubjectData.year,
          totalScore: totalScore(),
        }).then((res) => {
          questionData.map(async (item) => {
            await addDoc(collection(db, "questions"), {
              q: item.q,
              score: item.score,
              asn: item.asn,
              trueAns: item.trueAns,
              subjecId: selectedSubjectData.id,
            }).then(() => history("/exams"));
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <h2 className="text-[#093a19] text-center my-5  font-bold text-2xl">
        عمل إمتحان
      </h2>
      <div className="w-full">
        <div>
          المادة
          <select
            name="subject"
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
            value={setQuestionData.index}
            onChange={selectSubject}
          >
            <option value={null}></option>
            {subjectData?.map(
              (row, i) =>
                row && (
                  <option
                    value={i}
                    className="flex justify-between items-center align-middle mb-5 hover:text-green-600 border-b border-black"
                    key={i}
                  >
                    {row.name} -{row.specialty} - الفرقه :
                    {row.year === "1" && "الأولى"}
                    {row.year === "2" && "الثانيه"}
                    {row.year === "3" && "الثالثه"}
                    {row.year === "4" && "الرابعه"}
                  </option>
                )
            )}
          </select>
        </div>
        <div className="flex justify-between mt-4">
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
          </h4>
          <div
            onClick={() => saveExam()}
            className="cursor-pointer mb-2 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
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
                className="cursor-pointer mb-2 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
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
                {/* <span className="">الدرجه </span>
                <span className="px-3">
                  <input
                    type="number"
                    value={row.score}
                    name="score"
                    onChange={(e) => handleInputNumber(e, i)}
                    className="w-full  p-3"
                  />
                </span> */}
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
          className="cursor-pointer mb-2 rounded-lg px-4 py-2 border-2 border-green-500 text-white hover:bg-green-600 hover:text-green-100 duration-300"
        >
          أضف سوال
        </div>
      </div>
    </div>
  );
}
