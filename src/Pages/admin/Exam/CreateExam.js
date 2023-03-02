import { collection, getDocs, getFirestore } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CreateExam() {
  const db = getFirestore();
  const [subjectData, setSubjectData] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(db, "subjects")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSubjectData(newData);
    });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const [questionData, setQuestionData] = useState([]);

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
      x = x + i.score;
    });
    return x;
  };

  return (
    <div className="container mx-auto mt-4 flex justify-center flex-col	items-center">
      <h2 className="text-[#09103A] text-center my-5  font-bold text-2xl">
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
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                          "
          >
            {subjectData?.map((row, i) => (
              <option
                value={i}
                className="flex justify-between items-center align-middle mb-5 hover:text-blue-600 border-b border-black"
                key={i}
                onChange={() => {}}
              >
                {row.name} -{row.specialty} - الفرقه :
                {row.year === "1" && "الأولى"}
                {row.year === "2" && "الثانيه"}
                {row.year === "3" && "الثالثه"}
                {row.year === "4" && "الرابعه"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between mt-4">
          <h4 className="text-lg">
            الشعبه : <span> نظم و معلومات</span>
          </h4>
          <h4 className="text-lg">
            الفرقه : <span> الأولى</span>
          </h4>
          <h4 className="text-lg font-bold text-blue-700">
            إجمالى الدرجات : <span> {totalScore()}</span>
          </h4>
          <div
            onClick={() => addQuestion()}
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
                    onChange={() => ""}
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
                    onChange={() => ""}
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
                    value={anRow}
                    onChange={(e) => console.log(anRow)}
                  />

                  <label className="w-full  px-3 ">
                    <input
                      type="text"
                      value={anRow}
                      className="w-full  p-3"
                      onChange={() => ""}
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
