import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DoorCard from '../../components/DoorCard';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useDoors } from '../../contexts/DoorsContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { doors, loading, error, categories, getDoorsByCategoryName } = useDoors();
  const insets = useSafeAreaInsets();

  // Get first 8 categories in order, with first door image from each
  const categoryCards = categories.slice(0, 8).map(category => {
    const categoryDoors = getDoorsByCategoryName(category.name);
    const firstDoor = categoryDoors[0];
    return {
      ...category,
      firstDoorImage: firstDoor?.image || null,
      doorCount: categoryDoors.length,
    };
  });

  // Filter doors by search query and selected category
  let filteredDoors = doors.filter(door =>
    door.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (selectedCategory) {
    filteredDoors = filteredDoors.filter(door => door.category === selectedCategory);
  }

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
        <Image
          source={require('../../assets/images/main-blue.png')}
          style={styles.logo}
          contentFit="contain"
        />
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
    <View style={[styles.container, { backgroundColor: Colors.light.background, paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Colors.light.background}
        translucent={false}
      />
      {renderHeader()}
      {renderSearchBar()}
      {renderSideMenu()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories Section */}
        {!searchQuery && categoryCards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
              Categories
            </Text>
            <View style={styles.categoriesGrid}>
              {categoryCards.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, { backgroundColor: Colors.light.cardBackground }]}
                  onPress={() => {
                    setSelectedCategory(category.name);
                  }}
                  activeOpacity={0.8}
                >
                  {category.firstDoorImage && (
                    <Image
                      source={category.firstDoorImage}
                      style={styles.categoryImage}
                      contentFit="cover"
                    />
                  )}
                  <Text style={[styles.categoryName, { color: Colors.light.text }]} numberOfLines={2}>
                    {category.name}
                  </Text>
                  {category.doorCount > 0 && (
                    <Text style={[styles.categoryCount, { color: Colors.light.icon }]}>
                      {category.doorCount} doors
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
              {selectedCategory ? selectedCategory : searchQuery ? `Search Results (${filteredDoors.length})` : 'Recommended'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Ionicons name="close-circle" size={18} color={Colors.light.icon} />
              </TouchableOpacity>
            )}
          </View>
          {!searchQuery && !selectedCategory && (
            <Text style={[styles.sectionSubtitle, { color: Colors.light.icon }]}>
              Discover our handcrafted collection
            </Text>
          )}
        </View>

        {loading ? (
          <View style={styles.noResults}>
            <Ionicons name="hourglass" size={48} color={Colors.light.icon} />
            <Text style={[styles.noResultsText, { color: Colors.light.icon }]}>Loading products…</Text>
          </View>
        ) : error ? (
          <View style={styles.noResults}>
            <Ionicons name="alert-circle" size={48} color={Colors.light.icon} />
            <Text style={[styles.noResultsText, { color: Colors.light.icon }]}>Failed to load. Pull to refresh.</Text>
          </View>
        ) : filteredDoors.length === 0 && searchQuery ? (
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
    </View>
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
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 32,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 11,
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryCard: {
    width: (width - 48) / 4,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: '100%',
    height: 80,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingBottom: 6,
    textAlign: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});
