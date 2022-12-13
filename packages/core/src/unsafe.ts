export type Key = string | symbol

export type Matchers<T = any, R = any> =
	| {
			[K in ZitemType<Zitem<T>>]: T[K] extends null
				? (data?: T[K]) => R
				: T[K] extends undefined
				? () => R
				: (data: T[K]) => R
	  }
	| ({
			[K in ZitemType<Zitem<T>>]?: T[K] extends null
				? (data?: T[K]) => R
				: T[K] extends undefined
				? () => R
				: (data: T[K]) => R
	  } & {
			_: (data: T[ZitemType<Zitem<T>>]) => R
	  })

export type Zitem<T = any, K extends ZitemType<Zitem<T>> = keyof T> = [K, T[K]]
export type ZitemType<I extends Zitem = Zitem> = I[0]
export type ZitemData<I extends Zitem = Zitem> = I[1]

export class Zenum<T extends Record<Key, any> = Record<Key, any>> {
	data<I extends ZitemType<Zitem<T>>>(item: Zitem<T, I>) {
		return item[1]
	}

	type<K extends ZitemType<Zitem<T>>>(item: Zitem<T, K>) {
		return item[0]
	}

	match<R, K extends ZitemType<Zitem<T>>>(item: Zitem<T, K>, matchers: Matchers<T, R>): R {
		return (
			matchers[this.type(item)] ||
			matchers._ ||
			((data) => {
				throw new Error(`No matchers found!`)
			})
		)(this.data(item))
	}

	run<R, K extends ZitemType<Zitem<T>>>(item: Zitem<T, K>, matchers: Partial<Matchers<T, R>>): R {
		return this.match(item, matchers as Matchers<T, R>)
	}

	item<K extends ZitemType<Zitem<T>>>(k: K, data: T[K]): Zitem<T, K> {
		return [k, data]
	}

	semantic<K extends ZitemType<Zitem<T>>>(item: Zitem<T, K>) {
		return {
			type: this.type(item),
			data: this.data(item),
		}
	}

	is<K extends ZitemType<Zitem<T>>, I extends Zitem<T>>(key: K, item: I) {
		return key === this.type(item)
	}

	Item: Zitem<T>
}

export type ZitemCreationSugur<T> = {
	[K in ZitemType<Zitem<T>>]: T[K] extends null
		? (data?: ZitemData<Zitem<T, K>>) => Zitem<T, K>
		: T[K] extends undefined
		? () => Zitem<T, K>
		: (data: ZitemData<Zitem<T, K>>) => Zitem<T, K>
}

export type ZenumFactory<T = any> = InstanceType<typeof Zenum<T>> & ZitemCreationSugur<T>

export function zenum<T>(): ZenumFactory<T> {
	const zenum = new Zenum<T>()
	const proxy = new Proxy(zenum, {
		get(target, p, receiver) {
			return target[p] ?? ((data: T[ZitemType<Zitem<T>>]) => target.item(p as any, data))
		},
	}) as ZenumFactory<T>

	return proxy
}
