import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import MakePaymentPage from "./pages/MakePaymentPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";

const PaymentSection = ({ onClose, onNavigateToSubSection }) => {
  const [selectedTerm, setSelectedTerm] = useState("current");
  const [currentPage, setCurrentPage] = useState("main"); // main, make-payment, payment-history

  const paymentData = {
    current: {
      term: "Term 1 - 2025",
      totalFees: 125000,
      paidAmount: 75000,
      pendingAmount: 50000,
      dueDate: "2025-02-15",
      status: "Partially Paid",
    },
    upcoming: {
      term: "Term 2 - 2025",
      totalFees: 125000,
      paidAmount: 0,
      pendingAmount: 125000,
      dueDate: "2025-05-15",
      status: "Pending",
    },
  };

  const recentTransactions = [
    {
      id: "TXN001",
      date: "2025-01-15",
      amount: 25000,
      type: "Tuition Fee",
      status: "Completed",
      method: "Bank Transfer",
    },
    {
      id: "TXN002",
      date: "2025-01-10",
      amount: 50000,
      type: "Registration Fee",
      status: "Completed",
      method: "Credit Card",
    },
    {
      id: "TXN003",
      date: "2024-12-20",
      amount: 15000,
      type: "Activity Fee",
      status: "Completed",
      method: "Online Banking",
    },
  ];

  const quickActions = [
    {
      title: "Make Payment",
      description: "Pay pending fees online",
      icon: "payment",
      color: "#4CAF50",
      action: () => setCurrentPage("make-payment"),
    },
    {
      title: "Payment History",
      description: "View all transactions",
      icon: "history",
      color: "#2196F3",
      action: () => setCurrentPage("payment-history"),
    },
    {
      title: "Fee Structure",
      description: "View detailed fee breakdown",
      icon: "receipt-long",
      color: "#FF9800",
      action: () => onNavigateToSubSection("fee-structure"),
    },
    {
      title: "Payment Methods",
      description: "Manage payment options",
      icon: "credit-card",
      color: "#9C27B0",
      action: () => onNavigateToSubSection("payment-methods"),
    },
  ];

  const handleBackToMain = () => {
    setCurrentPage("main");
  };

  const currentData = paymentData[selectedTerm];

  // Handle different page views
  if (currentPage === "make-payment") {
    return <MakePaymentPage onClose={onClose} onBack={handleBackToMain} />;
  }

  if (currentPage === "payment-history") {
    return <PaymentHistoryPage onClose={onClose} onBack={handleBackToMain} />;
  }

  // Main payment section view
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Center</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => onNavigateToSubSection("payment-notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Term Selector */}
        <View style={styles.termSelector}>
          <TouchableOpacity
            style={[
              styles.termButton,
              selectedTerm === "current" && styles.activeTerm,
            ]}
            onPress={() => setSelectedTerm("current")}
          >
            <Text
              style={[
                styles.termButtonText,
                selectedTerm === "current" && styles.activeTermText,
              ]}
            >
              Current Term
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.termButton,
              selectedTerm === "upcoming" && styles.activeTerm,
            ]}
            onPress={() => setSelectedTerm("upcoming")}
          >
            <Text
              style={[
                styles.termButtonText,
                selectedTerm === "upcoming" && styles.activeTermText,
              ]}
            >
              Upcoming Term
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>{currentData.term}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    currentData.status === "Completed"
                      ? "#4CAF50"
                      : currentData.status === "Partially Paid"
                        ? "#FF9800"
                        : "#F44336",
                },
              ]}
            >
              <Text style={styles.statusText}>{currentData.status}</Text>
            </View>
          </View>

          <View style={styles.amountSection}>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Total Fees</Text>
              <Text style={styles.totalAmount}>
                LKR {currentData.totalFees.toLocaleString()}
              </Text>
            </View>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Paid Amount</Text>
              <Text style={styles.paidAmount}>
                LKR {currentData.paidAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Pending Amount</Text>
              <Text style={styles.pendingAmount}>
                LKR {currentData.pendingAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {currentData.pendingAmount > 0 && (
            <View style={styles.dueDateSection}>
              <MaterialIcons name="schedule" size={20} color="#FF5722" />
              <Text style={styles.dueDateText}>
                Due Date: {currentData.dueDate}
              </Text>
            </View>
          )}

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Payment Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentData.paidAmount / currentData.totalFees) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(
                (currentData.paidAmount / currentData.totalFees) * 100
              )}
              % Completed
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.action}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color },
                  ]}
                >
                  <MaterialIcons name={action.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => onNavigateToSubSection("payment-history")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.slice(0, 3).map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialIcons
                  name={
                    transaction.status === "Completed"
                      ? "check-circle"
                      : "pending"
                  }
                  size={24}
                  color={
                    transaction.status === "Completed" ? "#4CAF50" : "#FF9800"
                  }
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <Text style={styles.transactionMethod}>
                  {transaction.method}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.transactionAmountText}>
                  LKR {transaction.amount.toLocaleString()}
                </Text>
                <Text style={styles.transactionStatus}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Reminders */}
        <View style={styles.remindersSection}>
          <Text style={styles.sectionTitle}>Payment Reminders</Text>
          <View style={styles.reminderCard}>
            <MaterialIcons
              name="notification-important"
              size={24}
              color="#FF5722"
            />
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>Term 1 Fee Due Soon</Text>
              <Text style={styles.reminderText}>
                LKR 50,000 is due on February 15, 2025. Pay now to avoid late
                fees.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reminderAction}
              onPress={() => onNavigateToSubSection("make-payment")}
            >
              <Text style={styles.reminderActionText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <TouchableOpacity
            style={styles.supportItem}
            onPress={() => onNavigateToSubSection("payment-support")}
          >
            <MaterialIcons
              name="help-outline"
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.supportText}>
              <Text style={styles.supportTitle}>Payment Support</Text>
              <Text style={styles.supportDescription}>
                Get help with payments and billing
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
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
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  termSelector: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 8,
    padding: 4,
  },
  termButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTerm: {
    backgroundColor: theme.colors.primary,
  },
  termButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  activeTermText: {
    color: "#FFFFFF",
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  amountSection: {
    marginBottom: 20,
  },
  amountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  paidAmount: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#4CAF50",
  },
  pendingAmount: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#FF5722",
  },
  dueDateSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dueDateText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#FF5722",
    marginLeft: 8,
  },
  progressSection: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    textAlign: "center",
  },
  quickActionsSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginBottom: 15,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 5,
  },
  quickActionDescription: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    textAlign: "center",
  },
  transactionsSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginTop: 2,
  },
  transactionMethod: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#999999",
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  transactionAmountText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  transactionStatus: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#4CAF50",
    marginTop: 2,
  },
  remindersSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
  },
  reminderContent: {
    flex: 1,
    marginLeft: 15,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#FF5722",
    marginBottom: 5,
  },
  reminderText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  reminderAction: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 15,
  },
  reminderActionText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  supportSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  supportText: {
    flex: 1,
    marginLeft: 15,
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  supportDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginTop: 2,
  },
});

export default PaymentSection;
