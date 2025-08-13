import React from "react";
import { useSelector } from "react-redux";
import UniversalNotificationSystem from "../../../components/notifications/UniversalNotificationSystem";
import { USER_CATEGORIES } from "../../../constants/userCategories";
import { RootState } from "../../../state-store/store";

export default function PrincipalNotifications() {
  const { user, token } = useSelector((state: RootState) => state.app);
  const userId = user?.id?.toString() || "1";

  return (
    <UniversalNotificationSystem
      userCategory="principal"
      userId={userId}
      token={token}
    />
  );
}
