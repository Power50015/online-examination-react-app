import React from "react";
import UserCard from "../../Component/UserCard";
import AdminBox from "../../Component/AdminBox";
import SubjectBox from "../../Component/SubjectBox";
import StudentBox from "../../Component/StudentBox";
import ExamsBox from "../../Component/ExamsBox";

export default function Dashborad() {
  return (
    <div className="container mx-auto mt-4 flex justify-between">
      <div className="w-1/3 px-3 flex justify-between flex-col">
        <UserCard />
      </div>
    </div>
  );
}
