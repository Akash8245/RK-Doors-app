import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function CartScreen() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!name.trim() || !address.trim() || !phoneNumber.trim() || !pincode.trim() || !state.trim()) {
      Alert.alert('Details Required', 'Please fill in all delivery details');
      return;
    }

    setLoading(true);

    try {
      // Create orders for each cart item
      for (const item of cartItems) {
        await addOrder({
          userId: user?.uid || '',
          doorId: item.id,
          doorName: item.name,
          doorImage: item.image,
          doorCategory: item.category,
          price: item.price,
          width: item.width,
          height: item.height,
          thickness: item.thickness,
          name: name.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          pincode: pincode.trim(),
          state: state.trim(),
        });
      }

      setLoading(false);
      clearCart();
      Alert.alert(
        'Order Placed!',
        'Your order has been placed successfully. We will contact you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/orders')
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderCartItem = (item: any) => (
    <View key={`${item.id}-${item.width}-${item.height}-${item.thickness}`} style={[styles.cartItem, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}>
      <Image
        source={item.image}
        style={styles.itemImage}
        contentFit="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.itemCategory, { color: colors.gray[600] }]}>
          {item.category}
        </Text>
        <Text style={[styles.itemDimensions, { color: colors.gray[600] }]}>
          {item.width}" × {item.height}" × {item.thickness}mm
        </Text>
        <Text style={[styles.itemPrice, { color: colors.text }]}>
          ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
        </Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: colors.blue[600] }]}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color="white" />
        </TouchableOpacity>
        
        <Text style={[styles.quantityText, { color: colors.text }]}>
          {item.quantity}
        </Text>
        
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: colors.blue[600] }]}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={[styles.header, { borderBottomColor: colors.gray[200] }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Shopping Cart
          </Text>
        </View>
        
        <View style={styles.emptyCart}>
          <Ionicons
            name="cart-outline"
            size={80}
            color={colors.gray[400]}
            style={styles.emptyCartIcon}
          />
          <Text style={[styles.emptyCartTitle, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptyCartText, { color: colors.gray[600] }]}>
            Add some beautiful doors to your cart
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={[styles.header, { borderBottomColor: colors.gray[200] }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Shopping Cart
        </Text>
        <Text style={[styles.itemCount, { color: colors.gray[600] }]}>
          {cartItems.length} items
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Cart Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Items in Cart</Text>
            {cartItems.map(renderCartItem)}
          </View>

          {/* Delivery Details Form */}
          <View style={[styles.deliverySection, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Details</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.gray[600] }]}>
              Please provide your delivery information
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
        </ScrollView>

        {/* Footer with Total and Place Order */}
        <View style={[styles.footer, { backgroundColor: colors.white, borderTopColor: colors.gray[200] }]}>
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total:
            </Text>
            <Text style={[styles.totalPrice, { color: colors.text }]}>
              ₹{getTotalPrice().toLocaleString('en-IN')}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.gray[300] }]}
              onPress={() => {
                Alert.alert(
                  'Clear Cart',
                  'Are you sure you want to clear your cart?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', onPress: clearCart, style: 'destructive' },
                  ]
                );
              }}
            >
              <Text style={[styles.clearButtonText, { color: colors.gray[600] }]}>
                Clear Cart
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.placeOrderButton, { backgroundColor: colors.blue[600] }]}
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              <Text style={[styles.placeOrderButtonText, { color: colors.white }]}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemDimensions: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
  deliverySection: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeOrderButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 