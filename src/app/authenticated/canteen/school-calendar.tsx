import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import CommonSchoolCalendar from "@/components/common/calendar/CommonSchoolCalendar";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function CanteenSchoolCalendar() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.CANTEEN;

  const customEvents = [
    {
      title: "🍽️ Special Menus",
      description: "Holiday and celebration special meal events",
      icon: "restaurant",
    },
    {
      title: "📦 Supply Deliveries",
      description: "Scheduled food and supply delivery dates",
      icon: "local_shipping",
    },
  ];

  return (
    <CommonSchoolCalendar
      userCategory={userCategory}
      title="School Calendar"
      subtitle="Food service schedules and events"
      customEvents={customEvents}
    />
  );
}