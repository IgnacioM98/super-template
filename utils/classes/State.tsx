import {
	Context,
	createContext,
	FC,
	ReactNode,
	useContext,
} from "react";

/**
 * Es un Hook que inicializa un contexto.
 */
export type StateInitializer<T> = (
	partialContext?: Partial<T>
) => T;

export type ProviderProps<Data> = {
	children?: ReactNode;
} & Partial<Data>;

/**
 * Una clase que permite crear un contexto en base a un
 * hook. Esta clase recibe una función como parámetro (`factory`).
 *
 * Ejemplo de uso:
 * ```ts
 * // Un estado que mantiene un contador:
 * const state = new State( () => {
 * 		const [count, setCount] = useState(0);
 * 		const add = () => setCount(count + 1);
 * 		const subtract = () => setCount(count - 1);
 *
 * 		return { count, add, subtract };
 * } );
 * ```
 *
 * El `State` retorna un objeto con tres cosas:
 * - Un Provider para tu contexto (`Provider`).
 * - Un Hook para acceder al contexto (`useContext`).
 * - Un Hook para inicializar el contexto (`useFactory`).
 * ```ts
 * // Renombrar y exportar:
 * export const {
 * 	Provider: CounterProvider,
 * 	useContext: useCounter,
 * 	useFactory: useCounterFactory,
 * } = state;
 * ```
 *
 * Es posible utilizar estos elementos dentro de un componente
 * funcional:
 * ```tsx
 * // Componente del contador:
 * const Counter = () => {
 * 	return (
 * 		<CounterProvider>
 * 			<CounterDisplay />
 * 			<CounterButtons />
 * 		</CounterProvider>
 * 	);
 * }
 * // Dentro de un sub-componente::
 * const CounterDisplay = () => {
 * 	const { count } = useCounter();
 * 	return <p>{count}</p>;
 * }
 * ```
 *
 * Si lo necesitas, también es posible personalizar el
 * estado inicial del contexto:
 * ```tsx
 * // El contador comenzará en 10:
 * const Counter = () => {
 * 	return (
 * 		<CounterProvider count={10}>
 * 			<CounterDisplay />
 * 			<CounterButtons />
 * 		</CounterProvider>
 * 	);
 * }
 * ```
 *
 * Si necesitas utilizar un tipo de Typescript del estado en partes
 * externas, puedes hacer lo siguiente:
 * ```ts
 * export type CounterState = ReturnType<typeof useCounterFactory>;
 * ```
 */
export class State<Data = unknown> {
	private readonly Context: Context<Data>;
	private readonly factory: () => Data;

	/**
	 * Construye un Estado y lo inicializa.
	 * @param factory Un hook que define el estado del Context.
	 */
	constructor(factory: () => Data) {
		this.Context = createContext<Data>({} as Data);
		this.factory = factory;
	}

	/**
	 * @returns Un Componente Funcional usado para
	 * proveer de los datos del contexto a un árbol de Componentes.
	 */
	public readonly Provider: FC<ProviderProps<Data>> = ({
		children,
		...partialContext
	}) => {
		const { Provider } = this.Context;

		return (
			<Provider
				value={{
					...this.factory(),
					...partialContext,
				}}
			>
				{children}
			</Provider>
		);
	};

	/**
	 * Un hook que consigue el valor actual del estado.
	 */
	public readonly useContext = () =>
		useContext<Data>(this.Context);

	/**
	 * Crea un Estado.
	 */
	public readonly useFactory = (
		props?: Partial<Data>
	): Data => ({
		...this.factory(),
		...props,
	});
}
