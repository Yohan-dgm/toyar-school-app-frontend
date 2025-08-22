import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { modernColors, maroonTheme } from "../../data/studentGrowthData";

const { width, height } = Dimensions.get("window");

interface CategoryPieData {
  name: string;
  rating: number;
  color: string;
  percentage: number;
}

interface ChartDrawerProps {
  visible: boolean;
  overallData?: any;
  categoriesData?: any[];
  currentFilter?: string;
  onClose: () => void;
  onFilterChange?: (filter: string) => void;
}

const ChartDrawer: React.FC<ChartDrawerProps> = ({
  visible,
  overallData,
  categoriesData = [],
  currentFilter = "all",
  onClose,
  onFilterChange,
}) => {
  const [popupTranslateY] = useState(new Animated.Value(-height));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(0));

  // Initialize with simplified pie chart data
  const [pieData, setPieData] = useState<CategoryPieData[]>([
    {
      name: "Logical Intelligence",
      rating: 4.2,
      color: "#8B5CF6",
      percentage: 15,
    },
    {
      name: "Creative Intelligence",
      rating: 3.8,
      color: "#06B6D4",
      percentage: 12,
    },
    {
      name: "Emotional Intelligence",
      rating: 4.4,
      color: "#10B981",
      percentage: 18,
    },
    {
      name: "Physical Intelligence",
      rating: 4.1,
      color: "#F59E0B",
      percentage: 16,
    },
    {
      name: "Social Intelligence",
      rating: 4.0,
      color: "#EF4444",
      percentage: 14,
    },
    {
      name: "Musical Intelligence",
      rating: 3.7,
      color: "#8B5A2B",
      percentage: 11,
    },
  ]);

  console.log(
    "🚪 ChartDrawer - visible:",
    visible,
    "categoriesData:",
    categoriesData,
  );

  // Helper function to fix category naming inconsistencies
  const fixCategoryName = (name: string): string => {
    if (!name) return name;

    // Common fixes for database naming inconsistencies
    const fixes: { [key: string]: string } = {
      "Existential intelligence": "Existential Intelligence",
      "Existential Intelligence": "Existential Intelligence",
      "existential intelligence": "Existential Intelligence",
      "EXISTENTIAL INTELLIGENCE": "Existential Intelligence",

      "Contribution to school Community": "Contribution to School Community",
      "Contribution to School Community": "Contribution to School Community",
      "contribution to school community": "Contribution to School Community",
      "CONTRIBUTION TO SCHOOL COMMUNITY": "Contribution to School Community",

      "Music intelligence": "Music Intelligence",
      "Music Intelligence": "Music Intelligence",
      "music intelligence": "Music Intelligence",
      "MUSIC INTELLIGENCE": "Music Intelligence",

      "Bodily kinesthetic intelligence": "Bodily Kinesthetic Intelligence",
      "Bodily Kinesthetic intelligence": "Bodily Kinesthetic Intelligence",
      "Bodily Kinesthetic Intelligence": "Bodily Kinesthetic Intelligence",

      "Mathematical / logical intelligence":
        "Mathematical / Logical Intelligence",
      "Mathematical / Logical intelligence":
        "Mathematical / Logical Intelligence",
      "Mathematical / Logical Intelligence":
        "Mathematical / Logical Intelligence",

      "Intrapersonal intelligence": "Intrapersonal Intelligence",
      "Intrapersonal Intelligence": "Intrapersonal Intelligence",

      "Interpersonal intelligence": "Interpersonal Intelligence",
      "Interpersonal Intelligence": "Interpersonal Intelligence",

      "Linguistic intelligence": "Linguistic Intelligence",
      "Linguistic Intelligence": "Linguistic Intelligence",

      "Spatial intelligence": "Spatial Intelligence",
      "Spatial Intelligence": "Spatial Intelligence",

      "Naturalistic intelligence": "Naturalistic Intelligence",
      "Naturalistic Intelligence": "Naturalistic Intelligence",

      "Contribution to society": "Contribution to Society",
      "Contribution to Society": "Contribution to Society",

      "Attendance and punctuality": "Attendance and Punctuality",
      "Attendance and Punctuality": "Attendance and Punctuality",

      "Life skills development": "Life Skills Development",
      "Life Skills development": "Life Skills Development",
      "Life Skills Development": "Life Skills Development",
    };

    // Check for exact match first
    if (fixes[name]) {
      console.log(`🔧 Fixed category name: "${name}" → "${fixes[name]}"`);
      return fixes[name];
    }

    // Try case-insensitive matching
    const lowerName = name.toLowerCase();
    for (const [key, value] of Object.entries(fixes)) {
      if (key.toLowerCase() === lowerName) {
        console.log(`🔧 Fixed category name (case): "${name}" → "${value}"`);
        return value;
      }
    }

    return name; // Return original if no fix needed
  };

  // Transform API data to pie chart format
  useEffect(() => {
    console.log("🥧 ChartPopup - Processing API data:", categoriesData);
    console.log(
      "🥧 ChartPopup - Total categories received:",
      categoriesData?.length || 0,
    );

    // Debug: Show EVERY field in the first API item
    if (categoriesData && categoriesData.length > 0) {
      console.log("🔍 DETAILED API STRUCTURE DEBUG:");
      console.log("🔍 First item keys:", Object.keys(categoriesData[0]));
      console.log("🔍 First item full object:", categoriesData[0]);

      // Check ALL possible name fields
      categoriesData.forEach((item, index) => {
        console.log(`🔍 Item ${index + 1} name fields:`);
        console.log(`   category_name: "${item.category_name}"`);
        console.log(`   title: "${item.title}"`);
        console.log(`   name: "${item.name}"`);
        console.log(`   category: "${item.category}"`);
        console.log(`   type: "${item.type}"`);
        console.log(`   label: "${item.label}"`);
        console.log(`   description: "${item.description}"`);
        console.log(`   rating: ${item.rating}`);
        console.log(`   average_rating: ${item.average_rating}`);
        console.log(`   score: ${item.score}`);
        console.log(`   value: ${item.value}`);
        console.log(`   ---`);
      });
    }

    console.log(
      "🥧 ChartPopup - Raw categoriesData structure:",
      JSON.stringify(categoriesData, null, 2),
    );

    if (categoriesData && categoriesData.length > 0) {
      // DO NOT filter out any categories - show ALL 13 records from database
      console.log(
        "🥧 ChartPopup - Processing all categories without filtering:",
      );

      const transformedPieData = categoriesData.map((category, index) => {
        // Try multiple fields for rating
        const rating =
          category.average_rating ||
          category.rating ||
          category.score ||
          category.value ||
          0;

        // Try multiple fields for category name
        let categoryName =
          category.category_name ||
          category.title ||
          category.name ||
          category.category ||
          category.label ||
          category.type ||
          `Category ${index + 1}`;

        // Fix common naming inconsistencies from database
        const originalName = categoryName;
        categoryName = fixCategoryName(categoryName);

        console.log(
          `🥧 Category ${index + 1}: "${categoryName}" - Rating: ${rating}`,
        );
        console.log(`   Original name: "${originalName}"`);

        // Special debugging for problematic categories
        if (
          categoryName.toLowerCase().includes("existential") ||
          categoryName.toLowerCase().includes("contribution") ||
          categoryName.toLowerCase().includes("school")
        ) {
          console.log(`🔍 PROBLEMATIC CATEGORY DETECTED: "${categoryName}"`);
          console.log(`🔍 Rating extraction debug:`, {
            "category.rating": category.rating,
            "category.average_rating": category.average_rating,
            "category.score": category.score,
            "category.value": category.value,
            final_rating_used: rating,
            rating_type: typeof rating,
            is_zero: rating === 0,
            is_null: rating === null,
            is_undefined: rating === undefined,
            is_nan: isNaN(rating),
          });
          console.log(
            `🔍 Full raw object for this category:`,
            JSON.stringify(category, null, 2),
          );
        }

        console.log(`   All available fields:`, {
          category_name: category.category_name,
          title: category.title,
          name: category.name,
          category: category.category,
          label: category.label,
          type: category.type,
          rating: category.rating,
          average_rating: category.average_rating,
          score: category.score,
          value: category.value,
        });

        return {
          name: categoryName,
          rating: rating,
          color: getColorForCategory(categoryName, index),
          percentage: 0, // Will be calculated in render
        };
      });

      console.log(
        "🥧 ChartPopup - Final transformed pie data (",
        transformedPieData.length,
        "categories):",
        transformedPieData,
      );

      // Debug: Show all actual category names from API
      console.log("🔍 All category names from API:");
      transformedPieData.forEach((cat, index) => {
        console.log(`  ${index + 1}. "${cat.name}" - Rating: ${cat.rating}`);
      });

      // Verify we have all expected categories with better matching
      const expectedCategories = [
        "Intrapersonal Intelligence",
        "Interpersonal Intelligence",
        "Music Intelligence",
        "Bodily Kinesthetic Intelligence",
        "Linguistic Intelligence",
        "Mathematical / Logical Intelligence",
        "Existential Intelligence",
        "Spatial Intelligence",
        "Naturalistic Intelligence",
        "Contribution to School Community",
        "Contribution to Society",
        "Attendance and Punctuality",
        "Life Skills Development",
      ];

      console.log("🔍 Checking for expected categories:");
      expectedCategories.forEach((expectedName) => {
        // Try multiple matching strategies
        const exactMatch = transformedPieData.find(
          (cat) => cat.name === expectedName,
        );
        const partialMatch = transformedPieData.find((cat) =>
          cat.name.toLowerCase().includes(expectedName.toLowerCase()),
        );
        const firstWordMatch = transformedPieData.find((cat) =>
          cat.name.includes(expectedName.split(" ")[0]),
        );

        if (exactMatch) {
          console.log(
            `🔍 "${expectedName}": ✅ EXACT MATCH - "${exactMatch.name}"`,
          );
        } else if (partialMatch) {
          console.log(
            `🔍 "${expectedName}": ⚠️ PARTIAL MATCH - "${partialMatch.name}"`,
          );
        } else if (firstWordMatch) {
          console.log(
            `🔍 "${expectedName}": ⚠️ WORD MATCH - "${firstWordMatch.name}"`,
          );
        } else {
          console.log(`🔍 "${expectedName}": ❌ NO MATCH FOUND`);
        }
      });

      // Check specifically for the problematic categories
      const existentialCategory = transformedPieData.find(
        (cat) =>
          cat.name.toLowerCase().includes("existential") ||
          cat.name.toLowerCase().includes("exist"),
      );
      const contributionCategory = transformedPieData.find(
        (cat) =>
          cat.name.toLowerCase().includes("contribution") ||
          cat.name.toLowerCase().includes("school") ||
          cat.name.toLowerCase().includes("community"),
      );

      console.log("🔍 Special check for problematic categories:");
      console.log(
        `   Existential Intelligence: ${existentialCategory ? `✅ Found: "${existentialCategory.name}"` : "❌ Not found"}`,
      );
      console.log(
        `   Contribution to School: ${contributionCategory ? `✅ Found: "${contributionCategory.name}"` : "❌ Not found"}`,
      );

      // Count verification
      console.log("📊 CATEGORY COUNT VERIFICATION:");
      console.log(`   Expected: 13 categories`);
      console.log(`   Received from API: ${categoriesData.length} categories`);
      console.log(
        `   Processed for pie chart: ${transformedPieData.length} categories`,
      );

      if (categoriesData.length < 13) {
        console.log("⚠️ WARNING: Missing categories from API response!");
        console.log("⚠️ Backend may not be returning all 13 categories");
      } else if (categoriesData.length > 13) {
        console.log("ℹ️ INFO: More categories than expected - this is fine");
      }

      // Show which specific categories are missing
      const allExpectedCategories = [
        "Intrapersonal Intelligence",
        "Interpersonal Intelligence",
        "Music Intelligence",
        "Bodily Kinesthetic Intelligence",
        "Linguistic Intelligence",
        "Mathematical / Logical Intelligence",
        "Existential Intelligence",
        "Spatial Intelligence",
        "Naturalistic Intelligence",
        "Contribution to School Community",
        "Contribution to Society",
        "Attendance and Punctuality",
        "Life Skills Development",
      ];

      const missingCategories = allExpectedCategories.filter((expected) => {
        return !transformedPieData.some(
          (actual) =>
            actual.name.toLowerCase().includes(expected.toLowerCase()) ||
            expected.toLowerCase().includes(actual.name.toLowerCase()),
        );
      });

      if (missingCategories.length > 0) {
        console.log("❌ MISSING CATEGORIES:", missingCategories);
      } else {
        console.log("✅ All expected categories found!");
      }

      // Show raw API data structure for debugging
      if (categoriesData.length > 0) {
        console.log(
          "🔍 Raw API data structure (first item):",
          categoriesData[0],
        );
        console.log("🔍 Available fields:", Object.keys(categoriesData[0]));
      }

      // Filter out categories with "No Data" level to hide cards with missing data
      const filteredPieData = transformedPieData.filter((item) => {
        // Check if this category has actual data (rating > 0 or has meaningful data)
        const hasData = item.rating > 0;
        if (!hasData) {
          console.log(
            `🚫 Hiding category "${item.name}" - no data (rating: ${item.rating})`,
          );
        }
        return hasData;
      });

      console.log(
        `🥧 Filtered pie data: ${filteredPieData.length} categories with data (filtered out ${transformedPieData.length - filteredPieData.length})`,
      );

      setPieData(filteredPieData);
    } else {
      // Use comprehensive default data representing all 13 categories if no API data available
      console.log(
        "🥧 ChartPopup - Using comprehensive default data for all 13 categories",
      );
      setPieData([
        {
          name: "Intrapersonal Intelligence",
          rating: 4.2,
          color: "#8B5CF6",
          percentage: 0,
        },
        {
          name: "Interpersonal Intelligence",
          rating: 3.8,
          color: "#06B6D4",
          percentage: 0,
        },
        {
          name: "Music Intelligence",
          rating: 4.4,
          color: "#10B981",
          percentage: 0,
        },
        {
          name: "Bodily Kinesthetic Intelligence",
          rating: 4.1,
          color: "#F59E0B",
          percentage: 0,
        },
        {
          name: "Linguistic Intelligence",
          rating: 4.0,
          color: "#EF4444",
          percentage: 0,
        },
        {
          name: "Mathematical / Logical Intelligence",
          rating: 3.7,
          color: "#8B5A2B",
          percentage: 0,
        },
        {
          name: "Existential Intelligence",
          rating: 3.9,
          color: "#EC4899",
          percentage: 0,
        },
        {
          name: "Spatial Intelligence",
          rating: 4.3,
          color: "#6366F1",
          percentage: 0,
        },
        {
          name: "Naturalistic Intelligence",
          rating: 3.6,
          color: "#F97316",
          percentage: 0,
        },
        {
          name: "Contribution to School Community",
          rating: 4.0,
          color: "#84CC16",
          percentage: 0,
        },
        {
          name: "Contribution to Society",
          rating: 3.8,
          color: "#06B6D4",
          percentage: 0,
        },
        {
          name: "Attendance and Punctuality",
          rating: 4.5,
          color: "#8B5CF6",
          percentage: 0,
        },
        {
          name: "Life Skills Development",
          rating: 4.1,
          color: "#F59E0B",
          percentage: 0,
        },
      ]);
    }
  }, [categoriesData, visible]);

  // Get color for category - expanded to 13 unique colors for all database records
  const getColorForCategory = (categoryName: string, index: number) => {
    const colors = [
      "#8B5CF6", // Purple - Intrapersonal
      "#06B6D4", // Cyan - Interpersonal
      "#10B981", // Green - Music
      "#F59E0B", // Orange - Bodily Kinesthetic
      "#EF4444", // Red - Linguistic
      "#8B5A2B", // Brown - Mathematical/Logical
      "#EC4899", // Pink - Existential
      "#6366F1", // Indigo - Spatial
      "#F97316", // Dark Orange - Naturalistic
      "#84CC16", // Lime - School Community
      "#14B8A6", // Teal - Society
      "#8B5CF6", // Purple variant - Attendance
      "#F59E0B", // Orange variant - Life Skills
    ];

    // Ensure we have enough colors and don't go out of bounds
    const colorIndex = index % colors.length;
    console.log(
      `🎨 Category "${categoryName}" (index ${index}) assigned color: ${colors[colorIndex]}`,
    );

    return colors[colorIndex];
  };

  // Popup animations - slide from top
  useEffect(() => {
    console.log("🎬 ChartPopup - Animation triggered, visible:", visible);
    if (visible) {
      // Reset content opacity
      contentOpacity.setValue(0);

      // Slide in from top
      Animated.parallel([
        Animated.timing(popupTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Show content after popup is visible
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Slide out to top
      Animated.parallel([
        Animated.timing(popupTranslateY, {
          toValue: -height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    console.log("🚪 ChartDrawer - Close button pressed");
    onClose();
  };

  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Helper function to create SVG arc path
  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      centerX,
      centerY,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const renderPieChart = () => {
    const chartSize = 150;
    const radius = 65;
    const centerX = chartSize / 2;
    const centerY = chartSize / 2;

    // Calculate total for proper pie chart sizing
    const total = pieData.reduce((sum, item) => sum + item.rating, 0);

    // Calculate angles for each segment - handle zero ratings properly
    let currentAngle = 0;
    const minAngle = 3; // Minimum 3 degrees for visibility of zero-rating categories

    console.log(
      "🥧 Calculating pie chart segments for",
      pieData.length,
      "categories",
    );
    console.log("🥧 Total rating sum:", total);

    const segments = pieData.map((segment, index) => {
      let percentage, angle;

      if (total > 0) {
        // Normal calculation for non-zero totals
        percentage = segment.rating / total;
        angle = percentage * 360;

        // Ensure zero-rating categories get minimum visibility
        if (segment.rating === 0) {
          angle = minAngle;
          console.log(
            `🥧 Zero rating category "${segment.name}" given minimum angle: ${minAngle}°`,
          );
        }
      } else {
        // Equal distribution if all ratings are zero
        percentage = 1 / pieData.length;
        angle = percentage * 360;
        console.log(
          `🥧 All zero ratings - equal distribution: ${angle.toFixed(1)}° per category`,
        );
      }

      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle += angle;

      console.log(
        `🥧 Segment ${index + 1}: "${segment.name}" - Rating: ${segment.rating}, Angle: ${angle.toFixed(1)}°, Range: ${startAngle.toFixed(1)}° - ${endAngle.toFixed(1)}°`,
      );

      return {
        ...segment,
        startAngle,
        endAngle,
        angle,
        percentage: percentage * 100,
      };
    });

    console.log(
      "🥧 Total angle used:",
      currentAngle.toFixed(1),
      "degrees (should be ≤ 360)",
    );

    // Adjust if total exceeds 360 degrees due to minimum angles
    if (currentAngle > 360) {
      console.log(
        "⚠️ Total angle exceeds 360°, adjusting segments proportionally",
      );
      const scaleFactor = 360 / currentAngle;
      segments.forEach((segment) => {
        segment.angle *= scaleFactor;
        segment.percentage *= scaleFactor;
      });

      // Recalculate start/end angles
      let adjustedAngle = 0;
      segments.forEach((segment) => {
        segment.startAngle = adjustedAngle;
        segment.endAngle = adjustedAngle + segment.angle;
        adjustedAngle += segment.angle;
      });
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Intelligence Distribution</Text>

        {/* SVG Pie Chart */}
        <View style={styles.pieChartContainer}>
          <Svg width={chartSize} height={chartSize} style={styles.svgChart}>
            {/* Render pie segments using SVG paths */}
            {segments.map((segment, index) => (
              <Path
                key={segment.name}
                d={createArcPath(
                  centerX,
                  centerY,
                  radius,
                  segment.startAngle,
                  segment.endAngle,
                )}
                fill={segment.color}
                stroke="white"
                strokeWidth={2}
              />
            ))}

            {/* Center circle for donut effect */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={30}
              fill={modernColors.backgroundSolid}
              stroke={maroonTheme.primary}
              strokeWidth={2}
            />
          </Svg>

          {/* Center text overlay */}
          <View style={styles.centerInfo}>
            <Text style={styles.centerTitle}>Overall</Text>
            <Text style={styles.centerValue}>
              {overallData?.rating?.toFixed(1) || "0.0"}
            </Text>
            <Text style={styles.centerSubtext}>Rating</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSimpleLegend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Categories</Text>
      <View style={styles.legendGrid}>
        {pieData.map((category) => (
          <View key={category.name} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: category.color }]}
            />
            <Text style={styles.legendText} numberOfLines={1}>
              {category.name.replace(" Intelligence", "")}
            </Text>
            <Text style={styles.legendRating}>
              {category.rating.toFixed(1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Don't render anything if not visible
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Blur Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <BlurView intensity={80} tint="light" style={styles.blurView}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            onPress={handleClose}
            activeOpacity={1}
          />
        </BlurView>
      </Animated.View>

      {/* Popup */}
      <Animated.View
        style={[
          styles.popup,
          {
            transform: [{ translateY: popupTranslateY }],
          },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={[maroonTheme.primary, maroonTheme.accent, maroonTheme.light]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            {/* <MaterialIcons name="pie-chart" size={28} color="white" /> */}
            <Text style={styles.drawerTitle}>Intelligence Analytics</Text>
            <Text style={styles.drawerSubtitle}>
              Category Performance Distribution
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <Animated.View
          style={[styles.contentWrapper, { opacity: contentOpacity }]}
        >
          <View style={styles.content}>
            {/* Side-by-side layout */}
            <View style={styles.mainContent}>
              {/* Pie Chart */}
              {renderPieChart()}

              {/* Simple Legend */}
              {renderSimpleLegend()}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    flex: 1,
  },
  backdropTouchable: {
    flex: 1,
  },
  popup: {
    position: "absolute",
    top: 10, // 15% from top
    left: width * 0.05, // Center with 5% margin on each side
    width: width * 0.9, // 90% of screen width
    height: height * 0.55, // 65% of screen height - more compact
    backgroundColor: modernColors.backgroundSolid,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 1,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginTop: 1,
    marginBottom: 2,
  },
  drawerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    paddingRight: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: maroonTheme.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  pieChartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svgChart: {
    backgroundColor: "transparent",
  },
  centerInfo: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 35,
    width: 70,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 3,
  },
  centerTitle: {
    fontSize: 9,
    color: modernColors.textSecondary,
    fontWeight: "600",
  },
  centerValue: {
    fontSize: 14,
    fontWeight: "800",
    color: maroonTheme.primary,
    marginVertical: 1,
  },
  centerSubtext: {
    fontSize: 8,
    color: modernColors.textSecondary,
    fontWeight: "500",
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: modernColors.text,
    marginBottom: 8,
    textAlign: "left",
  },
  legendGrid: {
    gap: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: modernColors.surface,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  legendText: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    color: modernColors.text,
  },
  legendRating: {
    fontSize: 10,
    fontWeight: "800",
    color: maroonTheme.primary,
    minWidth: 24,
    textAlign: "right",
  },
});

export default React.memo(ChartDrawer);
