import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Input from './Input';

interface TipAmountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  minAmount: number;
  suggestedAmounts?: number[];
}

export default function TipAmountSelector({
  value,
  onChange,
  minAmount,
  suggestedAmounts = [1, 5, 10, 20],
}: TipAmountSelectorProps) {
  const handleCustomAmountChange = (text: string) => {
    const amount = parseFloat(text);
    if (!isNaN(amount) && amount >= minAmount) {
      onChange(amount);
    } else if (text === '') {
      onChange(0);
    }
  };

  // Filter suggested amounts to be >= minAmount
  const filteredAmounts = suggestedAmounts.filter(amount => amount >= minAmount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tip Amount</Text>
      <Text style={styles.subtitle}>
        Minimum tip: ${minAmount.toFixed(2)}
      </Text>

      <View style={styles.amountButtons}>
        {filteredAmounts.map((amount) => (
          <Pressable
            key={amount}
            style={({ pressed }) => [
              styles.amountButton,
              value === amount && styles.selectedAmount,
              pressed && styles.pressedAmount,
            ]}
            onPress={() => onChange(amount)}
          >
            <Text style={[
              styles.amountText,
              value === amount && styles.selectedAmountText,
            ]}>
              ${amount}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.customAmountContainer}>
        <Text style={styles.customAmountLabel}>Custom Amount:</Text>
        <Input
          value={value ? value.toString() : ''}
          onChangeText={handleCustomAmountChange}
          keyboardType="decimal-pad"
          placeholder="Enter amount"
          leftIcon={<DollarSign size={20} color={colors.textSecondary} />}
          containerStyle={styles.customAmountInput}
        />
      </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amountButton: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedAmount: {
    backgroundColor: colors.primary,
  },
  pressedAmount: {
    opacity: 0.8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedAmountText: {
    color: colors.text,
  },
  customAmountContainer: {
    marginTop: 8,
  },
  customAmountLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  customAmountInput: {
    marginBottom: 0,
  },
});