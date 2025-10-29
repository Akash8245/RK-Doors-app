import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Door } from '../contexts/CartContext';
import { useColorScheme } from '../hooks/useColorScheme';

const { width } = Dimensions.get('window');

interface DoorCardProps {
  door: Door;
}

export default function DoorCard({ door }: DoorCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handlePress = () => {
    router.push({
      pathname: '/door-details',
      params: { doorId: door.id }
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: Colors.light.cardBackground }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={door.image}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: Colors.light.text }]}>
          {door.name}
        </Text>
        <Text style={[styles.category, { color: Colors.light.icon }]}>
          {door.category}
        </Text>
        <Text style={[styles.price, { color: Colors.light.text }]}>
          ₹{door.price.toLocaleString('en-IN')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (width - 48) / 2,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 