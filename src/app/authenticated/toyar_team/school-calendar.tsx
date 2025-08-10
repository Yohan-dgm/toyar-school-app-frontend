import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import CommonSchoolCalendar from "@/components/common/calendar/CommonSchoolCalendar";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function ToyarTeamSchoolCalendar() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.TOYAR_TEAM;

  const customEvents = [
    {
      title: "🔧 System Maintenance",
      description: "Scheduled system maintenance and updates",
      icon: "build",
    },
    {
      title: "📊 Performance Reviews",
      description: "System performance analysis and optimization",
      icon: "analytics",
    },
  ];

  return (
    <CommonSchoolCalendar
      userCategory={userCategory}
      title="School Calendar"
      subtitle="Development schedule and system events"
      customEvents={customEvents}
    />
  );
}
