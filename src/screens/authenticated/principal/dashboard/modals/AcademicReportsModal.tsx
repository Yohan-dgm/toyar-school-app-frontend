import React, { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";

const AcademicReportsModal = forwardRef<Modalize>((_, ref) => {
  return (
    <Modalize
      ref={ref}
      modalTopOffset={0}
      modalHeight={999999}
      adjustToContentHeight={false}
      modalStyle={styles.modal}
      rootStyle={styles.modalRoot}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      HeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="assessment" size={24} color="#607D8B" />
            <Text style={styles.headerTitle}>Academic Reports</Text>
          </View>
        </View>
      }
    >
      <View style={styles.container}>
        <Text style={styles.placeholder}>Academic Reports & Analytics</Text>
        <Text style={styles.subtitle}>Feature coming soon...</Text>
      </View>
    </Modalize>
  );
});

const styles = StyleSheet.create({
  modalRoot: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    height: "100%",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 99999,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 12,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    fontSize: 18,
    fontWeight: "600",
    color: "#607D8B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default AcademicReportsModal;
