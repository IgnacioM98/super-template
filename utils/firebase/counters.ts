import { firebase } from "@react-native-firebase/FIRESTORE";
import { FIRESTORE } from ".";
import { DocumentReference } from "./types";

/**
 * Este es el documento que contiene una subcolección
 * con múltiples subcontadores, cuya cantidad es definida
 * por la propiedad `contadores`.
 */
type Contador = {
	contadores?: number;
};

/**
 * Este es uno de los documentos contenidos en la subcolección
 * de contadores. La propiedad `total` es un valor acumulado parcial
 * del total del contador.
 */
type Subcontador = {
	total?: number;
};

const MAX_SUBCOUNTERS = 10;

/**
 * Crea un contador destribuido en la ubicación determinada,
 * con la cantidad especificada de subcontadores.
 *
 * Nótese que no es posible crear un contador distribuido en
 * directorios que no estén vacíos; esto lanzará un Error.
 *
 * Por seguridad, solo se pueden crear hasta 5 subcontadores,
 * a no ser que se especifique `force=true` en los parámetros.
 *
 * @param docPath Ubicación del contador.
 * @param subcontadores Cantidad de subcontadores (o shards) que
 * sumarán el total del contador. (Por defecto, `3`).
 * @param forzar Si es `true`, permite crear hasta 500 contadores.
 * (No recomendado, por defecto `false`).
 */
export const crearContador = async (
	docPath: string,
	{ subcontadores, forzar } = {
		subcontadores: 3,
		forzar: false,
	}
) => {
	const counterSnap = await FIRESTORE.doc(docPath).get();

	if (!forzar && counterSnap.exists)
		throw Error(
			`Ya existen datos en la ruta "${docPath}".
			Puedes puedes forzar la creación del contador llamando la
			función de esta forma: crearContador("${docPath}", { forzar: true })`
		);

	if (subcontadores > MAX_SUBCOUNTERS && !forzar)
		throw Error(
			`Por motivos de optimización, no se pueden crear más de ${MAX_SUBCOUNTERS} 
			subcontadores. Puedes forzar la creación del contador llamando la función de esta forma:
			crearContador("${docPath}", { subcontadores: ${subcontadores}, forzar: true })`
		);

	if (subcontadores > 500)
		throw Error(
			"No se pueden generar más de 500 contadores."
		);

	await FIRESTORE.doc(counterSnap.ref.path).set({
		contadores: subcontadores,
	});

	await crearSubcontadores(counterSnap.ref);
};

/**
 * Aumenta el contador distribuido de la ubicación determinada, por la cantidad
 * especificada.
 *
 * @param docPath Ubicación del contador.
 * @param cantidad Cantidad a aumentar. (Por defecto `1`, puede ser negativo.).
 */
export const aumentarContador = async (
	docPath: string,
	cantidad = 1
) => {
	const counterSnap = await FIRESTORE.doc(docPath).get();
	const { contadores } = counterSnap.data() as Contador;

	if (!counterSnap.exists || !contadores)
		throw Error(`El directorio ${docPath} no existe, 
      o no tiene la propiedad 'contadores' definida.`);

	// Elegir subcontador aleatorio
	const idSubcontador = Math.floor(
		Math.random() * contadores
	);

	await FIRESTORE.doc(
		`${counterSnap.ref.path}/Contadores/${idSubcontador}`
	).update({
		total:
			firebase.firestore.FieldValue.increment(cantidad),
	});
};

/**
 * Disminuye el contador distribuido de la ubicación determinada, por la cantidad
 * especificada.
 *
 * @param docPath Ubicación del contador.
 * @param cantidad Cantidad a disminuir. (Por defecto, `1`; puede ser negativo.).
 */
export const reducirContador = async (
	docPath: string,
	cantidad = 1
) => await aumentarContador(docPath, -cantidad);

export const getTotalContador = async (
	directorio: String
) => {
	const subcontadoresSnap = await FIRESTORE.collection(
		`${directorio}/Contadores`
	).get();

	if (subcontadoresSnap.empty)
		throw Error(
			`Los subcontadores del directorio ${directorio} 
      no están definidos.`
		);

	let totalContador = 0;

	subcontadoresSnap.docs.forEach((snap) => {
		const { total } = snap.data() as Subcontador;
		totalContador += total || 0;
	});

	return totalContador;
};

const crearSubcontadores = async (
	baseRef: DocumentReference
) => {
	const baseSnap = await FIRESTORE.doc(baseRef.path).get();
	const { contadores } = baseSnap.data() as Contador;
	const subcounterBatch = FIRESTORE.batch();

	if (!contadores)
		throw Error(
			`Se intentó crear una cantidad indeterminada 
      de contadores distribuidos. La ruta ${baseRef.path} no tiene la
      propiedad 'contadores' definida.`
		);

	for (let i = 0; i < contadores; i++) {
		const subCounterRef = FIRESTORE.doc(
			`${baseRef.path}/Contadores/${i}`
		);

		subcounterBatch.set(subCounterRef, { total: 0 });
	}

	await subcounterBatch.commit();
};

export const crearOrAumentarContador = async (
	directorio: string,
	valor = 1
) => {
	try {
		await crearContador(directorio);
		await aumentarContador(directorio, valor);
	} catch {
		try {
			aumentarContador(directorio, valor);
		} catch (e) {
			console.error("No fue posible aumentar el contador.");
			console.error(e);
		}
	}
};
