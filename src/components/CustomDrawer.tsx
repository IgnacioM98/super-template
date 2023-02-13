import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { stackScreens } from "../constants/screenNames";
import { restoreAuth } from "../redux/features/auth/authActions";
import { useAppDispatch } from "../redux/store/store";

export function CustomDrawer(props: DrawerContentComponentProps) {
  const { navigation, ...other } = props;

  const dispatch = useAppDispatch();

  const navigate = (name: keyof typeof stackScreens) =>
    navigation.navigate(stackScreens[name]);

  const onRedirect = () => navigate("Home");

  const onSignOut = () => {
    // navigate("Drawer");
    dispatch(restoreAuth());
  };
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={onSignOut} />
    </DrawerContentScrollView>
  );
}
