import { FC, ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { StyleProps } from "react-native-reanimated";

export type BoxProps = {
	children?: ReactNode;
	viewProps?: ViewProps;
} & StyleProps;

/**
 * Componente utilizado principalmente para estilizar partes del sistema.
 * Descaradamente basado en el Box del MUI.
 * Ejemplos de uso:
 * ```tsx
 * <Box
 *   height={100}
 *   width={100}
 *   backgroundColor="red"
 * >
 *  {children}
 * </Box>
 *
 * //también válido:
 * const { redSquare } = StyleSheet.create({
 *   redSquare: {
 *     height: 100,
 *     width: 100,
 *     backgroundColor: "red",
 *   },
 * })
 * // ...
 * <Box {...redSquare}>{children}</Box>
 * ```
 * @param param0
 * @returns
 */
export const Box: FC<BoxProps> = ({
	children,
	viewProps,
	...style
}) => {
	return (
		<View {...viewProps} style={style}>
			{children}
		</View>
	);
};
