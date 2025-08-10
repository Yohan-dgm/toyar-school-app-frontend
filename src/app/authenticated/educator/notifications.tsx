import React from "react";
import EducatorNotificationsMain from "../../../screens/authenticated/educator/notifications/EducatorNotificationsMain";
import UnderDevelopmentOverlay from "../../../components/development/UnderDevelopmentOverlay";

export default function EducatorNotificationsPage() {
  return (
    <UnderDevelopmentOverlay featureName="Notifications">
      <EducatorNotificationsMain />
    </UnderDevelopmentOverlay>
  );
}
