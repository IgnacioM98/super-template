import {
	cacheDirectory,
	documentDirectory,
	downloadAsync,
	DownloadOptions,
} from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { useState } from "react";

const baseDirs = {
	cacheDirectory,
	documentDirectory,
};

type DownloadProps = {
	baseDir?: keyof typeof baseDirs;
	path?: string;
	share?: boolean;
} & DownloadOptions;

export const useDownloader = () => {
	const [downloading, setDownloading] = useState(false);

	const downloadFile = async (
		url: string,
		fileName: string,
		props?: DownloadProps
	) => {
		try {
			const {
				baseDir = "documentDirectory",
				path = "",
				share = true,
				...downloadOptions
			} = props || {};

			setDownloading(true);
			const file = await downloadAsync(
				url,
				baseDirs[baseDir] + path + fileName,
				downloadOptions
			);

			share && (await shareAsync(file.uri));

			return file;
		} catch (error) {
			console.error(error);
			return null;
		} finally {
			setDownloading(false);
		}
	};

	return { downloading, downloadFile };
};
