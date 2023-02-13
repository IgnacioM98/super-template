import { createDrawerNavigator } from "@react-navigation/drawer";
import { CustomDrawer } from "../components/CustomDrawer";
import { DrawerHeader } from "../components/DrawerHeader";
import { drawerScreens } from "../constants/screenNames";
import InfoScreen from "../screens/InfoScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { StackComponentProps } from "./MainStack";

const Drawer = createDrawerNavigator();

export function HomeDrawer(stackProps: StackComponentProps) {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        headerTitle: () => null,
        headerBackground: DrawerHeader,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name={drawerScreens.Welcome}>
        {(props: any) => <WelcomeScreen {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name={drawerScreens.Info}>
        {(props: any) => <InfoScreen {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
