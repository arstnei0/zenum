<center>
<h1>Zenum</h1>

A better enum for simplicity and typesafety.

</center>

## About

Zenum has only two exports! The source code has only about 60 lines (with prettier)!

The project [TS Pattern](https://github.com/gvergnaud/ts-pattern) which is quite similar to Zenum is great, but it's not simply enough and sometimes its syntax is way trivial. For some simple usages (also in most cases), Zenum is enough and TS Pattern is too big and superfluous. But for more complex uses, I still recommend you to use TS Pattern which is undoubtedly well designed and implemented. Nonetheless, you won't need TS Pattern's big system in most cases.

## Usage

Use TypeScript!

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
type Data = string

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

Typesafety is the most important thing! If you type the code into VS Code and hover on the parameter `data` of the `success` array function, you will see the types are inferred correctly:

<img src="https://zihan.ga/images/zenum-screenshot.png">

Use `_` to handle the rest of the item types:

```ts
Response.match(res, {
	success: (data) => {
		console.log(`Received data successfully: `)
		console.log(data)
	},
	_: (data) => {
		console.log("Data not received")
	},
})
```

If the `_` is not set, a type error will occur. Always remember to match all the item types for safety. If some types of items don'
t need to be processed, just use `_() {},` to ignore them explicitly.

I think you won't need to use this type inference utility, but I still made it.

```ts
import { zenum, itemof } from "zenum"

type Data = string

const Response = zenum<{
	loading: undefined
	error: Error
	success: Data
}>()

type Response = itemof<typeof Response>
```

The type `Response` isn't really typesafe enough. Therefore, you should ony use these ones:

```ts
const resLoading = Response.loading()
const resError = Response.error(new Error("Some error message"))
const resSuccess = Response.success("Some data received")
```

Also, you can use the match result:

```ts
const ready = Response.match(res, {
	success: (data) => {
		console.log(`Received data successfully: `)
		console.log(data)
		return true
	},
	error: (error) => {
		console.log(`An unknown error occured!`)
		console.error(error)
		return false
	},
	loading: () => {
		console.log(`The data is being fetched...`)
		return false
	},
})
```

Caution: all the matcher functions should return the same thing! This will cause a type error:

```ts
const ready = Response.match(res, {
	success: (data) => {
		console.log(`Received data successfully: `)
		console.log(data)
		return true
	},
	error: (error) => {
		console.log(`An unknown error occured!`)
		console.error(error)
		// return false
	},
	loading: () => {
		console.log(`The data is being fetched...`)
		return false
	},
})
```

Or you can infer the return type explicitly **in the first matcher function** (not a generic):

```ts
const ready = Response.match(res, {
	success: (data) => {
		console.log(`Received data successfully: `)
		console.log(data)
		return true as boolean | undefined
	},
	error: (error) => {
		console.log(`An unknown error occured!`)
		console.error(error)
		// return false
	},
	loading: () => {
		console.log(`The data is being fetched...`)
		return false
	},
})
```

That's all! Happy TypeScripting, Guy!
