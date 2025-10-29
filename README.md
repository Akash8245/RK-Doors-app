# RK Doors - Designer Door Shopping App

A beautiful React Native app for RK Doors, a company that sells designer and handcrafted doors. Built with Expo, Firebase authentication, and modern UI design.

## Features

### 🏠 **Home Screen**
- Beautiful door catalog with grid layout
- Search functionality to find doors by name or category
- Add to cart functionality with real-time updates
- Hamburger menu with navigation options
- Modern, minimalist design

### 📂 **Category Screen**
- Browse doors by categories (Modern, Classic, Interior, Rustic)
- Interactive category cards with door counts
- Filtered door listings
- Beautiful card-based UI

### 🛒 **Cart Screen**
- Fully functional shopping cart
- Quantity controls for each item
- Real-time total price calculation
- Remove items functionality
- Checkout process with confirmation
- Empty cart state with helpful messaging

### 👤 **Profile Screen**
- User account management
- Personal information display
- Settings and preferences
- Order history (placeholder)
- Help & support section
- Logout functionality

### 🔐 **Authentication**
- Firebase authentication integration
- Beautiful login and signup screens
- Email/password authentication
- Secure user session management
- Automatic routing based on auth state

### 🎨 **Design Features**
- Light theme with modern aesthetics
- Consistent color scheme throughout
- Smooth animations and transitions
- Responsive design for different screen sizes
- Professional typography and spacing
- Shadow effects and elevation

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Firebase** for authentication and database
- **Expo Router** for navigation
- **React Context** for state management
- **Expo Vector Icons** for icons
- **Expo Image** for optimized image loading

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rk-doors
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Get your Firebase configuration
   - Update `firebase/config.ts` with your Firebase credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
rk-doors/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── category.tsx   # Category screen
│   │   ├── cart.tsx       # Cart screen
│   │   └── profile.tsx    # Profile screen
│   ├── auth.tsx           # Authentication screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── DoorCard.tsx      # Door product card
│   └── SplashScreen.tsx  # App splash screen
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── CartContext.tsx   # Shopping cart state
├── data/                 # Static data
│   └── doors.ts          # Door catalog data
├── firebase/             # Firebase configuration
│   └── config.ts         # Firebase setup
├── constants/            # App constants
│   └── Colors.ts         # Color scheme
└── hooks/               # Custom hooks
    └── useColorScheme.ts # Theme management
```

## Key Features Implementation

### Authentication Flow
- Uses Firebase Auth for secure user authentication
- Automatic routing between auth and main app
- Persistent login state
- Beautiful login/signup UI

### Shopping Cart
- Context-based state management
- Real-time cart updates
- Quantity controls
- Total price calculation
- Checkout process

### Navigation
- Bottom tab navigation
- Side hamburger menu
- Smooth transitions
- Badge indicators for cart items

### UI/UX
- Consistent design language
- Responsive layouts
- Loading states
- Error handling
- Accessibility considerations

## Customization

### Adding New Doors
Edit `data/doors.ts` to add new door products:
```typescript
{
  id: 'unique-id',
  name: 'Door Name',
  price: 999,
  image: 'image-url',
  category: 'Category',
  description: 'Door description'
}
```

### Styling
- Colors are defined in `constants/Colors.ts`
- Theme support for light/dark modes
- Consistent spacing and typography

### Firebase Configuration
- Update Firebase config in `firebase/config.ts`
- Add additional Firebase services as needed
- Configure security rules for your database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.

---

**RK Doors** - Crafting Excellence in Every Door 🚪✨
