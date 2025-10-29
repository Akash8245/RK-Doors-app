import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function HelpSupportScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleCall = () => {
    Linking.openURL('tel:+919427764375');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:rkdoors24@gmail.com');
  };

  const contactItems = [
    {
      icon: 'call-outline',
      title: 'Phone Number',
      subtitle: '+91 94277 64375',
      onPress: handleCall,
      color: colors.success,
    },
    {
      icon: 'mail-outline',
      title: 'Email Address',
      subtitle: 'rkdoors24@gmail.com',
      onPress: handleEmail,
      color: colors.blue[600],
    },
  ];

  const faqItems = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our doors, select your preferred size and dimensions, add your delivery details, and click "Buy Now" or "Add to Cart".',
    },
    {
      question: 'What are the available door sizes?',
      answer: 'We offer doors in various widths (27" to 48"), heights (72" to 96"), and thicknesses (32mm to 38mm).',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 7-14 business days depending on your location and door specifications.',
    },
    {
      question: 'Can I customize my door?',
      answer: 'Yes! We offer various customization options. Contact us for specific requirements.',
    },
    {
      question: 'What if I need to cancel my order?',
      answer: 'You can cancel your order from the Orders page if it\'s still pending. Contact us for assistance with confirmed orders.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.gray[200] }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Section */}
        <View style={[styles.section, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get in Touch</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.gray[600] }]}>
            We're here to help you with any questions or concerns
          </Text>
          
          {contactItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.contactItem, { borderColor: colors.gray[200] }]}
              onPress={item.onPress}
            >
              <View style={[styles.contactIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.contactSubtitle, { color: colors.gray[600] }]}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={[styles.section, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
          
          {faqItems.map((item, index) => (
            <View key={index} style={[styles.faqItem, { borderColor: colors.gray[200] }]}>
              <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
              <Text style={[styles.faqAnswer, { color: colors.gray[600] }]}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Business Hours */}
        <View style={[styles.section, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Business Hours</Text>
          <View style={styles.businessHours}>
            <Text style={[styles.hoursText, { color: colors.gray[600] }]}>
              Monday - Friday: 9:00 AM - 6:00 PM
            </Text>
            <Text style={[styles.hoursText, { color: colors.gray[600] }]}>
              Saturday: 9:00 AM - 4:00 PM
            </Text>
            <Text style={[styles.hoursText, { color: colors.gray[600] }]}>
              Sunday: Closed
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: colors.text }]}>RK Doors</Text>
          <Text style={[styles.appTagline, { color: colors.gray[600] }]}>
            Crafting Excellence in Every Door
          </Text>
          <Text style={[styles.appVersion, { color: colors.gray[500] }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  businessHours: {
    marginTop: 8,
  },
  hoursText: {
    fontSize: 16,
    marginBottom: 4,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
  },
});
