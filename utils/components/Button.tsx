import { AntDesign } from "@expo/vector-icons";
import { FC, ReactNode } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
} from "react-native";
import { TextProps, Text } from "./Text";

export type CustomButtonProps = {
	arrow?: boolean;
	filled?: boolean;
	filledColor?: string;
	borderColor?: string;
	textProps?: TextProps;
	leadingIcon?: ReactNode;
	trailingIcon?: ReactNode;
	isLoading?: boolean;
} & TouchableOpacityProps;

export const Button: FC<CustomButtonProps> = ({
	children,
	arrow = false,
	filled = false,
	filledColor,
	borderColor,
	textProps,
	style,
	leadingIcon,
	trailingIcon,
	isLoading,
	onPress,
	...others
}) => {
	const handlePress = (ev: any) => {
		if (isLoading) return;
		onPress?.(ev);
	};

	return (
		<TouchableOpacity
			style={[
				styles.container,
				{
					borderColor: borderColor
						? filled
							? undefined
							: borderColor
						: "white",
					borderWidth: filled ? 0 : 2,
					borderRadius: 1000,
					backgroundColor: filledColor,
				},
				style,
			]}
			onPress={handlePress}
			{...others}
		>
			{isLoading ? (
				<View
					style={{
						width: "100%",
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					<ActivityIndicator
						size={"large"}
						color={textProps?.color || "white"}
					/>
				</View>
			) : (
				<>
					{leadingIcon ? (
						<View style={styles.leadingIcon}>
							{leadingIcon}
						</View>
					) : null}

					{typeof children === "string" ? (
						<Text {...textProps}>{children}</Text>
					) : (
						children
					)}
					{arrow && !trailingIcon ? (
						<AntDesign
							name="arrowright"
							size={24}
							color={borderColor || "white"}
							style={{ position: "absolute", right: 20 }}
						/>
					) : (
						(
							<View style={styles.trailingIcon}>
								{trailingIcon}
							</View>
						) || null
					)}
				</>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		// width: "100%",
		justifyContent: "center",
		alignItems: "center",
		height: 48,
		flexDirection: "row",
	},
	text: {
		fontFamily: "Medium",
	},
	leadingIcon: {
		position: "absolute",
		left: 15,
		width: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	trailingIcon: {
		position: "absolute",
		right: 15,
		width: 30,
		justifyContent: "center",
		alignItems: "center",
	},
});
