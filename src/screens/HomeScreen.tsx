import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { stackScreens } from "../constants/screenNames";
import { MainLayout } from "../layout/MainLayout";
import { StackComponentProps } from "../navigation/MainStack";
import { validateAuth } from "../redux/features/auth/authActions";
import { useAppDispatch } from "../redux/store/store";

const HomeScreen = (props: StackComponentProps) => {
  const { navigation, ...others } = props;

  const dispatch = useAppDispatch();

  const navigate = (name: keyof typeof stackScreens) =>
    navigation.navigate(stackScreens[name]);

  const onRedirect = () => navigate("Sample");
  const onLogin = () => {
    // navigate("Drawer");
    dispatch(validateAuth());
  };

  return (
    <MainLayout
      style={{}}
      title="HOME"
      isStackScreen
      scrollView
      footer
      footerType="scrollBottom"
      backgroundColor="lightgreen"
    >
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Text>Home</Text>
        <TouchableOpacity style={styles.button} onPress={onRedirect}>
          <Text>Redirect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text>Authenticate</Text>
        </TouchableOpacity>

        <View style={styles.simpleBox} />

        <View style={styles.simpleBox} />

        <View style={styles.simpleBox} />

        <View style={styles.simpleBox} />

        <View style={styles.simpleBox} />

        <View style={styles.simpleBox} />
      </View>
    </MainLayout>
  );
};

export default HomeScreen;

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
    marginVertical: 5,
  },

  simpleBox: {
    width: "100%",
    height: 100,
    backgroundColor: "red",
    marginVertical: 15,
  },
});
