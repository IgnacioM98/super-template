import { useState, useEffect } from "react";
import {
	FileData,
	fileDataToDocument,
} from "../models/FileData";
import {
	getDocumentAsync,
	DocumentResult,
	DocumentPickerOptions,
} from "expo-document-picker/src/index";
import { isDocument, isFileData } from "../models/FileData";

export type Document = { type: "success" } & DocumentResult;

export type DocumentPickerProps = {
	/**
	 * Número máximo de documentos que se pueden seleccionar.
	 */
	max?: number;
	/**
	 * Documentos iniciales.
	 */
	value?: (Document | FileData)[];
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
	onRemove?: (asset: Document | Document[]) => void;
	/**
	 * Al crear asset.
	 */
	onAdd?: (asset: Document | Document[]) => void;
	/**
	 * En caso de actualizar el arreglo.
	 */
	onChange?: (assets: Document[]) => void;
	/**
	 * Opciones al solicitar una imagen.
	 */
	requestOptions?: DocumentPickerOptions;
	/**
	 * Tipos de archivos permitidos (o MIME types).
	 * Ejemplo:
	 * ```
	 * ["image/*", "application/pdf"]
	 * ```
	 */
	allow?: string[];
};

export type DocumentPickerHook = ReturnType<
	typeof useDocumentPicker
>;

export const useDocumentPicker = ({
	max,
	onCancel,
	onAdd,
	onRemove,
	onChange,
	requestOptions,
	value,
	allow,
	onError = (e) => console.error(e),
}: DocumentPickerProps) => {
	const [documentArray, setDocumentArray] = useState<
		(Document)[]
	>([]);

	useEffect(() => {
		if (!value) return;
		setDocumentArray(value.map(fileDataToDocument));
	}, [value]);

	// const [documentArray, setDocumentArray] = useState<
	// 	Document[]
	// >(
	// 	(() =>
	// 		value.map((v) => {
	// 			if (isDocument(v)) return v;
	// 			else if (isFileData(v))
	// 				return fileDataToDocument(v);
	// 			else
	// 				throw Error(
	// 					"Invalid value passed to Document Picker."
	// 				);
	// 		}))()
	// );

	const addDocuments = (a: Document | Document[]) => {
		if (max && documentArray.length >= max)
			throw Error(
				"No puedes subir más de " + max + " archivo/s."
			);
		if (a) {
			const newArray = Array.isArray(a)
				? [...documentArray, ...a]
				: [...documentArray, a];
			onAdd?.(a);
			setDocumentArray(newArray);
			onChange?.(newArray);
		}
	};

	const removeDocuments = (a: Document | Document[]) => {
		const newArray = Array.isArray(a)
			? documentArray.filter((asset) =>
					a.find((a) => asset.uri !== a.uri)
			  )
			: documentArray.filter(
					(asset) => asset.uri !== a.uri
			  );

		onRemove?.(a);
		setDocumentArray(newArray);
		onChange?.(newArray);
	};

	const requestDocument = async (
		overriddenRequestOptions?: DocumentPickerOptions
	) => {
		try {
			const { type, ...doc } = await getDocumentAsync({
				...(overriddenRequestOptions || requestOptions),
				type: allow,
			});

			if (type === "cancel") return onCancel?.();
			else addDocuments({ type, ...doc } as Document);
		} catch (error: any) {
			onError(error);
			return;
		}
	};

	return {
		documentArray,
		requestDocument,
		removeDocuments,
	};
};
