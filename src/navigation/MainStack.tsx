import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import { stackScreens } from "../constants/screenNames";
import { useAppSelector } from "../redux/store/store";
import HomeScreen from "../screens/HomeScreen";
import SampleScreen from "../screens/SampleScreen";
import { HomeDrawer } from "./HomeDrawer";

interface RootStackParamList {
  [key: string]: undefined; // Screen names
}

export type StackComponentProps = StackScreenProps<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

export function MainStack() {
  const { authState } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator
      initialRouteName={stackScreens.Home}
      screenOptions={{ headerShown: false }}
    >
      {authState === "Authenticated" ? (
        <Stack.Screen name={stackScreens.Drawer}>
          {(props: StackComponentProps) => <HomeDrawer {...props} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name={stackScreens.Home}>
            {(props: StackComponentProps) => <HomeScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name={stackScreens.Sample}>
            {(props: StackComponentProps) => <SampleScreen {...props} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
