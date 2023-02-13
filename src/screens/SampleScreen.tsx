import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { stackScreens } from "../constants/screenNames";
import { MainLayout } from "../layout/MainLayout";
import { StackComponentProps } from "../navigation/MainStack";

const SampleScreen = (props: StackComponentProps) => {
  const { navigation, ...others } = props;

  const navigate = (name: keyof typeof stackScreens) =>
    navigation.navigate(stackScreens[name]);

  const onRedirect = () => navigate("Home");

  return (
    <MainLayout isStackScreen>
      <Text>Sample Screen</Text>
      <TouchableOpacity style={styles.button} onPress={onRedirect}>
        <Text>Redirect</Text>
      </TouchableOpacity>
    </MainLayout>
  );
};

export default SampleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
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
