import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DollarSign, CreditCard, Smartphone } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type PaymentMethod = 'venmo' | 'cashapp' | 'paypal';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  availableMethods: {
    venmo?: string;
    cashapp?: string;
    paypal?: string;
  };
}

export default function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  availableMethods,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'venmo' as PaymentMethod,
      name: 'Venmo',
      icon: <Smartphone size={24} color={colors.text} />,
      available: !!availableMethods.venmo,
      handle: availableMethods.venmo,
    },
    {
      id: 'cashapp' as PaymentMethod,
      name: 'Cash App',
      icon: <DollarSign size={24} color={colors.text} />,
      available: !!availableMethods.cashapp,
      handle: availableMethods.cashapp,
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: <CreditCard size={24} color={colors.text} />,
      available: !!availableMethods.paypal,
      handle: availableMethods.paypal,
    },
  ];

  const availableMethodsCount = Object.values(availableMethods).filter(Boolean).length;

  if (availableMethodsCount === 0) {
    return (
      <View style={styles.noMethodsContainer}>
        <Text style={styles.noMethodsText}>
          No payment methods available. Please contact the DJ directly.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      {methods.map((method) => {
        if (!method.available) return null;
        
        return (
          <Pressable
            key={method.id}
            style={({ pressed }) => [
              styles.methodItem,
              selectedMethod === method.id && styles.selectedMethod,
              pressed && styles.pressedMethod,
            ]}
            onPress={() => onSelect(method.id)}
          >
            <View style={styles.methodContent}>
              <View style={styles.methodIcon}>{method.icon}</View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodHandle}>{method.handle}</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioButton,
                selectedMethod === method.id && styles.radioButtonSelected,
              ]}
            >
              {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMethod: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  pressedMethod: {
    opacity: 0.8,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  methodHandle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  noMethodsContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 20,
  },
  noMethodsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});