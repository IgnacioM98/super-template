import { ExpoFile } from "../models/FileData";
import { STORAGE } from "./index";
import {
	createFileData,
	FileData,
} from "../models/FileData";

const getExtension = ({ name }: FileData) => {
	const arr = name.split(".");
	return arr[arr.length - 1];
};

/**
 * Sube un archivo a la base de datos.
 * @param path Ubicación del archivo. No incluir nombre ni extensión del archivo.
 * @param file Archivo a subir.
 * @param naming Función que define la convención para el nombre del archivo.
 * Por defecto, se ocupa el nombre original. Nota: i es el número de archivo,
 * y comienza en 1.
 * @returns Arreglo de FileData con la información del archivo subido.
 */
export const uploadFile = async (
	basePath: string,
	file: ExpoFile,
	naming: (f: FileData, i?: number) => string = (f) =>
		f.name,
	fileNumber?: number
): Promise<FileData> => {
	const data = createFileData(file);
	const fileName = `${naming(
		data,
		fileNumber
	)}.${getExtension(data)}`;
	const storagePath = `${basePath}/${fileName}`;
	const storageRef = STORAGE.ref(storagePath);

	if (!data.local)
		throw Error("Cannot upload a non-local file.");

	await storageRef.putFile(data.url);

	return {
		local: false,
		name: fileName,
		path: storagePath,
		url: await storageRef.getDownloadURL(),
	};
};

/**
 * Sube archivos a la base de datos. Automáticamente maneja la extensión del archivo.
 * @param path Ubicación de los archivos. No incluir nombre ni extensión del archivo.
 * @param files Archivos a subir en el directorio provisto.
 * @param naming Función que define el nombre del archivo. Por defecto, se ocupa
 * el nombre original del archivo. No inlcuir la extensión del archivo.
 * @returns Arreglo de FileData con la información del archivo subido.
 */
export const uploadFiles = async (
	path: string,
	files: ExpoFile[],
	naming?: (f: FileData, i?: number) => string
) => {
	return await Promise.all(
		files.map((file, i) =>
			uploadFile(path, file, naming, i + 1)
		)
	);
};

const deleteFile = async (f: FileData) => {
	const storageRef = STORAGE.ref(f.path);
	await storageRef.delete();
};

export const deleteFiles = async (...files: FileData[]) => {
	await Promise.all(files.map((f) => deleteFile(f)));
};
