import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../../styles/theme";

const PaymentHistoryPage = ({ onClose, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const paymentHistory = [
    {
      id: "TXN2025001",
      date: "2025-01-15",
      amount: 25000,
      type: "Tuition Fee",
      status: "Completed",
      method: "Bank Transfer",
      reference: "BT20250115001",
      description: "Term 1 - Partial Payment",
      receiptUrl: "#",
    },
    {
      id: "TXN2025002",
      date: "2025-01-10",
      amount: 50000,
      type: "Registration Fee",
      status: "Completed",
      method: "Credit Card",
      reference: "CC20250110002",
      description: "Annual Registration",
      receiptUrl: "#",
    },
    {
      id: "TXN2024003",
      date: "2024-12-20",
      amount: 15000,
      type: "Activity Fee",
      status: "Completed",
      method: "Online Banking",
      reference: "OB20241220003",
      description: "Sports & Extra-curricular",
      receiptUrl: "#",
    },
    {
      id: "TXN2024004",
      date: "2024-12-15",
      amount: 75000,
      type: "Tuition Fee",
      status: "Completed",
      method: "Mobile Payment",
      reference: "MP20241215004",
      description: "Term 3 - Full Payment",
      receiptUrl: "#",
    },
    {
      id: "TXN2024005",
      date: "2024-11-30",
      amount: 12000,
      type: "Library Fee",
      status: "Failed",
      method: "Credit Card",
      reference: "CC20241130005",
      description: "Library Resources",
      receiptUrl: null,
    },
    {
      id: "TXN2024006",
      date: "2024-11-25",
      amount: 30000,
      type: "Exam Fee",
      status: "Completed",
      method: "Bank Transfer",
      reference: "BT20241125006",
      description: "Final Examinations",
      receiptUrl: "#",
    },
    {
      id: "TXN2024007",
      date: "2024-10-20",
      amount: 85000,
      type: "Tuition Fee",
      status: "Completed",
      method: "Online Banking",
      reference: "OB20241020007",
      description: "Term 2 - Full Payment",
      receiptUrl: "#",
    },
    {
      id: "TXN2024008",
      date: "2024-09-15",
      amount: 20000,
      type: "Transport Fee",
      status: "Pending",
      method: "Mobile Payment",
      reference: "MP20240915008",
      description: "School Transport Service",
      receiptUrl: null,
    },
  ];

  const filterOptions = [
    { key: "all", label: "All Payments" },
    { key: "completed", label: "Completed" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
  ];

  const getFilteredPayments = () => {
    let filtered = paymentHistory;

    // Filter by status
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (payment) => payment.status.toLowerCase() === selectedFilter,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (payment) =>
          payment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#666666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "check-circle";
      case "pending":
        return "schedule";
      case "failed":
        return "error";
      default:
        return "help";
    }
  };

  const getTotalAmount = () => {
    return paymentHistory
      .filter((payment) => payment.status === "Completed")
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const handleDownloadReceipt = (payment) => {
    if (payment.receiptUrl) {
      // Here you would implement actual receipt download
      console.log("Downloading receipt for:", payment.id);
    }
  };

  const PaymentCard = ({ payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentType}>{payment.type}</Text>
          <Text style={styles.paymentDate}>{payment.date}</Text>
        </View>
        <View style={styles.paymentStatus}>
          <MaterialIcons
            name={getStatusIcon(payment.status)}
            size={20}
            color={getStatusColor(payment.status)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(payment.status) },
            ]}
          >
            {payment.status}
          </Text>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            LKR {payment.amount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID:</Text>
          <Text style={styles.detailValue}>{payment.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method:</Text>
          <Text style={styles.detailValue}>{payment.method}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reference:</Text>
          <Text style={styles.detailValue}>{payment.reference}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{payment.description}</Text>
        </View>
      </View>

      {payment.status === "Completed" && payment.receiptUrl && (
        <View style={styles.paymentActions}>
          <TouchableOpacity
            style={styles.receiptButton}
            onPress={() => handleDownloadReceipt(payment)}
          >
            <MaterialIcons
              name="receipt"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.receiptButtonText}>Download Receipt</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryValue}>
            LKR {getTotalAmount().toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Transactions</Text>
          <Text style={styles.summaryValue}>{paymentHistory.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Successful</Text>
          <Text style={styles.summaryValue}>
            {paymentHistory.filter((p) => p.status === "Completed").length}
          </Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilterSection}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                selectedFilter === option.key && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === option.key &&
                    styles.activeFilterButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Payment List */}
      <ScrollView
        style={styles.paymentList}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredPayments().length > 0 ? (
          getFilteredPayments().map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No Payments Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() || selectedFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't made any payments yet"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  closeButton: {
    padding: 8,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  searchFilterSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    paddingVertical: 12,
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  activeFilterButtonText: {
    color: "#FFFFFF",
  },
  paymentList: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 15,
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  paymentStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    marginLeft: 5,
  },
  paymentDetails: {
    padding: 20,
  },
  amountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  amountValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  paymentActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  receiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "10",
    paddingVertical: 12,
    borderRadius: 8,
  },
  receiptButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#666666",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#999999",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default PaymentHistoryPage;
