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

type Zitem<T, K extends keyof T = keyof T> = [K,T[K]]

class Zenum<T extends Record<string | symbol, any>> {
	match<K extends keyof T, R>(item: Zitem<T, K>, matchers: Matchers<T, R>) {
		return (matchers[item[0]] || matchers._)(item[1])
	}

	item<K extends keyof T>(k: K, data: T[K]): Zitem<T, K> {
		return [k, data]
	}

	any<K extends keyof T>(data: T[K]): Zitem<T> {
		return data
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

export type itemof<T extends { any: any }> = ReturnType<T["any"]>

export default zenum

type Data = any

const Response = zenum<{
	loading: null
	error: Error
	success: Data
}>()

const query = {
	isLoading: false,
	isError: false,
	error: undefined,
	data: "WOW",
} /** ...(Some query) */
const res = query.isLoading
	? Response.loading(null)
	: query.isError
	? Response.error(query.error)
	: Response.success(query.data)

Response.match(res, {
	success: (data) => {
		console.log(`Received data successfully: `)
		console.log(data)
	},
	error: (error) => {
		console.log(`An unknown error occured!`)
		console.error(error)
	},
	loading: () => {
		console.log(`The data is being fetched...`)
	},
})
