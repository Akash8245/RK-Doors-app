import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DoorCard from '../../components/DoorCard';
import { Colors } from '../../constants/Colors';
import { useDoors } from '../../contexts/DoorsContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width } = Dimensions.get('window');

export default function CategoryScreen() {
  const { categoryName } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const { categories, getDoorsByCategoryName } = useDoors();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (categoryName && typeof categoryName === 'string') {
      setSelectedCategory(categoryName);
    }
  }, [categoryName]);

  const filteredDoors = selectedCategory ? getDoorsByCategoryName(selectedCategory) : [];

  // Get category cards with first door image
  const categoryCards = categories.map(category => {
    const categoryDoors = getDoorsByCategoryName(category.name);
    const firstDoor = categoryDoors[0];
    return {
      ...category,
      firstDoorImage: firstDoor?.image || null,
      doorCount: categoryDoors.length,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top }]}>
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
          <View style={styles.categoriesGrid}>
            {categoryCards.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: selectedCategory === category.name ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].cardBackground,
                    borderColor: selectedCategory === category.name ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].border,
                  },
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                activeOpacity={0.7}
              >
                {category.firstDoorImage && (
                  <Image
                    source={category.firstDoorImage}
                    style={styles.categoryImage}
                    contentFit="cover"
                  />
                )}
                <Text
                  style={[
                    styles.categoryName,
                    {
                      color: selectedCategory === category.name ? Colors[colorScheme ?? 'light'].background : Colors[colorScheme ?? 'light'].text,
                      fontWeight: selectedCategory === category.name ? 'bold' : 'normal',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {category.name}
                </Text>
                {category.doorCount > 0 && (
                  <Text style={[styles.categoryCount, { color: selectedCategory === category.name ? Colors[colorScheme ?? 'light'].background : Colors[colorScheme ?? 'light'].icon }]}>
                    {category.doorCount} doors
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    </View>
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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
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
    borderWidth: 1,
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
  doorsSection: {
    marginBottom: 20,
  },
  doorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doorsTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  doorsCount: {
    fontSize: 11,
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
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});
