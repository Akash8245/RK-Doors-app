import { Door } from '../contexts/CartContext';

export const doors: Door[] = [
  {
    id: '1',
    name: 'Modern Oak Panel Door',
    price: 899,
    image: require('../assets/images/door1.jpg'),
    category: 'Modern',
    description: 'Elegant oak panel door with contemporary design, perfect for modern homes.'
  },
  {
    id: '2',
    name: 'Classic Mahogany Door',
    price: 1299,
    image: require('../assets/images/door2.jpg'),
    category: 'Classic',
    description: 'Timeless mahogany door with rich grain patterns and traditional craftsmanship.'
  },
  {
    id: '3',
    name: 'Glass Panel Interior Door',
    price: 649,
    image: require('../assets/images/door3.jpg'),
    category: 'Interior',
    description: 'Stylish glass panel door that brings light and elegance to any room.'
  },
  {
    id: '4',
    name: 'Rustic Pine Barn Door',
    price: 799,
    image: require('../assets/images/door4.jpg'),
    category: 'Rustic',
    description: 'Charming barn door with authentic rustic appeal and sliding mechanism.'
  },
  {
    id: '5',
    name: 'Contemporary Steel Door',
    price: 1599,
    image: require('../assets/images/door5.jpg'),
    category: 'Modern',
    description: 'Sleek steel door with minimalist design and superior security features.'
  },
  {
    id: '6',
    name: 'Victorian Style Door',
    price: 1899,
    image: require('../assets/images/door6.jpg'),
    category: 'Classic',
    description: 'Ornate Victorian door with intricate carvings and period authenticity.'
  },
  {
    id: '7',
    name: 'Bamboo Sliding Door',
    price: 549,
    image: require('../assets/images/door7.jpg'),
    category: 'Interior',
    description: 'Eco-friendly bamboo door with smooth sliding action and natural beauty.'
  },
  {
    id: '8',
    name: 'Industrial Metal Door',
    price: 1199,
    image: require('../assets/images/door8.jpg'),
    category: 'Modern',
    description: 'Industrial-inspired metal door with exposed hardware and urban appeal.'
  }
];

export const categories = [
  { id: '1', name: 'Modern', icon: '🏠' },
  { id: '2', name: 'Classic', icon: '🏛️' },
  { id: '3', name: 'Interior', icon: '🚪' },
  { id: '4', name: 'Rustic', icon: '🌲' },
];

export const getDoorsByCategory = (category: string) => {
  return doors.filter(door => door.category === category);
}; 