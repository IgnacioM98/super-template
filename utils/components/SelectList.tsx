import {
	Picker,
	PickerIOS,
} from "@react-native-picker/picker";
import * as React from "react";
import { useEffect, useState } from "react";
import {
	Button,
	Platform,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { StyleProps } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ListInputProps<T = any> {
	/**
	 * This text is shown whenever the value is `null` or `undefined`.
	 */
	placeholder?: string;
	containerStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProps;

	/**
	 * Receives a valid selected value. Not required to work fine.
	 */
	value?: T;

	/**
	 * Returns the selected value. Not required to work fine.
	 */
	onValueChange?: (newValue: T) => void;

	items: T[];
	///
	/**
	 * The first element of items[] is considered as null and it's no longer selectable.
	 */
	notNull?: boolean;

	enabled?: boolean;
	///
	/**
	 * Label shown on the input element.
	 */
	renderItem?: (item: T) => string;
	///
}

interface IosComponentProps extends ListInputProps {
	selected: any;
	onChange: (newValue: any, itemIndex: number) => void;
}

const IosComponent: React.FC<IosComponentProps> = ({
	containerStyle = {},
	inputStyle = {},
	onChange,
	items,
	enabled = true,
	renderItem,
	selected,
}) => {
	const [open, setOpen] = useState(false);
	const onClose = () => setOpen(false);

	const handleLabel = (item: any): string => {
		if (!item && items.length > 0 && items[0]) {
			if (renderItem && typeof items[0] === "object")
				return renderItem(items[0]);
			return String(items[0]);
		}
		if (!item && renderItem) return "";
		if (renderItem) return renderItem(item);
		return String(item);
	};

	const handleValue = (value: any) => {
		if (!value) return undefined;
		return items.find(
			(item) =>
				JSON.stringify(item) === JSON.stringify(value)
		); // Should be this way, not change
	};

	return (
		<React.Fragment>
			<TouchableOpacity
				style={[styles.containerInput, inputStyle]}
				disabled={!enabled}
				onPress={() => setOpen(true)}
			>
				<Text>{handleLabel(selected)}</Text>
			</TouchableOpacity>
			{open ? (
				<Modal
					isVisible={open}
					onBackButtonPress={onClose}
					useNativeDriver
					style={{ width: "100%", margin: 0, padding: 0 }}
					onBackdropPress={onClose}
				>
					<SafeAreaView style={styles.safeArea}>
						<View>
							<PickerIOS
								onValueChange={onChange}
								selectedValue={handleValue(selected)}
							>
								{items.map((item, index) => {
									return (
										<Picker.Item
											label={handleLabel(item)}
											value={item}
											key={index}
										/>
									);
								})}
							</PickerIOS>
						</View>
						<View>
							<Button onPress={onClose} title="Listo" />
						</View>
					</SafeAreaView>
				</Modal>
			) : null}
		</React.Fragment>
	);
};

export const SelectList = <T,>({
	containerStyle = {},
	inputStyle = {},
	value,
	onValueChange,
	items,
	notNull = false,
	enabled = true,
	renderItem,
	placeholder = "Selecciona una opción",
}: ListInputProps<T>) => {
	const [selected, setSelected] = useState<T>();

	const handleLabel = (item: any): string => {
		if (renderItem) return renderItem(item);
		if (item === undefined || item === null)
			return placeholder;
		return String(item);
	};

	const handleChange = (newItem: any, index: number) => {
		if (index === 0 && notNull) return;
		setSelected(newItem);
		onValueChange!(newItem);
	};

	useEffect(() => {
		if (value) return setSelected(value);

		// if (value === undefined) return;

		const item = items.find(
			(item) =>
				JSON.stringify(item) === JSON.stringify(value)
		);
		if (
			selected &&
			JSON.stringify(item) !== JSON.stringify(selected)
		) {
			setSelected(item);
		}
	}, [value]);

	const handleValue = (value?: T) => {
		if (!value) return undefined;
		return items.find(
			(item) =>
				JSON.stringify(item) === JSON.stringify(value)
		); // Should be this way, not change
	};

	return (
		<View
			style={[
				containerStyle,
				{
					width: "100%",
				},
			]}
		>
			{Platform.OS === "ios" && (
				<IosComponent
					containerStyle={containerStyle}
					inputStyle={inputStyle}
					items={items}
					selected={selected}
					onChange={handleChange}
					notNull={notNull}
					enabled={enabled}
					renderItem={renderItem}
				/>
			)}
			{Platform.OS === "android" && (
				<View style={[styles.containerInput, inputStyle]}>
					<Picker
						enabled={enabled}
						onValueChange={handleChange}
						selectedValue={handleValue(selected)}
					>
						{items.map((item, index) => {
							return (
								<Picker.Item
									label={handleLabel(item)}
									value={item}
									key={index}
								/>
							);
						})}
					</Picker>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	containerInput: {
		width: "100%",
		height: 50,
		backgroundColor: "#f5f5f5",
		borderRadius: 25,
		justifyContent: "center",
		paddingHorizontal: 13,
	},
	icon: {
		position: "absolute",
		alignSelf: "flex-end",
		// backgroundColor: colors.ERROR,
		backgroundColor: "yellow",
		right: 24,
		top: 13,
		borderRadius: 20,
		padding: 5,
		zIndex: -1,
	},
	safeArea: {
		width: "100%",
		backgroundColor: "#ffffff",
		borderTopLeftRadius: 13,
		borderTopRightRadius: 13,
		paddingHorizontal: 13,
		position: "absolute",
		paddingBottom: 25,
		bottom: 0,
	},
});
