function makeDeltaProxyHandler<T extends object>(
	object: T,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rootDelta: any,
	path: string | undefined = undefined,
): ProxyHandler<T> {
	const prePath = path ? `${path}.` : '';
	return {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		get(target: any, key: string): any {
			if (typeof target[key] === 'object' && target[key] !== null) {
				return new Proxy(target[key], makeDeltaProxyHandler(target[key], rootDelta, `${prePath}${key}`));
			} else {
				return target[key];
			}
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		set: (diff: any, key: string, value: any) => {
			foundry.utils.setProperty(rootDelta, `${prePath}${key}`, value);
			return true;
		},
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function makeDeltaProxy<T extends object>(object: T, delta: any): any {
	const merged = foundry.utils.mergeObject(object, delta, { inplace: false });
	return new Proxy(merged, makeDeltaProxyHandler(merged, delta));
}
