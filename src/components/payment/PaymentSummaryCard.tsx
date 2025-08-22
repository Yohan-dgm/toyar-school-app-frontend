import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BillSummary, PaymentStatus } from "../../types/payment";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { theme } from "../../styles/theme";

interface PaymentSummaryCardProps {
  summary: BillSummary | null;
  paymentStatus: PaymentStatus;
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  summary,
  paymentStatus,
}) => {
  if (!summary) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="receipt" size={48} color="#CCCCCC" />
          <Text style={styles.emptyText}>No payment data available</Text>
        </View>
      </View>
    );
  }

  const formatAmount = (amount: number) => {
    return `LKR ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getProgressPercentage = () => {
    if (summary.totalAmount === 0) return 0;
    return (summary.paidAmount / summary.totalAmount) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.studentInfo}>
          <MaterialIcons name="person" size={24} color={theme.colors.primary} />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{summary.studentName}</Text>
            <Text style={styles.billCount}>{summary.billsCount} Bills</Text>
          </View>
        </View>
        <PaymentStatusBadge status={paymentStatus} size="medium" />
      </View>

      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              {formatAmount(summary.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Paid Amount</Text>
            <Text style={styles.paidAmount}>
              {formatAmount(summary.paidAmount)}
            </Text>
          </View>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Pending Amount</Text>
            <Text style={styles.pendingAmount}>
              {formatAmount(summary.pendingAmount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Payment Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: paymentStatus.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(getProgressPercentage())}% Complete
          </Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{summary.billsCount}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="schedule" size={20} color="#FF9800" />
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="error" size={20} color="#F44336" />
          <Text style={styles.statLabel}>Overdue</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  studentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  billCount: {
    fontSize: 14,
    color: "#666666",
  },
  amountSection: {
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  amountItem: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  paidAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  pendingAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF5722",
    textAlign: "right",
  },
  progressSection: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
    minWidth: 60,
    textAlign: "right",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
    marginTop: 12,
  },
});

export default PaymentSummaryCard;
