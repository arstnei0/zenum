<center>
<h1>Zenum</h1>

A better enum for simplicity and typesafety.

</center>

## About

Zenum has only two exports! The source code has only 44 lines (with prettier)!

The project [TS Pattern](https://github.com/gvergnaud/ts-pattern) which is quite similar to Zenum is great, but it's not simply enough and sometimes its syntax is way trivial. For some simple usages (also in most cases), Zenum is enough and TS Pattern is too big and superfluous. But for more complex uses, I still recommend you to use TS Pattern which is undoubtedly well designed and implemented. Nonetheless, you won't need TS Pattern's big system in most cases.

## Usage

First install the latest version of Zenum using whichever package manager you prefer to use. For example:

```shell
pnpm add zenum@latest
```

Import Zenum:

```ts
// These two imports are the same
import { zenum } from "zenum"
import zenum from "zenum"
```

Create a new Zenum Factory:

```ts
type Data = any

const Response = zenum<{
	loading: undefined
	error: Error
	success: Data
}>()
```

Create a actual response item:

```ts
const query = {
	isLoading: false,
	isError: false,
	error: undefined,
	data: "WOW",
} /** Some query */

const res = query.isLoading
	? Response.loading(null)
	: query.isError
	? Response.error(query.error)
	: Response.success(query.data)
```

Now you can match the item:

```ts
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
```

Wow! The code is so clear!