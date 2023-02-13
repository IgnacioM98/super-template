import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { drawerScreens } from "../constants/screenNames";
import { MainLayout } from "../layout/MainLayout";

const InfoScreen = (props: DrawerContentComponentProps) => {
  const { navigation, ...others } = props;

  const jumpTo = (name: keyof typeof drawerScreens) =>
    navigation.jumpTo(drawerScreens[name], {});

  const onRedirect = () => jumpTo("Welcome");

  return (
    <MainLayout drawerPadding backgroundColor="red" footer>
      <Text style={{ alignSelf: "center" }}>Info Screen</Text>
      <TouchableOpacity style={styles.button} onPress={onRedirect}>
        <Text>Redirect</Text>
      </TouchableOpacity>
    </MainLayout>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "pink" },
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
