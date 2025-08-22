import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface InvoiceItem {
  id: number;
  description?: string;
  item_total: string;
  created_at: string;
  [key: string]: any;
}

interface InvoiceItemsListProps {
  items: InvoiceItem[];
  title: string;
  emptyMessage?: string;
}

const InvoiceItemsList: React.FC<InvoiceItemsListProps> = ({
  items,
  title,
  emptyMessage = "No items found",
}) => {
  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    return `LKR ${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getItemDescription = (item: InvoiceItem) => {
    if (item.description) {
      return item.description.replace(/<[^>]*>/g, ""); // Remove HTML tags
    }

    // Generate description based on available fields
    if (item.grade_level_id && item.term_id) {
      return `Grade ${item.grade_level_id} - Term ${item.term_id}`;
    }

    if (item.unit_price && item.qty) {
      return `${item.qty} × ${formatAmount(item.unit_price)}`;
    }

    return "Fee Item";
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: InvoiceItem;
    index: number;
  }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemNumber}>
          <Text style={styles.itemNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemDescription}>{getItemDescription(item)}</Text>
          <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
        </View>
        <Text style={styles.itemAmount}>{formatAmount(item.item_total)}</Text>
      </View>

      {item.unit_price && item.qty && (
        <View style={styles.itemDetails}>
          <Text style={styles.detailText}>
            Unit Price: {formatAmount(item.unit_price)} × Quantity: {item.qty}
          </Text>
        </View>
      )}
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="receipt-long" size={20} color="#666666" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="inbox" size={32} color="#CCCCCC" />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.item_total || "0"),
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MaterialIcons name="receipt-long" size={20} color="#666666" />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>
          {formatAmount(totalAmount.toString())}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 8,
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1976D2",
  },
  list: {
    maxHeight: 300,
  },
  itemContainer: {
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: "#999999",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  itemDetails: {
    marginLeft: 36,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8F8F8",
  },
  detailText: {
    fontSize: 12,
    color: "#666666",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    marginTop: 8,
  },
});

export default InvoiceItemsList;
