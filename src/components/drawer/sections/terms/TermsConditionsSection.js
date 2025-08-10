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

const TermsConditionsSection = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const termsSections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing and using the Nexis College International mobile application, you accept and agree to be bound by the terms and provision of this agreement.

These terms apply to all users of the application, including students, parents, teachers, and administrators. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      title: "Use License",
      content: `Permission is granted to temporarily download one copy of the Nexis College app for personal, non-commercial transitory viewing only.

This is the grant of a license, not a transfer of title, and under this license you may not:
• Modify or copy the materials
• Use the materials for commercial purposes
• Attempt to reverse engineer any software
• Remove any copyright or proprietary notations`,
    },
    {
      title: "User Accounts and Responsibilities",
      content: `Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.

You agree to:
• Provide accurate and complete information
• Keep your login credentials secure
• Notify us immediately of any unauthorized use
• Use the app only for legitimate educational purposes
• Respect the privacy and rights of other users`,
    },
    {
      title: "Acceptable Use Policy",
      content: `You may not use our app for any unlawful purpose or to solicit others to perform unlawful acts.

Prohibited activities include:
• Harassment, bullying, or threatening behavior
• Sharing inappropriate or offensive content
• Attempting to gain unauthorized access to systems
• Interfering with the app's functionality
• Violating any applicable laws or regulations`,
    },
    {
      title: "Academic Integrity",
      content: `Students using this application are expected to maintain academic integrity at all times.

This includes:
• Submitting original work only
• Not sharing assignment answers inappropriately
• Respecting examination and assessment protocols
• Following all school academic policies
• Reporting any suspected violations`,
    },
    {
      title: "Privacy and Data Protection",
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy.

By using this app, you consent to:
• Collection of necessary educational data
• Sharing information with authorized school personnel
• Use of data for educational and administrative purposes
• Implementation of security measures to protect your data`,
    },
    {
      title: "Intellectual Property",
      content: `All content, features, and functionality of this app are owned by Nexis College International and are protected by copyright, trademark, and other intellectual property laws.

You may not:
• Copy, distribute, or reproduce any content
• Create derivative works
• Use our trademarks without permission
• Claim ownership of any app content`,
    },
    {
      title: "Service Availability",
      content: `While we strive to provide continuous service, we do not guarantee that the app will be available at all times.

Service may be interrupted due to:
• Scheduled maintenance
• Technical difficulties
• Force majeure events
• Security concerns
• System upgrades`,
    },
    {
      title: "Limitation of Liability",
      content: `Nexis College International shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the app.

Our liability is limited to the maximum extent permitted by law. We are not responsible for:
• Loss of data or information
• Technical malfunctions
• Third-party actions
• Unauthorized access to accounts`,
    },
    {
      title: "Termination",
      content: `We reserve the right to terminate or suspend your account and access to the app at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

Upon termination:
• Your right to use the app ceases immediately
• We may delete your account and data
• Certain provisions of these terms will survive termination`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Terms of Service</Text>
          <Text style={styles.introText}>
            Welcome to the Nexis College International mobile application. These
            Terms and Conditions govern your use of our educational platform and
            services.
          </Text>
          <Text style={styles.lastUpdated}>
            Effective Date: January 1, 2025
          </Text>
        </View>

        {/* Terms Sections */}
        {termsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(index)}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialIcons
                  name="gavel"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <MaterialIcons
                name={expandedSections[index] ? "expand-less" : "expand-more"}
                size={24}
                color="#666666"
              />
            </TouchableOpacity>

            {expandedSections[index] && (
              <View style={styles.sectionContentContainer}>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Agreement Section */}
        <View style={styles.agreementSection}>
          <View style={styles.agreementHeader}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.agreementTitle}>Agreement Acknowledgment</Text>
          </View>
          <Text style={styles.agreementText}>
            By continuing to use the Nexis College International app, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms and Conditions.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions About These Terms?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms and Conditions, please
            contact us:
          </Text>

          <View style={styles.contactItem}>
            <MaterialIcons
              name="email"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.contactDetail}>legal@nexiscollege.edu</Text>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons
              name="phone"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.contactDetail}>+94 11 234 5678</Text>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons
              name="business"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.contactDetail}>
              Legal Department{"\n"}
              Nexis College International{"\n"}
              Yakkala, Sri Lanka
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {/* <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="print" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Print Terms</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <MaterialIcons
              name="bookmark"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Save for Later
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            These terms are subject to change. Users will be notified of any
            updates.
          </Text>
          <Text style={styles.footerText}>
            © 2025 Nexis College International. All rights reserved.
          </Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  introSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 15,
    textAlign: "center",
  },
  introText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 15,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    textAlign: "center",
    fontStyle: "italic",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    flex: 1,
  },
  sectionContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContent: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: "#555555",
    lineHeight: 22,
  },
  agreementSection: {
    backgroundColor: "#E8F5E8",
    padding: 20,
    marginVertical: 15,
  },
  agreementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  agreementTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: "#2E7D32",
    marginLeft: 10,
  },
  agreementText: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: "#2E7D32",
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 15,
  },
  contactText: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  contactDetail: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginLeft: 15,
    flex: 1,
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  footerText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#999999",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default TermsConditionsSection;
