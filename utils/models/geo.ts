export const AddressTypes = [
	"street_address",
	"street_number",
	"route",
	"intersection",
	"political",
	"country",
	"administrative_area_level_1",
	"administrative_area_level_2",
	"administrative_area_level_3",
	"administrative_area_level_4",
	"administrative_area_level_5",
	"administrative_area_level_6",
	"administrative_area_level_7",
	"colloquial_area",
	"locality",
	"sublocality",
	"sublocality_level_1",
	"sublocality_level_2",
	"sublocality_level_3",
	"sublocality_level_4",
	"sublocality_level_5",
	"neighborhood",
	"premise",
	"subpremise",
	"plus_code",
	"postal_code",
	"natural_feature",
	"airport",
	"park",
	"point_of_interest",
] as const;

export type AddressType = typeof AddressTypes[number];

export type Country = {
	/**
	 * Nombre del país, en el lenguaje seleccionado.
	 */
	name: string;
	/**
	 * URL de la bandera.
	 */
	flag: string;
};
