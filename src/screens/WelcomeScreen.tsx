import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { drawerScreens } from "../constants/screenNames";
import { MainLayout } from "../layout/MainLayout";

const WelcomeScreen = (props: DrawerContentComponentProps) => {
  const { navigation, ...others } = props;

  const jumpTo = (name: keyof typeof drawerScreens) =>
    navigation.jumpTo(drawerScreens[name], {});

  const onRedirect = () => jumpTo("Info");

  return (
    <MainLayout backgroundColor="red">
      <Text style={{ alignSelf: "center" }}>Welcome Screen</Text>
      <TouchableOpacity style={styles.button} onPress={onRedirect}>
        <Text>Redirect</Text>
      </TouchableOpacity>
    </MainLayout>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  button: {
    backgroundColor: "orange",
    height: 30,
    width: 100,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
