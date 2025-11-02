import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout. Please try again.');
              console.error('Logout failed:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      subtitle: 'Manage your account details',
      onPress: () => Alert.alert('Personal Information', 'Name: ' + (user?.email ? user.email.split('@')[0] : 'User') + '\nEmail: ' + (user?.email || 'user@example.com')),
    },
    {
      icon: 'document-text-outline',
      title: 'Order History',
      subtitle: 'View your past orders',
      onPress: () => router.push('/(tabs)/orders'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => router.push('/help-support'),
    },
    {
      icon: 'shield-outline',
      title: 'Admin Dashboard',
      subtitle: 'Manage orders and view analytics',
      onPress: () => router.push('/admin-login'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Profile
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
            Manage your account
          </Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
              <Ionicons name="person" size={40} color="white" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: Colors[colorScheme ?? 'light'].text }]}>
              {user?.email ? user.email.split('@')[0] : 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: Colors[colorScheme ?? 'light'].icon }]}>
              {user?.email || 'user@example.com'}
            </Text>
            <Text style={[styles.memberSince, { color: Colors[colorScheme ?? 'light'].icon }]}>
              Member since {new Date().getFullYear()}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Account
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
                  <Ionicons name={item.icon as any} size={20} color={Colors[colorScheme ?? 'light'].tint} />
                </View>
                <View style={styles.menuText}>
                  <Text style={[styles.menuTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuSubtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors[colorScheme ?? 'light'].icon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#dc2626' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={[styles.logoutButtonText, { color: '#ffffff' }]}>Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: Colors[colorScheme ?? 'light'].text }]}>
            RK Doors
          </Text>
          <Text style={[styles.appVersion, { color: Colors[colorScheme ?? 'light'].icon }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.appTagline, { color: Colors[colorScheme ?? 'light'].icon }]}>
            Crafting Excellence in Every Door
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  userCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 