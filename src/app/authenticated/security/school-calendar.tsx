import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import CommonSchoolCalendar from "@/components/common/calendar/CommonSchoolCalendar";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function SecuritySchoolCalendar() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.SECURITY;

  const customEvents = [
    {
      title: "🚨 Security Drills",
      description: "Emergency evacuation and safety drills",
      icon: "emergency",
    },
    {
      title: "👮 Security Training",
      description: "Staff security training and updates",
      icon: "school",
    },
  ];

  return (
    <CommonSchoolCalendar
      userCategory={userCategory}
      title="School Calendar"
      subtitle="Security events and safety schedules"
      customEvents={customEvents}
    />
  );
}
