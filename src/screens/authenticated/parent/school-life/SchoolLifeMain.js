import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";
import { useAuth } from "../../../../context/AuthContext";
import ActivityFeed from "../../../../components/activity-feed/ActivityFeed";

const SchoolLifeMain = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ActivityFeed userCategory={user?.user_category || 1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default SchoolLifeMain;
