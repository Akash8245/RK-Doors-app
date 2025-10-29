import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Order, useOrders } from '../contexts/OrdersContext';
import { useColorScheme } from '../hooks/useColorScheme';

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

export default function AdminDashboardScreen() {
  const { orders, updateOrderStatus, loading } = useOrders();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.price, 0);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}>
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

      <View style={styles.customerInfo}>
        <View style={styles.customerItem}>
          <Ionicons name="person-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.customerText, { color: colors.gray[600] }]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.customerItem}>
          <Ionicons name="location-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.customerText, { color: colors.gray[600] }]} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
        <View style={styles.customerItem}>
          <Ionicons name="map-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.customerText, { color: colors.gray[600] }]}>
            {item.pincode}, {item.state}
          </Text>
        </View>
        <View style={styles.customerItem}>
          <Ionicons name="call-outline" size={16} color={colors.gray[600]} />
          <Text style={[styles.customerText, { color: colors.gray[600] }]}>
            {item.phoneNumber}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={() => updateOrderStatus(item.id, 'confirmed')}
            >
              <Text style={[styles.actionButtonText, { color: colors.white }]}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={() => updateOrderStatus(item.id, 'cancelled')}
            >
              <Text style={[styles.actionButtonText, { color: colors.white }]}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.blue[600] }]}
            onPress={() => updateOrderStatus(item.id, 'shipped')}
          >
            <Text style={[styles.actionButtonText, { color: colors.white }]}>Ship</Text>
          </TouchableOpacity>
        )}
        {item.status === 'shipped' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => updateOrderStatus(item.id, 'delivered')}
          >
            <Text style={[styles.actionButtonText, { color: colors.white }]}>Deliver</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFilterButton = (status: Order['status'] | 'all', label: string, count: number) => (
    <TouchableOpacity
      key={status}
      style={[
        styles.filterButton,
        {
          backgroundColor: statusFilter === status ? colors.blue[600] : colors.gray[100],
          borderColor: statusFilter === status ? colors.blue[600] : colors.gray[300],
        }
      ]}
      onPress={() => setStatusFilter(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: statusFilter === status ? colors.white : colors.text,
          }
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
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
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: colors.gray[600] }]}>
            Total Revenue: ₹{getTotalRevenue().toLocaleString('en-IN')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Total Orders</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white, borderColor: colors.gray[200] }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{stats.delivered}</Text>
          <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Delivered</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'All', stats.total)}
          {renderFilterButton('pending', 'Pending', stats.pending)}
          {renderFilterButton('confirmed', 'Confirmed', stats.confirmed)}
          {renderFilterButton('shipped', 'Shipped', stats.shipped)}
          {renderFilterButton('delivered', 'Delivered', stats.delivered)}
          {renderFilterButton('cancelled', 'Cancelled', stats.cancelled)}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.gray[400]} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.gray[600] }]}>
              {statusFilter === 'all' 
                ? 'No orders have been placed yet' 
                : `No ${statusFilter} orders found`}
            </Text>
          </View>
        }
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
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
  customerInfo: {
    marginBottom: 12,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  },
});
