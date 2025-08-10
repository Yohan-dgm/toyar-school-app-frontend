import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../../styles/theme";

const MakePaymentPage = ({ onClose, onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentStep, setPaymentStep] = useState(1); // 1: Amount, 2: Method, 3: Confirmation

  const predefinedAmounts = [
    {
      label: "Full Term Fee",
      amount: 125000,
      description: "Complete term payment",
    },
    {
      label: "Tuition Fee",
      amount: 75000,
      description: "Academic tuition only",
    },
    {
      label: "Activity Fee",
      amount: 25000,
      description: "Sports and activities",
    },
    {
      label: "Library Fee",
      amount: 15000,
      description: "Library and resources",
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "credit-card",
      description: "Visa, MasterCard, American Express",
      fee: "2.5% processing fee",
    },
    {
      id: "bank",
      name: "Online Banking",
      icon: "account-balance",
      description: "Direct bank transfer",
      fee: "No additional fees",
    },
    {
      id: "mobile",
      name: "Mobile Payment",
      icon: "phone-android",
      description: "eZCash, mCash, Dialog Pay",
      fee: "1.5% processing fee",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: "account-balance-wallet",
      description: "PayPal, Google Pay, Apple Pay",
      fee: "2% processing fee",
    },
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount.toString());
    setCustomAmount("");
  };

  const handleCustomAmountChange = (text) => {
    setCustomAmount(text);
    setSelectedAmount("");
  };

  const getCurrentAmount = () => {
    return selectedAmount || customAmount;
  };

  const handleNextStep = () => {
    if (paymentStep === 1) {
      if (!getCurrentAmount() || parseInt(getCurrentAmount()) < 1000) {
        Alert.alert(
          "Invalid Amount",
          "Please select or enter a valid amount (minimum LKR 1,000)",
        );
        return;
      }
      setPaymentStep(2);
    } else if (paymentStep === 2) {
      if (!selectedMethod) {
        Alert.alert(
          "Payment Method Required",
          "Please select a payment method",
        );
        return;
      }
      setPaymentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (paymentStep > 1) {
      setPaymentStep(paymentStep - 1);
    } else {
      onBack();
    }
  };

  const handleConfirmPayment = () => {
    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to proceed with payment of LKR ${parseInt(getCurrentAmount()).toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            // Here you would integrate with actual payment gateway
            Alert.alert(
              "Payment Initiated",
              "You will be redirected to the payment gateway.",
            );
            onClose();
          },
        },
      ],
    );
  };

  const renderAmountStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Payment Amount</Text>

      {/* Predefined Amounts */}
      <View style={styles.amountSection}>
        <Text style={styles.sectionLabel}>Quick Select</Text>
        {predefinedAmounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountCard,
              selectedAmount === amount.amount.toString() &&
                styles.selectedAmountCard,
            ]}
            onPress={() => handleAmountSelect(amount.amount)}
          >
            <View style={styles.amountInfo}>
              <Text style={styles.amountLabel}>{amount.label}</Text>
              <Text style={styles.amountDescription}>{amount.description}</Text>
            </View>
            <Text style={styles.amountValue}>
              LKR {amount.amount.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Amount */}
      <View style={styles.customAmountSection}>
        <Text style={styles.sectionLabel}>Custom Amount</Text>
        <View style={styles.customAmountInput}>
          <Text style={styles.currencyLabel}>LKR</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <Text style={styles.minimumNote}>Minimum payment: LKR 1,000</Text>
      </View>
    </ScrollView>
  );

  const renderMethodStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Payment Method</Text>

      <View style={styles.methodSection}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.selectedMethodCard,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodIcon}>
              <MaterialIcons
                name={method.icon}
                size={32}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
              <Text style={styles.methodFee}>{method.fee}</Text>
            </View>
            <View style={styles.methodSelector}>
              <MaterialIcons
                name={
                  selectedMethod === method.id
                    ? "radio-button-checked"
                    : "radio-button-unchecked"
                }
                size={24}
                color={
                  selectedMethod === method.id
                    ? theme.colors.primary
                    : "#CCCCCC"
                }
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderConfirmationStep = () => {
    const selectedMethodData = paymentMethods.find(
      (m) => m.id === selectedMethod,
    );
    const amount = parseInt(getCurrentAmount());
    const processingFee =
      selectedMethod === "card"
        ? amount * 0.025
        : selectedMethod === "mobile"
          ? amount * 0.015
          : selectedMethod === "wallet"
            ? amount * 0.02
            : 0;
    const totalAmount = amount + processingFee;

    return (
      <ScrollView style={styles.stepContent}>
        <Text style={styles.stepTitle}>Confirm Payment Details</Text>

        <View style={styles.confirmationCard}>
          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>Payment Amount</Text>
            <Text style={styles.confirmationValue}>
              LKR {amount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>Payment Method</Text>
            <Text style={styles.confirmationValue}>
              {selectedMethodData?.name}
            </Text>
          </View>

          {processingFee > 0 && (
            <View style={styles.confirmationSection}>
              <Text style={styles.confirmationLabel}>Processing Fee</Text>
              <Text style={styles.confirmationValue}>
                LKR {processingFee.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={[styles.confirmationSection, styles.totalSection]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              LKR {totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.termsSection}>
          <MaterialIcons name="info" size={20} color={theme.colors.primary} />
          <Text style={styles.termsText}>
            By proceeding, you agree to our Terms of Service and Payment Policy.
            This transaction is secure and encrypted.
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePreviousStep}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make Payment</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressStep, paymentStep >= 1 && styles.activeStep]}
          >
            <Text
              style={[
                styles.stepNumber,
                paymentStep >= 1 && styles.activeStepText,
              ]}
            >
              1
            </Text>
          </View>
          <View
            style={[styles.progressLine, paymentStep >= 2 && styles.activeLine]}
          />
          <View
            style={[styles.progressStep, paymentStep >= 2 && styles.activeStep]}
          >
            <Text
              style={[
                styles.stepNumber,
                paymentStep >= 2 && styles.activeStepText,
              ]}
            >
              2
            </Text>
          </View>
          <View
            style={[styles.progressLine, paymentStep >= 3 && styles.activeLine]}
          />
          <View
            style={[styles.progressStep, paymentStep >= 3 && styles.activeStep]}
          >
            <Text
              style={[
                styles.stepNumber,
                paymentStep >= 3 && styles.activeStepText,
              ]}
            >
              3
            </Text>
          </View>
        </View>
        <View style={styles.stepLabels}>
          <Text style={styles.stepLabel}>Amount</Text>
          <Text style={styles.stepLabel}>Method</Text>
          <Text style={styles.stepLabel}>Confirm</Text>
        </View>
      </View>

      {/* Step Content */}
      <View style={styles.content}>
        {paymentStep === 1 && renderAmountStep()}
        {paymentStep === 2 && renderMethodStep()}
        {paymentStep === 3 && renderConfirmationStep()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {paymentStep < 3 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>
              {paymentStep === 1 ? "Continue" : "Review Payment"}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmPayment}
          >
            <MaterialIcons name="payment" size={20} color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        )}
      </View>
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
  progressContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  activeStepText: {
    color: "#FFFFFF",
  },
  progressLine: {
    width: 50,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: theme.colors.primary,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  amountSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 15,
  },
  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedAmountCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  amountInfo: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 5,
  },
  amountDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  amountValue: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  customAmountSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  customAmountInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  currencyLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    paddingVertical: 15,
  },
  minimumNote: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    fontStyle: "italic",
  },
  methodSection: {
    gap: 15,
  },
  methodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedMethodCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  methodIcon: {
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 5,
  },
  methodDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginBottom: 3,
  },
  methodFee: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
  },
  methodSelector: {
    marginLeft: 15,
  },
  confirmationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  confirmationSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  totalSection: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
    marginTop: 10,
    paddingTop: 15,
  },
  confirmationLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  confirmationValue: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  termsSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginLeft: 10,
    lineHeight: 20,
  },
  actionButtons: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
    marginRight: 10,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
    marginLeft: 10,
  },
});

export default MakePaymentPage;
