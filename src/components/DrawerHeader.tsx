import React from "react";
import { StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function DrawerHeader(props: any) {
  const { showLogo, ...other } = props;
  const dimensions = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const size = dimensions.width * 0.6;

  return (
    <View style={styles.container}>
      {/* <View style={stylesFunc.oval(size, top)} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00B2EE",
    overflow: "scroll",
  },
});

const stylesFunc = {
  oval: (size: number, top: number): ViewStyle => ({
    alignSelf: "center",
    width: size,
    height: size,
    borderRadius: size,
    marginTop: -(top * 3.25),
    backgroundColor: "#00B2EE",
    transform: [{ scaleX: 2 }],
  }),
};
