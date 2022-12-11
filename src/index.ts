type Matchers<T, R = any> =
	| {
			[K in keyof T]: (data: T[K]) => R
	  }
	| ({
			[K in keyof T]?: T[K] extends null
				? (data?: T[K]) => R
				: T[K] extends undefined
				? () => R
				: (data: T[K]) => R
	  } & {
			_: (data: T[keyof T]) => R
	  })

type Zitem<T, K extends keyof T = keyof T> = [K, T[K]]

class Zenum<T extends Record<string | symbol, any>> {
	match<R, K extends keyof T>(
		item: Zitem<T, K>,
		matchers: Matchers<T, R>
	): R {
		return (
			matchers[item[0]] ||
			matchers._ ||
			((data) => {
				throw new Error(
					`No matchers found! The data received (json): ${JSON.stringify(
						data
					)}`
				)
			})
		)(item[1])
	}

	item<K extends keyof T>(k: K, data: T[K]): Zitem<T, K> {
		return [k, data]
	}

	_any<K extends keyof T>(data: T[K]): Zitem<T> {
		return ["?", data]
	}
}

type ZenumFactory<T = any> = InstanceType<typeof Zenum<T>> & {
	[K in keyof T]: T[K] extends null
		? (data?: Zitem<T, K>[1]) => Zitem<T, K>
		: T[K] extends undefined
		? () => Zitem<T, K>
		: (data: Zitem<T, K>[1]) => Zitem<T, K>
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

export type itemof<T extends { _any: any }> = ReturnType<T["_any"]>

export default zenum