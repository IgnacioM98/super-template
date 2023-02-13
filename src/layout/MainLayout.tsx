import React, { FC, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scrollView?: boolean;
  showVerticalScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  drawerPadding?: boolean;
  backgroundColor?: string;
  title?: string;
  footer?: boolean;
  footerType?: "alwaysBottom" | "scrollBottom";
  isStackScreen?: boolean;
};

export const MainLayout: FC<Props> = ({
  children,
  scrollView = false,
  showVerticalScrollIndicator = false,
  style = {},
  drawerPadding,
  backgroundColor = "#fff",
  title,
  footer = false,
  footerType = "alwaysBottom",
  isStackScreen = false,
}) => {
  const dimensions = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const size = dimensions.width;
  const multiplier = 10;
  const offset =
    Platform.OS === "ios"
      ? 0.55
      : dimensions.width < 420
      ? dimensions.height > 720
        ? 0.65
        : 0.85
      : 0.85;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: drawerPadding
            ? top * offset + 5
            : isStackScreen
            ? top
            : 10,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      {drawerPadding ? (
        <View style={stylesFunc.ovalContainer(offset, top, multiplier)}>
          <View style={stylesFunc.oval(size, top, multiplier)} />
        </View>
      ) : null}
      <KeyboardAvoidingView
        style={[styles.container, style, { backgroundColor: backgroundColor }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scrollView ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={showVerticalScrollIndicator}
            overScrollMode="never"
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {children}
            {footer && footerType === "scrollBottom" ? (
              <View style={stylesFunc.footer(size)} />
            ) : null}
          </ScrollView>
        ) : (
          <View style={styles.container}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {children}
            {footer && footerType === "scrollBottom" ? (
              <View style={stylesFunc.footer(size)} />
            ) : null}
          </View>
        )}
        {footer && footerType === "alwaysBottom" ? (
          <View
            style={{
              height: 100,
              width: dimensions.width,
              alignSelf: "center",
              backgroundColor: "yellow",
            }}
          />
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { alignSelf: "center", fontWeight: "bold" },
});

const stylesFunc = {
  oval: (size: number, top: number, multiplier: number): ViewStyle => ({
    alignSelf: "center",
    width: size / 2,
    height: top * multiplier + 5,
    borderRadius: size,
    backgroundColor: "#00B2EE",
    // backgroundColor: "orange",
    transform: [{ scaleX: 3 }],
  }),
  ovalContainer: (
    offset: number,
    top: number,
    multiplier: number
  ): ViewStyle => ({
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
    marginTop: -(top * (multiplier - offset)),
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowRadius: 5,
    // shadowOpacity: 0.3,
    // ...(Platform.OS === "android" && { elevation: 10 }),
  }),
  footer: (size: number): ViewStyle => ({
    height: 100,
    width: size,
    alignSelf: "center",
    backgroundColor: "yellow",
  }),
};
