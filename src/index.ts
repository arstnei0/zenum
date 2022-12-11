type Matchers<T, R = any> =
	| {
			[K in keyof T]: (data: T[K]) => R
	  }
	| ({
			[K in keyof T]?: (data: T[K]) => R
	  } & {
			_: (data: T[keyof T]) => R
	  })

type Zitem<T, K extends keyof T = keyof T> = { _: K; $: T[K] }

class Zenum<T extends Record<string | symbol, any>> {
	match<K extends keyof T, R>(item: Zitem<T, K>, matchers: Matchers<T, R>) {
		return (matchers[item._] || matchers._)(item.$)
	}

	item<K extends keyof T>(k: K, data: T[K]): Zitem<T, K> {
		return { _: k, $: data }
	}

	any<K extends keyof T>(data: T[K]): Zitem<T> {
		return data
	}
}

type ZenumFactory<T = any> = InstanceType<typeof Zenum<T>> & {
	[K in keyof T]: (data: Zitem<T, K>["$"]) => Zitem<T, K>
}

export const zenum = <T>(): ZenumFactory<T> => {
	const zenum = new Zenum<T>()
	const proxy = new Proxy(zenum, {
		get<K>(target, p: K, receiver) {
			return target[p] || ((data: T[keyof T]) => target.item(p, data))
		},
	}) as ZenumFactory<T>

	return proxy
}

export type itemof<T extends { any: any }> = ReturnType<T["any"]>

export default zenum