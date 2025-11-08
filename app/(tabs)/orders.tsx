import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ref, remove } from 'firebase/database';
import { database } from '../../firebase/config';
import { Colors } from '../../constants/Colors';
import { Order, useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const getStatusColor = (status: Order['status'], colors: any) => {
  switch (status) {
    case 'pending':
      return colors.warning;
    case 'confirmed':
      return colors.blue[600];
    case 'shipped':
      return colors.blue[500];
    case 'delivered':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.gray[500];
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'time-outline';
    case 'confirmed':
      return 'checkmark-circle-outline';
    case 'shipped':
      return 'car-outline';
    case 'delivered':
      return 'checkmark-done-outline';
    case 'cancelled':
      return 'close-circle-outline';
    default:
      return 'help-circle-outline';
  }
};

export default function OrdersScreen() {
  const { orders, loading, updateOrderStatus, getUserOrders, cancelOrder } = useOrders();
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const orderRef = ref(database, `orders/${orderId}`);
              await remove(orderRef);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete order. Please try again.');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Orders are automatically loaded from AsyncStorage
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}
      onPress={() => {
        // TODO: Navigate to order details
        console.log('Order details:', item.id);
      }}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: colors.text }]}>
            Order #{item.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={[styles.orderDate, { color: colors.gray[600] }]}>
            {formatDate(item.orderDate)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status, colors) }]}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={colors.white}
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: colors.white }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.doorInfo}>
        <Image source={item.doorImage} style={styles.doorImage} contentFit="cover" />
        <View style={styles.doorDetails}>
          <Text style={[styles.doorName, { color: colors.text }]}>{item.doorName}</Text>
          <Text style={[styles.doorCategory, { color: colors.gray[600] }]}>{item.doorCategory}</Text>
          <Text style={[styles.dimensions, { color: colors.gray[600] }]}>
            {item.width}" × {item.height}" × {item.thickness}mm
          </Text>
        </View>
        <Text style={[styles.price, { color: colors.text }]}>
          ₹{item.price.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.deliveryInfo}>
        <View style={styles.deliveryItem}>
          <Ionicons name="person-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.deliveryText, { color: colors.gray[600] }]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.deliveryItem}>
          <Ionicons name="location-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.deliveryText, { color: colors.gray[600] }]} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
        <View style={styles.deliveryItem}>
          <Ionicons name="map-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.deliveryText, { color: colors.gray[600] }]}>
            {item.pincode}, {item.state}
          </Text>
        </View>
        <View style={styles.deliveryItem}>
          <Ionicons name="call-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.deliveryText, { color: colors.gray[600] }]}>
            {item.phoneNumber}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => handleDeleteOrder(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.white} style={{ marginRight: 4 }} />
          <Text style={[styles.deleteButtonText, { color: colors.white }]}>Delete</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.warning }]}
            onPress={() => updateOrderStatus(item.id, 'cancelled')}
          >
            <Text style={[styles.cancelButtonText, { color: colors.warning }]}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color={colors.gray[400]} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.gray[600] }]}>
        Your orders will appear here once you place them
      </Text>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: colors.blue[600] }]}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={[styles.shopButtonText, { color: colors.white }]}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const userOrders = user?.uid ? getUserOrders(user.uid) : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.gray[200] }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Orders</Text>
        <Text style={[styles.headerSubtitle, { color: colors.gray[600] }]}>
          {userOrders.length} order{userOrders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {userOrders.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={userOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  listContainer: {
    padding: 20,
  },
  orderCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  doorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doorImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  doorDetails: {
    flex: 1,
  },
  doorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  doorCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  dimensions: {
    fontSize: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryInfo: {
    marginBottom: 12,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
