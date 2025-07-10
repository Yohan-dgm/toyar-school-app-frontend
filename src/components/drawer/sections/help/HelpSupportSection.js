import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

const HelpSupportSection = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [supportTicket, setSupportTicket] = useState({
    subject: "",
    message: "",
    category: "",
  });

  const helpCategories = [
    {
      id: "account",
      title: "Account & Login",
      icon: "account-circle",
      items: [
        {
          question: "How do I reset my password?",
          answer: "Go to the login screen and tap 'Forgot Password'. Enter your email address and follow the instructions sent to your email.",
        },
        {
          question: "How do I update my profile information?",
          answer: "Navigate to Profile section from the drawer menu. Tap 'Edit Profile' and update your information.",
        },
        {
          question: "Why can't I log in?",
          answer: "Ensure you're using the correct username/email and password. Check your internet connection. If issues persist, contact support.",
        },
      ],
    },
    {
      id: "payments",
      title: "Payments & Fees",
      icon: "payment",
      items: [
        {
          question: "How do I make a payment?",
          answer: "Go to Payment Center from the drawer menu. Select 'Make Payment', choose the fee type, and follow the payment process.",
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept credit/debit cards, bank transfers, and mobile payments. All transactions are secure and encrypted.",
        },
        {
          question: "How can I view my payment history?",
          answer: "In Payment Center, select 'Payment History' to view all your past transactions and download receipts.",
        },
      ],
    },
    {
      id: "academic",
      title: "Academic Information",
      icon: "school",
      items: [
        {
          question: "How do I check my child's attendance?",
          answer: "Navigate to Calendar section and select the 'Student Attendance' tab to view attendance records.",
        },
        {
          question: "Where can I see academic performance?",
          answer: "Go to Academic Performance section to view grades, progress reports, and performance analytics.",
        },
        {
          question: "How do I contact teachers?",
          answer: "Use the Educator Feedback section to send messages directly to your child's teachers.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Issues",
      icon: "build",
      items: [
        {
          question: "The app is running slowly",
          answer: "Try closing and reopening the app. Ensure you have a stable internet connection. Clear app cache if needed.",
        },
        {
          question: "I'm not receiving notifications",
          answer: "Check your device notification settings and ensure SchoolSnap has permission to send notifications.",
        },
        {
          question: "App crashes frequently",
          answer: "Update to the latest version of the app. Restart your device. If issues persist, contact technical support.",
        },
      ],
    },
  ];

  const contactOptions = [
    {
      id: "phone",
      title: "Call Support",
      subtitle: "+94 11 234 5678",
      icon: "phone",
      action: () => Linking.openURL("tel:+94112345678"),
    },
    {
      id: "email",
      title: "Email Support",
      subtitle: "support@nexiscollege.lk",
      icon: "email",
      action: () => Linking.openURL("mailto:support@nexiscollege.lk"),
    },
    {
      id: "whatsapp",
      title: "WhatsApp Support",
      subtitle: "+94 77 123 4567",
      icon: "chat",
      action: () => Linking.openURL("https://wa.me/94771234567"),
    },
  ];

  const handleSubmitTicket = () => {
    if (!supportTicket.subject || !supportTicket.message || !supportTicket.category) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Here you would typically send the support ticket to your backend
    Alert.alert(
      "Support Ticket Submitted",
      "Your support ticket has been submitted successfully. We'll get back to you within 24 hours.",
      [
        {
          text: "OK",
          onPress: () => {
            setSupportTicket({ subject: "", message: "", category: "" });
            setSelectedCategory(null);
          },
        },
      ]
    );
  };

  const renderFAQSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {helpCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryCard}
          onPress={() => setSelectedCategory(category)}
        >
          <MaterialIcons
            name={category.icon}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategoryDetails = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedCategory(null)}
      >
        <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
        <Text style={styles.backButtonText}>Back to Categories</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{selectedCategory.title}</Text>
      {selectedCategory.items.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      ))}
    </View>
  );

  const renderContactSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Support</Text>
      {contactOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.contactCard}
          onPress={option.action}
        >
          <MaterialIcons
            name={option.icon}
            size={24}
            color={theme.colors.primary}
          />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>{option.title}</Text>
            <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSupportTicketSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Submit Support Ticket</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Category</Text>
        <View style={styles.categorySelector}>
          {helpCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                supportTicket.category === category.id && styles.categoryChipSelected,
              ]}
              onPress={() => setSupportTicket({ ...supportTicket, category: category.id })}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  supportTicket.category === category.id && styles.categoryChipTextSelected,
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Subject</Text>
        <TextInput
          style={styles.textInput}
          value={supportTicket.subject}
          onChangeText={(text) => setSupportTicket({ ...supportTicket, subject: text })}
          placeholder="Brief description of your issue"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Message</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={supportTicket.message}
          onChangeText={(text) => setSupportTicket({ ...supportTicket, message: text })}
          placeholder="Describe your issue in detail..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTicket}>
        <Text style={styles.submitButtonText}>Submit Ticket</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedCategory ? renderCategoryDetails() : renderFAQSection()}
        {!selectedCategory && renderContactSection()}
        {!selectedCategory && renderSupportTicketSection()}
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
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingTop: 60,
  },
  closeButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  faqItem: {
    backgroundColor: "#F8FAFC",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  question: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  answer: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#64748B",
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  contactSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#64748B",
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "#F1F5F9",
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#64748B",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 120,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
});

export default HelpSupportSection;
