import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DoorCard from '../../components/DoorCard';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { doors } from '../../data/doors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const filteredDoors = doors.filter(door =>
    door.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setShowMenu(!showMenu)}
      >
        <Ionicons
          name="menu"
          size={24}
          color={Colors.light.text}
        />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={[styles.welcomeText, { color: Colors.light.text }]}>
          Welcome to
        </Text>
        <Text style={[styles.brandText, { color: Colors.light.tint }]}>
          RK Doors
        </Text>
      </View>

      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
        <Ionicons
          name="person-circle"
          size={24}
          color={Colors.light.text}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: Colors.light.background }]}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.light.icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: Colors.light.text }]}
          placeholder="Search doors..."
          placeholderTextColor={Colors.light.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.light.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSideMenu = () => (
    showMenu && (
      <View style={[styles.sideMenu, { backgroundColor: Colors.light.background }]}>
        <TouchableOpacity 
          style={styles.closeMenuButton} 
          onPress={() => setShowMenu(false)}
        >
          <Ionicons 
            name="close" 
            size={28} 
            color={Colors.light.text} 
          />
        </TouchableOpacity>
        
        <View style={styles.menuHeader}>
          <Text style={[styles.menuTitle, { color: Colors.light.text }]}>
            RK Doors
          </Text>
          <Text style={[styles.menuSubtitle, { color: Colors.light.icon }]}>
            Crafting Excellence
          </Text>
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); router.push('/(tabs)/'); }}>
          <Ionicons name="home" size={20} color={Colors.light.text} />
          <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); router.push('/(tabs)/category'); }}>
          <Ionicons name="grid" size={20} color={Colors.light.text} />
          <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
            Categories
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); router.push('/(tabs)/cart'); }}>
          <Ionicons name="cart" size={20} color={Colors.light.text} />
          <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
            Cart
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); router.push('/(tabs)/profile'); }}>
          <Ionicons name="person" size={20} color={Colors.light.text} />
          <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.light.text} />
          <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    )
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Colors.light.background}
        translucent={false}
      />
      {renderHeader()}
      {renderSearchBar()}
      {renderSideMenu()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
            {searchQuery ? `Search Results (${filteredDoors.length})` : 'Featured Doors'}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: Colors.light.icon }]}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Discover our handcrafted collection'}
          </Text>
        </View>

        {filteredDoors.length === 0 && searchQuery ? (
          <View style={styles.noResults}>
            <Ionicons
              name="search"
              size={64}
              color={Colors.light.icon}
              style={styles.noResultsIcon}
            />
            <Text style={[styles.noResultsTitle, { color: Colors.light.text }]}>
              No doors found
            </Text>
            <Text style={[styles.noResultsText, { color: Colors.light.icon }]}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <View style={styles.doorsGrid}>
            {filteredDoors.map((door) => (
              <DoorCard key={door.id} door={door} />
            ))}
          </View>
        )}
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
  },
  menuButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    opacity: 0.8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    zIndex: 1000,
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  closeMenuButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 10,
    padding: 8,
  },
  menuHeader: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
  },
  doorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
