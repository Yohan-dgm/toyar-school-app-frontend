import React from "react";
import { useSelector } from "react-redux";
import UniversalNotificationSystem from "../../../components/notifications/UniversalNotificationSystem";
import { RootState } from "../../../state-store/store";

export default function StudentNotifications() {
  const { user, token } = useSelector((state: RootState) => state.app);
  const userId = user?.id?.toString() || "1";

  return (
    <UniversalNotificationSystem
      userCategory="student"
      userId={userId}
      token={token}
    />
  );
}
