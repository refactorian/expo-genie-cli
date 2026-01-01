import { fileSystem } from '../../utils/fs';
import path from 'path';

export const paymentsGenerator = {
  async generateStripeSetup(projectPath: string): Promise<void> {
    const stripeConfig = `import { Stripe } from '@stripe/stripe-react-native';

export const stripeConfig = {
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_KEY || '',
  merchantIdentifier: 'merchant.com.yourapp',
};

export const initializeStripe = async () => {
  // Initialize Stripe
};
`;

    await fileSystem.writeFile(
      path.join(projectPath, 'src/config/stripe.ts'),
      stripeConfig
    );
  },

  async generatePaymentScreen(projectPath: string): Promise<void> {
    const paymentScreen = `import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

export default function PaymentScreen() {
  const [cardDetails, setCardDetails] = useState<any>(null);
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    setLoading(true);
    try {
      // Example: fetch payment intent from your backend; replace with your implementation
      const clientSecret = 'YOUR_CLIENT_SECRET';
      
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Success', 'Payment successful!');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(details) => setCardDetails(details)}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
`;

    const screensPath = path.join(projectPath, 'src/features/payments/screens');
    await fileSystem.createDirectory(screensPath);
    await fileSystem.writeFile(
      path.join(screensPath, 'PaymentScreen.tsx'),
      paymentScreen
    );
  },
};