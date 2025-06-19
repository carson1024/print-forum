export { };

declare global {
	/**
	 * Now declare things that go in the global namespace,
	 * or augment existing declarations in the global namespace.
	 */
	interface RoutesType {
		key: string;
		layout: string;
		component: JSX.Element;
		path: string;
		secondary?: boolean;
	}
}
