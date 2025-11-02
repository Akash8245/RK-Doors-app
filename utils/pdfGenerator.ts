import { CartItem } from '@/contexts/CartContext';
import { Estimate, EstimateItem } from '@/types/estimate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Import Asset from expo-asset
let Asset: typeof import('expo-asset').Asset | null = null;
try {
  Asset = require('expo-asset').Asset;
} catch (error) {
  console.warn('expo-asset not available');
}

// Conditionally import packages - will be available after npm install
let Print: typeof import('expo-print') | null = null;
let Sharing: typeof import('expo-sharing') | null = null;

try {
  Print = require('expo-print');
  Sharing = require('expo-sharing');
} catch (error) {
  console.warn('PDF generation packages not installed. Please run: npm install expo-print expo-file-system expo-sharing');
}

// Get next estimate number
async function getNextEstimateNumber(): Promise<string> {
  try {
    const lastNumber = await AsyncStorage.getItem('lastEstimateNumber');
    let nextNumber = 1;
    
    if (lastNumber) {
      const lastNum = parseInt(lastNumber, 10);
      nextNumber = lastNum + 1;
    }
    
    await AsyncStorage.setItem('lastEstimateNumber', nextNumber.toString());
    return `EST-${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    // Fallback if AsyncStorage fails
    const timestamp = Date.now().toString().slice(-6);
    return `EST-${timestamp}`;
  }
}

// Convert image to base64 or URL string
async function getImageDataUri(image: any): Promise<string> {
  try {
    // If it's already a string URL
    if (typeof image === 'string') {
      // If it's a remote URL, convert to base64 for PDF compatibility
      if (image.startsWith('http://') || image.startsWith('https://')) {
        try {
          // Download image and convert to base64
          const response = await fetch(image);
          const blob = await response.blob();
          
          // Convert blob to base64 using FileSystem if available, otherwise return URL
          // Note: expo-print should handle URLs, but base64 is more reliable
          return image; // Return URL - expo-print can handle it
        } catch (error) {
          console.warn('Error fetching remote image, using URL:', error);
          return image; // Return original URL as fallback
        }
      }
      return image;
    }
    
    // If it's a require() result (local asset number)
    if (typeof image === 'number') {
      try {
        if (!Asset) {
          console.warn('Asset not available for image conversion');
          return '';
        }
        
        const asset = Asset.fromModule(image);
        await asset.downloadAsync();
        
        if (asset.localUri && FileSystem) {
          // Convert local file to base64
          const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Determine MIME type from file extension
          const ext = asset.localUri.split('.').pop()?.toLowerCase();
          const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
          
          return `data:${mimeType};base64,${base64}`;
        }
        return asset.localUri || '';
      } catch (error) {
        console.warn('Error processing local asset:', error);
        return '';
      }
    }
    
    // If it has a uri property
    if (image && typeof image === 'object' && image.uri) {
      return image.uri;
    }
    
    return '';
  } catch (error) {
    console.warn('Error processing image:', error);
    return '';
  }
}

export async function convertCartItemsToEstimate(
  cartItems: CartItem[],
  clientName: string = 'Customer'
): Promise<Estimate> {
  const estimateNumber = await getNextEstimateNumber();
  const date = new Date().toISOString();
  
  const items: EstimateItem[] = await Promise.all(
    cartItems.map(async (item, index) => {
      const width = parseFloat(item.width) || 0;
      const height = parseFloat(item.height) || 0;
      const squareFeet = (width * height) / 144; // Convert square inches to square feet
      
      // Get image URI (base64 or URL)
      const picture = await getImageDataUri(item.image);
      
      return {
        id: item.id,
        si: index + 1,
        description: item.name,
        picture,
        designNumber: item.category,
        size: `${item.width}" × ${item.height}" × ${item.thickness}mm`,
        squareFeet: Math.round(squareFeet * 100) / 100,
        quantity: item.quantity,
        amount: item.price * item.quantity,
      };
    })
  );

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discount = 0; // You can add discount logic later
  const total = subtotal - discount;

  return {
    estimateNumber,
    date,
    clientName,
    items,
    subtotal,
    discount,
    total,
  };
}

// Get logo as base64
async function getLogoBase64(): Promise<string> {
  try {
    if (!Asset || !FileSystem) {
      console.warn('Asset or FileSystem not available for logo');
      return '';
    }
    
    const logoAsset = Asset.fromModule(require('@/assets/images/main-blue.png'));
    await logoAsset.downloadAsync();
    
    if (logoAsset.localUri) {
      // Read file and convert to base64
      const base64 = await FileSystem.readAsStringAsync(logoAsset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/png;base64,${base64}`;
    }
    return '';
  } catch (error) {
    console.warn('Error loading logo:', error);
    return '';
  }
}

export async function generateEstimateHTML(estimate: Estimate): Promise<string> {
  // Get logo URI as base64
  const logoUri = await getLogoBase64();
  
  const itemsHTML = estimate.items.map((item) => {
    // Handle image - could be base64, URL, or local URI
    let pictureSrc = '';
    if (item.picture) {
      if (item.picture.startsWith('data:') || item.picture.startsWith('http')) {
        pictureSrc = item.picture;
      } else if (item.picture.startsWith('file://')) {
        // For local files, try to read as base64
        pictureSrc = item.picture; // Will be handled by expo-print
      } else {
        pictureSrc = item.picture;
      }
    }
    
    const pictureHTML = pictureSrc
      ? `<img src="${pictureSrc}" alt="${item.description}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; display: block; margin: 0 auto;" />`
      : '<div style="width: 48px; height: 48px; background: #f1f5f9; border-radius: 8px; margin: 0 auto;"></div>';
    
    return `
      <tr style="${estimate.items.indexOf(item) !== estimate.items.length - 1 ? 'border-bottom: 1px solid #e2e8f0;' : ''}">
        <td style="padding: 16px; font-size: 14px; color: #0f172a;">${item.si}</td>
        <td style="padding: 16px; font-size: 14px; color: #0f172a; font-weight: 600;">${item.description}</td>
        <td style="padding: 16px; text-align: center;">${pictureHTML}</td>
        <td style="padding: 16px; text-align: center; font-size: 14px; color: #334155; font-weight: 600;">${item.designNumber}</td>
        <td style="padding: 16px; text-align: center; font-size: 14px; color: #334155;">${item.size}</td>
        <td style="padding: 16px; text-align: center; font-size: 14px; color: #334155;">${item.squareFeet || ''}</td>
        <td style="padding: 16px; text-align: center; font-size: 14px; color: #0f172a;">${item.quantity}</td>
        <td style="padding: 16px; text-align: right; font-size: 14px; color: #0f172a; font-weight: 600;">₹ ${item.amount.toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estimate - ${estimate.estimateNumber}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
      min-height: 297mm;
    }
    .container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(to right, rgba(30, 91, 168, 0.85), rgba(43, 107, 190, 0.85));
      padding: 24px 32px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo {
      height: 64px;
      object-fit: contain;
    }
    .estimate-info {
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.1);
    }
    .estimate-info-row {
      display: flex;
      gap: 32px;
      font-size: 14px;
    }
    .estimate-info-item p {
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 4px;
    }
    .estimate-info-item p:last-child {
      color: white;
      font-weight: 600;
    }
    .header-title {
      text-align: center;
      color: white;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 0;
    }
    .client-info {
      padding: 24px 32px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .client-info p {
      margin: 0;
      font-size: 14px;
      color: #475569;
    }
    .client-info span {
      font-weight: 600;
      color: #475569;
    }
    .client-info .name {
      margin-left: 12px;
      color: #0f172a;
      font-weight: 600;
    }
    .items-section {
      padding: 24px 32px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .items-table thead tr {
      background: rgba(30, 91, 168, 0.85);
      color: white;
    }
    .items-table th {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      text-align: left;
    }
    .items-table th:nth-child(3),
    .items-table th:nth-child(4),
    .items-table th:nth-child(5),
    .items-table th:nth-child(6),
    .items-table th:nth-child(7) {
      text-align: center;
    }
    .items-table th:last-child {
      text-align: right;
    }
    .items-table tbody {
      background: white;
    }
    .totals-section {
      padding: 0 32px 32px;
    }
    .totals-container {
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      width: 320px;
      background: #f8fafc;
      border-radius: 8px;
      padding: 24px;
      border: 1px solid #e2e8f0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .total-row-label {
      color: #475569;
    }
    .total-row-value {
      color: #0f172a;
      font-weight: 600;
    }
    .total-divider {
      padding-top: 16px;
      border-top: 1px solid #cbd5e1;
      margin-top: 16px;
    }
    .total-final {
      background: rgba(30, 91, 168, 0.85);
      color: white;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-final-label {
      font-size: 18px;
      font-weight: bold;
    }
    .total-final-value {
      font-size: 24px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
        <div class="header-top">
          <div class="logo-section">
            ${logoUri ? `<img src="${logoUri}" alt="RK Doors" class="logo" />` : '<div style="color: white; font-size: 24px; font-weight: bold;">RK DOORS</div>'}
          </div>
        <div class="estimate-info">
          <div class="estimate-info-row">
            <div class="estimate-info-item">
              <p>Date</p>
              <p>${new Date(estimate.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div class="estimate-info-item">
              <p>No</p>
              <p>${estimate.estimateNumber}</p>
            </div>
          </div>
        </div>
      </div>
      <h1 class="header-title">ESTIMATE</h1>
    </div>

    <!-- Client Info -->
    <div class="client-info">
      <p>
        <span>TO:</span>
        <span class="name">${estimate.clientName}</span>
      </p>
    </div>

    <!-- Items Table -->
    <div class="items-section">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 64px;">SI</th>
            <th>Description</th>
            <th style="width: 80px; text-align: center;">Pic</th>
            <th style="width: 128px; text-align: center;">Design Number</th>
            <th style="width: 96px; text-align: center;">Size</th>
            <th style="width: 96px; text-align: center;">Sq.Ft.</th>
            <th style="width: 96px; text-align: center;">Quantity</th>
            <th style="width: 128px; text-align: right;">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <!-- Totals Section -->
    <div class="totals-section">
      <div class="totals-container">
        <div class="totals-box">
          <div class="total-row">
            <span class="total-row-label">Sub Total</span>
            <span class="total-row-value">₹ ${estimate.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="total-row">
            <span class="total-row-label">Discount</span>
            <span class="total-row-value">₹ ${estimate.discount.toLocaleString('en-IN')}</span>
          </div>
          <div class="total-divider">
            <div class="total-final">
              <span class="total-final-label">TOTAL</span>
              <span class="total-final-value">₹ ${estimate.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

export async function generateAndDownloadPDF(cartItems: CartItem[], clientName: string = 'Customer'): Promise<void> {
  // Check if required packages are installed
  if (!Print || !FileSystem || !Sharing) {
    throw new Error('PDF generation packages not installed. Please run: npm install expo-print expo-file-system expo-sharing');
  }

  try {
    // Convert cart items to estimate format (now async)
    const estimate = await convertCartItemsToEstimate(cartItems, clientName);
    
    // Generate HTML
    const html = await generateEstimateHTML(estimate);
    
    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });
    
    if (uri) {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // Share the PDF file directly
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share Estimate ${estimate.estimateNumber}`,
        });
      } else {
        // If sharing is not available, save to documents and show alert
        const fileName = `Estimate_${estimate.estimateNumber}.pdf`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri,
        });
        
        throw new Error('Sharing is not available on this device. PDF saved to documents.');
      }
    }
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

