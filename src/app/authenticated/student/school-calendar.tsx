import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import CommonSchoolCalendar from "@/components/common/calendar/CommonSchoolCalendar";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function StudentSchoolCalendar() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.STUDENT;

  const customEvents = [
    {
      title: "📝 Assignment Deadlines",
      description: "Important assignment and project due dates",
      icon: "assignment",
    },
    {
      title: "📖 Exam Schedules",
      description: "Test dates and examination periods",
      icon: "quiz",
    },
    {
      title: "🎓 Graduation Events",
      description: "Graduation ceremonies and milestone events",
      icon: "school",
    },
  ];

  return (
    <CommonSchoolCalendar
      userCategory={userCategory}
      title="School Calendar"
      subtitle="Academic schedule and important dates"
      customEvents={customEvents}
    />
  );
}