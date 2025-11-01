import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrdersContext';
import { useDoors } from '../contexts/DoorsContext';
import { useColorScheme } from '../hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

interface SizeOption {
  label: string;
  value: string;
}

const widthOptions: SizeOption[] = [
  { label: '27"', value: '27' },
  { label: '30"', value: '30' },
  { label: '32"', value: '32' },
  { label: '33"', value: '33' },
  { label: '36"', value: '36' },
  { label: '38"', value: '38' },
  { label: '42"', value: '42' },
  { label: '48"', value: '48' },
];

const heightOptions: SizeOption[] = [
  { label: '72"', value: '72' },
  { label: '75"', value: '75' },
  { label: '78"', value: '78' },
  { label: '81"', value: '81' },
  { label: '84"', value: '84' },
  { label: '90"', value: '90' },
  { label: '96"', value: '96' },
];

const thicknessOptions: SizeOption[] = [
  { label: '32mm', value: '32' },
  { label: '35mm', value: '35' },
  { label: '38mm', value: '38' },
];

export default function DoorDetailsScreen() {
  const { doorId } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addOrder } = useOrders();
  const { getDoorById } = useDoors();

  const [selectedWidth, setSelectedWidth] = useState<string>('');
  const [selectedHeight, setSelectedHeight] = useState<string>('');
  const [selectedThickness, setSelectedThickness] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const door = typeof doorId === 'string' ? getDoorById(doorId) : undefined;

  if (!door) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>Door not found</Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.blue[600] }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.white }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (!selectedWidth || !selectedHeight || !selectedThickness) {
      Alert.alert('Selection Required', 'Please select width, height, and thickness');
      return;
    }
    
    addToCart(door, selectedWidth, selectedHeight, selectedThickness);
    Alert.alert('Added to Cart', 'Door has been added to your cart. You can provide delivery details in the cart.');
  };

  const handleBuyNow = async () => {
    if (!selectedWidth || !selectedHeight || !selectedThickness) {
      Alert.alert('Selection Required', 'Please select width, height, and thickness');
      return;
    }
    if (!name.trim() || !address.trim() || !phoneNumber.trim() || !pincode.trim() || !state.trim()) {
      Alert.alert('Details Required', 'Please enter all delivery details for immediate order placement');
      return;
    }
    
    setLoading(true);
    
    try {
      await addOrder({
        userId: user?.uid || '',
        doorId: door.id,
        doorName: door.name,
        doorImage: door.image,
        doorCategory: door.category,
        price: door.price,
        width: selectedWidth,
        height: selectedHeight,
        thickness: selectedThickness,
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        name: name.trim(),
        pincode: pincode.trim(),
        state: state.trim(),
      });
      
      setLoading(false);
      Alert.alert(
        'Order Placed!', 
        'Your order has been placed successfully. We will contact you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)')
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderSizeSelector = (
    title: string,
    options: SizeOption[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.sizeSection}>
      <Text style={[styles.sizeTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.sizeOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sizeOption,
              {
                backgroundColor: selectedValue === option.value ? colors.blue[600] : colors.gray[100],
                borderColor: selectedValue === option.value ? colors.blue[600] : colors.gray[300],
              }
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.sizeOptionText,
                {
                  color: selectedValue === option.value ? colors.white : colors.text,
                }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Door Details</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Door Image */}
          <View style={styles.imageContainer}>
            <Image
              source={door.image}
              style={styles.doorImage}
              contentFit="cover"
            />
          </View>

          {/* Door Info */}
          <View style={[styles.infoContainer, { backgroundColor: colors.white }]}>
            <Text style={[styles.doorName, { color: colors.text }]}>{door.name}</Text>
            <Text style={[styles.doorCategory, { color: colors.gray[600] }]}>{door.category}</Text>
            <Text style={[styles.doorPrice, { color: colors.text }]}>
              ₹{door.price.toLocaleString('en-IN')}
            </Text>
            <Text style={[styles.doorDescription, { color: colors.gray[600] }]}>
              {door.description}
            </Text>
          </View>

          {/* Size Selection */}
          <View style={[styles.sizesContainer, { backgroundColor: colors.white }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Dimensions</Text>
            
            {renderSizeSelector('Width (inches)', widthOptions, selectedWidth, setSelectedWidth)}
            {renderSizeSelector('Height (inches)', heightOptions, selectedHeight, setSelectedHeight)}
            {renderSizeSelector('Thickness (mm)', thicknessOptions, selectedThickness, setSelectedThickness)}
          </View>

          {/* Customer Details */}
          <View style={[styles.customerContainer, { backgroundColor: colors.white }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Details</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.gray[600] }]}>
              Required for "Buy Now", optional for "Add to Cart"
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.gray[50],
                    borderColor: colors.gray[300],
                    color: colors.text,
                  }
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.gray[400]}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Address *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.gray[50],
                    borderColor: colors.gray[300],
                    color: colors.text,
                  }
                ]}
                placeholder="Enter your complete address"
                placeholderTextColor={colors.gray[400]}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Pincode *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.gray[50],
                      borderColor: colors.gray[300],
                      color: colors.text,
                    }
                  ]}
                  placeholder="Enter pincode"
                  placeholderTextColor={colors.gray[400]}
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>State *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.gray[50],
                      borderColor: colors.gray[300],
                      color: colors.text,
                    }
                  ]}
                  placeholder="Enter state"
                  placeholderTextColor={colors.gray[400]}
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.gray[50],
                    borderColor: colors.gray[300],
                    color: colors.text,
                  }
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.gray[400]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.addToCartButton, { borderColor: colors.blue[600] }]}
              onPress={handleAddToCart}
            >
              <Text style={[styles.addToCartText, { color: colors.blue[600] }]}>Add to Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.buyNowButton, { backgroundColor: colors.blue[600] }]}
              onPress={handleBuyNow}
              disabled={loading}
            >
              <Text style={[styles.buyNowText, { color: colors.white }]}>
                {loading ? 'Processing...' : 'Buy Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  doorImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  doorCategory: {
    fontSize: 16,
    marginBottom: 8,
  },
  doorPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  doorDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  sizesContainer: {
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  customerContainer: {
    marginTop: 20,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
});
