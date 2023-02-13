import { Document } from "../hooks/useDocumentPicker";
import { Asset } from "../hooks/useImagePicker";

export type ExpoFile = FileData | Document | Asset;

export type FileData = {
	local?: boolean;
	url: string;
	name: string;
	path?: string;
};

export const isAsset = (f: ExpoFile): f is Asset => {
	if (typeof f !== "object") return false;
	const { width, height } = f || {};
	return width && height;
};

export const isDocument = (f: ExpoFile): f is Document => {
	if (typeof f !== "object") return false;
	const { type } = f || {};
	return type === "success";
};

export const isFileData = (f: ExpoFile): f is FileData =>
	typeof f === "object" && !isAsset(f) && !isDocument(f);

export const fileDataToAsset = (f: FileData): Asset => ({
	uri: f.url,
	width: 0,
	height: 0,
	fileName: f.name,
});

export const fileDataToDocument = (
	f: FileData | Document
): Document =>
	isDocument(f)
		? f
		: {
				type: "success",
				name: f.name,
				uri: f.url,
		  };

export const createFileData = (f: ExpoFile): FileData => {
	if (isFileData(f)) return f;
	if (isAsset(f)) {
		const uriArr = f.uri.split("/");
		const name = uriArr[uriArr.length - 1];
		return { name, url: f.uri, local: true };
	} else return { name: f.name, url: f.uri, local: true };
};

/**
 * Transforma un array de FileData en a un array
 * que debe ser almacenado en la base de datos, como
 * referencia al archivo.
 */
export const parseFileData = (
	...f: FileData[]
): FileData[] =>
	f.map(({ name, path, url }) => ({
		name,
		path: path!,
		url,
	}));

export const updateFileDataArray = (
	newFiles: FileData[],
	deletedFiles: FileData[],
	oldFiles?: FileData[] | null
): FileData[] => {
	const _newFileData = [...newFiles];
	if (!oldFiles) return _newFileData;

	_newFileData.push(
		...oldFiles.filter(
			(oldFile) =>
				!deletedFiles.find(
					(deletedFile) =>
						oldFile.path === deletedFile.path &&
						oldFile.url === deletedFile.url
				)
		)
	);
	return _newFileData;
};
