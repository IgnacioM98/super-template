import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

type Asyncable<T = any> = {
	loading: boolean;
	error: any;
	value: T | null;
};

export const Asyncable = <T>(value?: T): Asyncable<T> => ({
	value: value || null,
	loading: !!value,
	error: null,
});

type Props<T> = {
	builder: ActionReducerMapBuilder<any>;
	thunk: any;
	name: keyof T;
};

export const createAsyncReducers = <State>(
	...reducers: Props<State>[]
) =>
	reducers.forEach((reducer) =>
		createAsyncableReducer(reducer)
	);

const createAsyncableReducer = <State>({
	thunk,
	builder,
	name,
}: Props<State>) => {
	const { addCase } = builder;
	const { pending, rejected, fulfilled } = thunk;
	addCase(pending, (state) => {
		// if (!isAsyncable(state[name])) return;
		state[name].loading = true;
	});
	addCase(rejected, (state, { error }) => {
		// if (!isAsyncable(state[name])) return;
		state[name].loading = false;
		state[name].error = error;
		console.error(error);
	});
	addCase(fulfilled, (state, { payload }) => {
		// if (!isAsyncable(state[name])) return;
		state[name].loading = false;
		state[name].error = null;
		if (payload === undefined) return;
		state[name].value = payload;
	});
};
