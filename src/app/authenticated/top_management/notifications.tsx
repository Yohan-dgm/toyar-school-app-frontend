import React from "react";
import { useSelector } from "react-redux";
import UniversalNotificationSystem from "../../../components/notifications/UniversalNotificationSystem";
import { RootState } from "../../../state-store/store";

export default function TopManagementNotifications() {
  const { user, token } = useSelector((state: RootState) => state.app);
  const userId = user?.id?.toString() || "1";

  return (
    <UniversalNotificationSystem
      userCategory="top_management"
      userId={userId}
      token={token}
    />
  );
}
