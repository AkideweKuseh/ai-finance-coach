/**
 * Scan Receipt Screen
 * Parse receipt text and pre-fill LogTransaction
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography, radius, shadows, useThemedColors } from "../theme";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { Button } from "../components/common/Button";

const parseReceipt = (text: string): { description: string; amount: number | null } => {
  const amountMatch = text.match(/\$?([\d,]+\.?\d{0,2})/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(",", "")) : null;

  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const merchantLine = lines.find((l) => !/^\$?[\d.,]+$/.test(l) && l.length > 2);
  const description = merchantLine ?? "Receipt Purchase";

  return { description, amount };
};

const ScanReceiptScreen = () => {
  const themedColors = useThemedColors();
  const navigation = useNavigation<any>();
  const [receiptText, setReceiptText] = useState("");

  const handleParse = () => {
    if (!receiptText.trim()) {
      Alert.alert("Empty", "Paste or type some receipt text first.");
      return;
    }
    const { description, amount } = parseReceipt(receiptText);
    navigation.replace("LogTransaction", {
      prefill: { description, amount: amount ?? undefined },
    });
  };

  return (
    <ScreenContainer backgroundColor={themedColors.background}>
      <View style={[styles.header, { borderBottomColor: themedColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={themedColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: themedColors.textPrimary }]}>Scan Receipt</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.receiptCard, { backgroundColor: themedColors.surface, borderColor: themedColors.border }]}>
          <Ionicons name="receipt-outline" size={40} color={colors.primary} style={styles.icon} />
          <Text style={[styles.cardTitle, { color: themedColors.textPrimary }]}>Paste Receipt Text</Text>
          <Text style={[styles.cardSubtitle, { color: themedColors.textSecondary }]}>
            Copy text from your receipt or banking app and paste it below. We'll extract the amount and merchant name.
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: themedColors.background,
                color: themedColors.textPrimary,
                borderColor: themedColors.border,
              },
            ]}
            placeholder={"e.g.\nStarbucks Coffee\n$6.75\nThank you!"}
            placeholderTextColor={themedColors.textSecondary}
            multiline
            numberOfLines={8}
            value={receiptText}
            onChangeText={setReceiptText}
            textAlignVertical="top"
          />
        </View>

        <Button title="Parse Receipt" onPress={handleParse} variant="primary" style={styles.parseButton} />

        <Text style={[styles.hint, { color: themedColors.textSecondary }]}>
          Tip: Works best when the receipt has a merchant name and a dollar amount on separate lines.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1,
  },
  closeButton: { width: 32, height: 32, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", fontFamily: typography.fontFamily.display },
  content: { padding: spacing.lg, gap: spacing.lg },
  receiptCard: {
    borderRadius: radius["2xl"], borderWidth: 1, padding: spacing.lg,
    alignItems: "center", gap: spacing.md, ...shadows.sm,
  },
  icon: { marginBottom: spacing.xs },
  cardTitle: { fontSize: 18, fontWeight: "700", fontFamily: typography.fontFamily.display },
  cardSubtitle: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  textArea: {
    width: "100%", minHeight: 140, borderRadius: radius.xl, borderWidth: 1,
    padding: spacing.md, fontSize: 15, fontFamily: typography.fontFamily.body,
  },
  parseButton: { marginTop: spacing.sm },
  hint: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});

export default ScanReceiptScreen;
