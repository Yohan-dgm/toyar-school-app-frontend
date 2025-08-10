import React from "react";
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

const PrivacyPolicySection = ({ onClose }) => {
  const privacySections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include:

• Personal identification information (name, email address, phone number)
• Academic information (student ID, grade, class schedules)
• Usage data and preferences
• Communication records with school staff`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:

• Provide and maintain our educational services
• Process transactions and send related information
• Send you technical notices and support messages
• Communicate with you about products, services, and events
• Monitor and analyze trends and usage
• Personalize your experience`,
    },
    {
      title: "Information Sharing",
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:

• With school administrators and teachers for educational purposes
• With parents/guardians for student progress monitoring
• With service providers who assist in our operations
• When required by law or to protect rights and safety`,
    },
    {
      title: "Data Security",
      content: `We implement appropriate security measures to protect your personal information:

• Encryption of sensitive data in transit and at rest
• Regular security assessments and updates
• Access controls and authentication measures
• Staff training on data protection practices
• Incident response procedures`,
    },
    {
      title: "Your Rights",
      content: `You have the right to:

• Access your personal information
• Correct inaccurate or incomplete data
• Request deletion of your data (subject to legal requirements)
• Opt-out of certain communications
• File complaints with relevant authorities
• Receive a copy of your data in a portable format`,
    },
    {
      title: "Data Retention",
      content: `We retain your information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain academic records as required by educational regulations

Student academic records are typically retained for 7 years after graduation or withdrawal.`,
    },
    {
      title: "Children's Privacy",
      content: `We are committed to protecting the privacy of children under 13:

• We comply with COPPA (Children's Online Privacy Protection Act)
• Parental consent is required for children under 13
• Parents can review, modify, or delete their child's information
• We limit data collection to what is necessary for educational purposes
• Special protections apply to sensitive information`,
    },
    {
      title: "Updates to This Policy",
      content: `We may update this privacy policy from time to time. We will notify you of any changes by:

• Posting the new policy on this page
• Sending an email notification
• Providing in-app notifications
• Updating the "Last Updated" date

Your continued use of our services after changes constitutes acceptance of the updated policy.`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            At Nexis College International, we are committed to protecting your
            privacy and ensuring the security of your personal information. This
            Privacy Policy explains how we collect, use, and safeguard your data
            when you use our school management application.
          </Text>
          <Text style={styles.lastUpdated}>Last Updated: January 15, 2025</Text>
        </View>

        {/* Privacy Sections */}
        {privacySections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="security"
                size={24}
                color={theme.colors.primary}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:
          </Text>

          <View style={styles.contactItem}>
            <MaterialIcons
              name="email"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.contactDetail}>privacy@nexiscollege.edu</Text>
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
              name="location-on"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.contactDetail}>
              Nexis College International{"\n"}
              123 Education Lane{"\n"}
              Yakkala, Sri Lanka
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.actionSection}> */}
        {/* <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="download" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Download PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <MaterialIcons
              name="share"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Share Policy
            </Text>
          </TouchableOpacity> */}
        {/* </View> */}

        {/* Footer */}
        <View style={styles.footer}>
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
    marginBottom: 15,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    flex: 1,
  },
  sectionContent: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: "#555555",
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
  },
});

export default PrivacyPolicySection;
