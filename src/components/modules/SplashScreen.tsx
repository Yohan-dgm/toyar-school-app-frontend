import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
}) => {
  // Simplified animation values using Reanimated 3
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const progressOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    // Simplified animations using Reanimated 3
    backgroundOpacity.value = withTiming(1, { duration: 800 });

    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Title animation with delay
    setTimeout(() => {
      titleOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
      titleTranslateY.value = withSpring(0, {
        damping: 12,
        stiffness: 120,
      });
    }, 400);

    // Subtitle animation
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }, 800);

    // Progress bar animation
    setTimeout(() => {
      progressOpacity.value = withTiming(1, { duration: 400 });
      progressWidth.value = withTiming(1, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      });
    }, 1000);

    // Complete animation after 4 seconds
    setTimeout(() => {
      if (onAnimationComplete) {
        runOnJS(onAnimationComplete)();
      }
    }, 4000);
  }, []);

  // Animated styles
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const progressContainerStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <Animated.View style={[styles.container, backgroundStyle]}>
        {/* Background Decorative Elements */}
        <View style={styles.backgroundElements}>
          {/* Simplified gradient circles */}
          <View style={styles.gradientCircle1} />
          <View style={styles.gradientCircle2} />
          <View style={styles.gradientCircle3} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Container */}
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <Image
              source={require("@/assets/SchooSnap_logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title */}
          <Animated.View style={[styles.titleContainer, titleStyle]}>
            <Text style={styles.title}>School App</Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          {/* Subtitle */}
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Connect. Learn. Grow.
          </Animated.Text>

          {/* Progress Bar */}
          <Animated.View
            style={[styles.progressContainer, progressContainerStyle]}
          >
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progressBarStyle]} />
            </View>
            <Text style={styles.progressText}>Loading...</Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by</Text>
          <Text style={styles.companyName}>TOYAR Pvt. Ltd.</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  // Floating geometric elements
  floatingElement1: {
    position: "absolute",
    top: height * 0.15,
    right: width * 0.1,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(155, 7, 55, 0.1)",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingElement2: {
    position: "absolute",
    top: height * 0.25,
    left: width * 0.08,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(155, 7, 55, 0.15)",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  floatingElement3: {
    position: "absolute",
    bottom: height * 0.3,
    right: width * 0.15,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "rgba(155, 7, 55, 0.2)",
    backgroundColor: "transparent",
  },
  // Gradient background circles
  gradientCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(155, 7, 55, 0.08)",
  },
  gradientCircle2: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(155, 7, 55, 0.05)",
  },
  gradientCircle3: {
    position: "absolute",
    top: height * 0.4,
    right: -200,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: "#9b0737",
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 60,
  },
  progressContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 200,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(155, 7, 55, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#9b0737",
    borderRadius: 2,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#9b0737",
    fontWeight: "500",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  footerText: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9b0737",
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
