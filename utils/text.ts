export const cleanString = (value: string) =>
	`${value}`
		.toLowerCase()
		.trim()
		.replace(/á/gi, "a")
		.replace(/é/gi, "e")
		.replace(/í/gi, "i")
		.replace(/ó/gi, "o")
		.replace(/ú/gi, "u")
		.replace(/ñ/gi, "n");
