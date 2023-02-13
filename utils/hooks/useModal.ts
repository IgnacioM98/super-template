import { useCallback, useState } from "react";
import { ModalProps } from "react-native";

export const useModal = () => {
	const [modal, setModal] = useState(0);

	const openModal = (m: number) => {
		if (m === 0) return;
		setModal(m);
	};

	const closeModal = () => setModal(0);

	const checkOpen = useCallback(
		(m: number) => m === modal,
		[modal]
	);

	const modalProps = useCallback(
		(m: number): ModalProps => ({
			visible: m === 0 ? false : m === modal,
			onRequestClose: closeModal,
		}),
		[modal]
	);

	return {
		modal,
		checkOpen,
		openModal,
		closeModal,
		/**
		 * Genera las props para controlar un Modal de React Native.
		 * Ejemplo de uso:
		 * ```tsx
		 * const { modalProps } = useModal();
		 * //...
		 * <Modal {...modalProps(1)}>
		 * 		{...modalContent}
		 * </Modal>
		 * 
		 * ```
		 */
		modalProps,
	};
};
