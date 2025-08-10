import React from "react";
import NotificationsMessagesMain from "../../../screens/authenticated/parent/notifications-messages/NotificationsMessagesMain";
import UnderDevelopmentOverlay from "../../../components/development/UnderDevelopmentOverlay";

export default function NotificationsMessagesPage() {
  return (
    <UnderDevelopmentOverlay featureName="Notifications & Messages">
      <NotificationsMessagesMain />
    </UnderDevelopmentOverlay>
  );
}
