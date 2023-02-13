import { useEffect } from "react";
import { Alert } from "react-native";

type Optional = {
	onCatch?: (error: any) => void;
	explode?: boolean;
	disableLog?: boolean;
	logSeverity?: keyof Pick<
		typeof console,
		"log" | "warn" | "info" | "error" | "debug"
	>;
};

export const useErrorWatcher = (
	error?: any,
	o?: Optional
) => {
	const {
		onCatch = (error: any) => {
			if (!error) return;
			Alert.alert(
				"Ha ocurrido un error",
				error?.message || "Error desconocido."
			);
		},
		explode = false,
		disableLog = true,
		logSeverity = "debug",
	} = o || {};

	const handleCrash = (error: any) => {
		if (!error) return;
		onCatch?.(error);
		if (explode) throw error;
		if (!disableLog) console[logSeverity](error);
	};

	useEffect(() => {
		if (!error) return;
		else handleCrash(error);
	}, [error]);

	return { handleCrash };
};
