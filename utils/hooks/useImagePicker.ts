import { useState, useEffect } from "react";
import {
	requestCameraPermissionsAsync,
	requestMediaLibraryPermissionsAsync,
	getCameraPermissionsAsync,
	getMediaLibraryPermissionsAsync,
	launchCameraAsync,
	launchImageLibraryAsync,
	ImagePickerAsset,
	ImagePickerOptions,
	PermissionResponse,
	MediaTypeOptions,
} from "expo-image-picker/src/ImagePicker";
import {
	ExpoFile,
	isAsset,
	isFileData,
} from "../models/FileData";

export type Asset = ImagePickerAsset;

/**
 * Origen de la imágen. Puede ser la cámara o la galería.
 */
type MediaSource = "camera" | "gallery";

type AssetListener = (assets: Asset[]) => void;

export type ImagePickerProps = {
	/**
	 * Número máximo de assets que se pueden seleccionar.
	 */
	max?: number;
	/**
	 * Assets iniciales.
	 */
	value?: ExpoFile[];
	/**
	 * Cuando el usuario cancela la selección de assets.
	 */
	onCancel?: () => void;
	/**
	 * Cuando ocurre un error al subir assets.
	 */
	onError?: (error: Error) => void;
	/**
	 * Al eliminar un asset.
	 */
	onRemove?: AssetListener;
	/**
	 * Al crear asset.
	 */
	onAdd?: AssetListener;
	/**
	 * En caso de actualizar el arreglo.
	 */
	onChange?: AssetListener;
	/**
	 * Opciones al pedir solicitar una imagen.
	 */
	requestOptions?: Omit<ImagePickerOptions, "mediaTypes">;

	allow?: keyof typeof MediaTypeOptions;
};

export type ImagePickerHook = ReturnType<
	typeof useImagePicker
>;

export const useImagePicker = ({
	max,
	onCancel,
	onAdd,
	onRemove,
	onChange,
	requestOptions,
	allow = "All",
	value = [],
	onError = (e) => console.error(e),
}: ImagePickerProps) => {
	/// Assets
	const [assetArray, setAssetArray] = useState<Asset[]>(
		(() =>
			value.map((v) => {
				if (isAsset(v)) return v;
				else if (isFileData(v))
					return {
						uri: v.url,
						fileName: v.name,
						width: 0,
						height: 0,
					};
				else
					throw Error(
						"Value is not a valid tipe, only Asset or FileData."
					);
			}))()
	);

	const exceedsMax = (quantityToAdd: number = 1) => {
		if (!max) return false;
		return assetArray.length + quantityToAdd > max;
	};

	/**
	 * Agrega un asset al array de assets.
	 */
	const addAssets = (...a: ImagePickerAsset[]) => {
		if (max === 1) return setAssetArray([a[0]]);

		if (exceedsMax(a.length))
			throw Error(
				"No puedes subir más de " + max + " archivo/s."
			);

		if (a) {
			onAdd?.(a);
			setAssetArray(
				Array.isArray(a)
					? [...assetArray, ...a]
					: [...assetArray, a]
			);
		}
	};

	/**
	 * Elimina un asset del array de assets.
	 */
	const removeAsset = (...a: ImagePickerAsset[]) => {
		onRemove?.(a);
		setAssetArray(
			assetArray.filter(
				(asset) => !a.find((a) => a.uri === asset.uri)
			)
		);
	};

	/**
	 * Revisa si el usuario ha permitido los permisos multimedia.
	 * @returns PermissionResponse
	 */
	const getPermission = async (
		toUse: MediaSource
	): Promise<PermissionResponse> =>
		toUse === "camera"
			? getCameraPermissionsAsync()
			: getMediaLibraryPermissionsAsync();
	/**
	 * Pregunta al usuario si quiere dar permisos multimedia.
	 * @param toUse
	 * @returns
	 */
	const askPermission = async (
		toUse: MediaSource
	): Promise<PermissionResponse> =>
		toUse === "camera"
			? requestCameraPermissionsAsync()
			: requestMediaLibraryPermissionsAsync();

	/**
	 * Chequea si el usuario ha dado pemisos multimedia, sino los ha dado,
	 * los solicita.
	 *
	 * @throws Error, si el usuario deniega los permisos.
	 */
	const handlePermissions = async (toUse: MediaSource) => {
		const { granted } = await getPermission(toUse);
		if (!granted) {
			const { granted } = await askPermission(toUse);
			if (!granted)
				throw Error(
					"Permiso denegado: Necesitas darnos permisos" +
						" para ocupar la cámara o la galería."
				);
		}
	};

	const requestAsset = async (
		from: "camera" | "gallery",
		options?: ImagePickerOptions
	) => {
		try {
			await handlePermissions(from);
		} catch (error: any) {
			onError(error);
			return;
		}

		const _options = {
			...(options || requestOptions),
			mediaTypes: MediaTypeOptions[allow],
		};
		const { canceled, assets } = await (from === "camera"
			? launchCameraAsync(_options)
			: launchImageLibraryAsync(_options));

		if (canceled) return onCancel?.();

		addAssets(...assets);
	};

	// change listener
	useEffect(() => {
		onChange?.(assetArray);
	}, [assetArray]);

	return { assetArray, requestAsset, removeAsset };
};
