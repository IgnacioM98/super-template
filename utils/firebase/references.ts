import { firestore } from "../../configs/firebase";
import {
	DocumentReference,
	DocumentSnapshot,
} from "./types";

export type QuerySet<T = any> = {
	[P in keyof T]?: Promise<DocumentSnapshot>;
};
export type RefOr<T> = T | DocumentReference;
export const isRef = (x: any): x is DocumentReference => {
	if (typeof x !== "object") return false;

	return (
		"firestore" in x &&
		"id" in x &&
		"parent" in x &&
		"path" in x &&
		"collection" in x &&
		"delete" in x &&
		"isEqual" in x &&
		"get" in x &&
		"onSnapshot" in x &&
		"set" in x &&
		"update" in x
	);
};

/**
 * @param x Recibe un arreglo de objetos.
 * @returns Retorna `true` si todos los objetos del
 * arreglo son `DocumentReference`.
 */
export const areRefs = (...x: any[]): boolean =>
	x.every(isRef);

/**
 * Recibe un objeto cualquiera `<T>` y hace una petición a Firebase para obtener
 * cada uno de sus campos que sean referencias (o `DocumentReference`). Solo lo hace
 * en el primer nivel del objeto, por lo que si hay referencias dentro de referencias,
 * estas no serán resueltas.
 *
 * @param object Objeto con referencias para resolver.
 * @param fieldsToGet Campos a obtener. Si no se especifica, se obtienen todos.
 * @returns Una copia del objeto `<T>`, con todos sus campos de tipo `DocumentReference`
 * resueltos.
 */
export const conseguirReferencias = async <
	T extends object
>(
	object: T,
	...fieldsToGet: (keyof T)[]
): Promise<T> => {
	const fieldQueries = determinarReferencias(
		object,
		...fieldsToGet
	);

	const queryData = await obtenerSetPeticiones(
		fieldQueries
	);

	return { ...object, ...queryData };
};

/**
 * Recibe un objeto genérico `<T>` y busca recursivamente entre sus propiedades
 * por `DocumentReference`. Por cada referencia encontrada, crea una query que
 * obtiene los datos del documento y lo guarda en un nuevo set, el cual es retornado
 * por esta función.
 *
 * @param object
 * @param fieldsToGet
 * @returns Un set de peticiones a Firebase.
 */
const determinarReferencias = <T extends object>(
	object: T,
	...fieldsToGet: (keyof T)[]
): QuerySet<T> => {
	const fieldQueries: QuerySet<T> = {};

	for (const key in object) {
		if (key === "ref") continue;

		const value = object[key];

		if (
			!isRef(value) &&
			!!fieldsToGet.length &&
			!fieldsToGet.find((f) => f === key)
		)
			continue;

		if (isRef(value))
			fieldQueries[key] = (() => {
				return firestore.doc(value.path).get();
			})();
	}

	return fieldQueries;
};

/**
 * Recibe un set de peticiones, y las resuelve.
 * @param fieldQueries
 */
const obtenerSetPeticiones = async <T extends object>(
	fieldQueries: QuerySet<T>
): Promise<Partial<T>> => {
	const data: Partial<T> = {};

	const fieldSnaps = await Promise.all(
		Object.values(
			fieldQueries
		) as Promise<DocumentSnapshot>[]
	);

	const fieldKeys = Object.keys(
		fieldQueries
	) as (keyof T)[];

	for (let i = 0; i < fieldSnaps.length; i++) {
		const fieldKey = fieldKeys[i];
		const fieldSnap = fieldSnaps[i];

		data[fieldKey] = {
			...fieldSnap.data(),
			ref: fieldSnap.ref,
		} as T[typeof fieldKey];
	}

	return data;
};

/**
 * Recibe la ruta de un documento de Firebase, y retorna una referencia a este.
 * Nota que esta función no hace ninguna petición a la base de datos, solo retorna
 * un `DocumentReference`, por lo que no puede revisar si esta existe.
 */
export const crearReferencia = (ruta: string) =>
	firestore.doc(ruta);
