import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState, ReactNode } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  title: string;
  children: ReactNode;
}

export const HabilityAccordion: React.FC<Props> = ({
  title = "",
  children,
}) => {
  const [open, setOpen] = useState(false);

  const animatedController = useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = useState(0);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0rad", `${Math.PI}rad`],
  });

  const handlePress = () => {
    if (open) {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 0,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
    setOpen(!open);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title]}>{title}</Text>
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
        <View
          style={styles.bodyContainer}
          onLayout={(event) =>
            setBodySectionHeight(event.nativeEvent.layout.height)
          }
        >
          {children}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 0,
    fontSize: 12,
  },
  description: {
    marginTop: 0,
    marginLeft: 5,
    fontSize: 13,
  },
  bodyBackground: {
    overflow: "hidden",
  },
  titleContainer: {
    marginTop: 15,
    borderRadius: 4,
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    height: 40,
    borderBottomWidth: 1,
    backGroundColor: "lightgrey",
    borderColor: "#EFEFEF",
  },
  bodyContainer: {
    position: "absolute",
    bottom: 0,
  },
});
