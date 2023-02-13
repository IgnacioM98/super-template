import Axios from "axios";
import { AxiosError } from "../axios";
import { Country } from "../models/geo";

const Langs = [
	"ara",
	"bre",
	"ces",
	"cym",
	"deu",
	"est",
	"fin",
	"fra",
	"hrv",
	"hun",
	"ita",
	"jpn",
	"kor",
	"nld",
	"per",
	"pol",
	"por",
	"rus",
	"slk",
	"spa",
	"swe",
	"tur",
	"urd",
	"zho",
] as const;

type Lang = typeof Langs[number];

type ImgType = "png" | "svg";

/**
 * @throws `Error` si la consulta falla.
 */
export const getCountryArray = async (
	lang: Lang = "spa",
	imageType: ImgType = "png"
): Promise<Country[]> => {
	try {
		const { data } = await Axios.get<any[]>(
			"https://restcountries.com/v3.1/all"
		);
		return data
			.map((c) => ({
				name: c.translations[lang].common as string,
				flag: c.flags[imageType] as string,
			}))
			.sort((a, b) => a.name.localeCompare(b.name));
	} catch (error) {
		throw AxiosError(error);
	}
};
