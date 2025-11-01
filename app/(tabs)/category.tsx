import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DoorCard from '../../components/DoorCard';
import { Colors } from '../../constants/Colors';
import { useDoors } from '../../contexts/DoorsContext';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function CategoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const { categories, getDoorsByCategoryName } = useDoors();

  const filteredDoors = selectedCategory ? getDoorsByCategoryName(selectedCategory) : [];

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: selectedCategory === item.name ? Colors[colorScheme ?? 'light'].tint : '#E1E5E9',
        },
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryName, { color: Colors[colorScheme ?? 'light'].text }]}>
        {item.name}
      </Text>
      <Text style={[styles.categoryCount, { color: Colors[colorScheme ?? 'light'].icon }]}> 
        {getDoorsByCategoryName(item.name).length} doors
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Categories
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
          Browse by style and design
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Door Categories
          </Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            scrollEnabled={false}
          />
        </View>

        {selectedCategory && (
          <View style={styles.doorsSection}>
            <View style={styles.doorsHeader}>
              <Text style={[styles.doorsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                {selectedCategory} Doors
              </Text>
              <Text style={[styles.doorsCount, { color: Colors[colorScheme ?? 'light'].icon }]}>
                {filteredDoors.length} items
              </Text>
            </View>
            <View style={styles.doorsGrid}>
              {filteredDoors.map((door) => (
                <DoorCard key={door.id} door={door} />
              ))}
            </View>
          </View>
        )}

        {!selectedCategory && (
          <View style={styles.placeholder}>
            <Ionicons
              name="grid"
              size={64}
              color={Colors[colorScheme ?? 'light'].icon}
              style={styles.placeholderIcon}
            />
            <Text style={[styles.placeholderText, { color: Colors[colorScheme ?? 'light'].icon }]}>
              Select a category to view doors
            </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  doorsSection: {
    marginBottom: 32,
  },
  doorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  doorsTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  doorsCount: {
    fontSize: 14,
  },
  doorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 