import { FC, ReactNode } from "react";
import {
	Text as NativeText,
	TextProps as NativeTextProps,
} from "react-native";
import { StyleProps } from "react-native-reanimated";

export type TextProps = {
	children?: ReactNode;
	textProps?: NativeTextProps;
} & StyleProps;

export const Text: FC<TextProps> = ({
	children,
	textProps,
	...style
}) => {
	return (
		<NativeText {...{ textProps, style }}>
			{children}
		</NativeText>
	);
};
