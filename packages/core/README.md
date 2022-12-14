<center>
<h1>Zenum</h1>

A better enum for simplicity and typesafety.

</center>

## Table of Contents

1. [About](#about)
2. [Basic Zenums](#basic-zenums)
3. [Safe Zenums](#safe-zenums)

## About

The project [TS Pattern](https://github.com/gvergnaud/ts-pattern) which is quite similar to Zenum is great, but it's not simply enough and sometimes its syntax is way trivial. For some simple usages (also in most cases), Zenum is enough and TS Pattern is too big and superfluous. But for more complex uses, I still recommend you to use TS Pattern which is undoubtedly well designed and implemented. Nonetheless, you won't need TS Pattern's big system in most cases.

## Basic Zenums

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
	success: Data
	error: Error
	loading: never
}>()
```

Create a actual response item:

```ts
const res = Response.success("Hello Zenum!")
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
// This will print `Received data successfully: Hello Zenum!`
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

If the `_` is not set, a type error will occur. Always remember to match all the item types for safety. If some types of items don't need to be processed, just use `_() {},` to ignore them explicitly.

You can use `typeof <Zenum>.Item` to get the type of the Zenum.

```ts
type Data = string

const Response = zenum<{
	success: Data
	error: Error
	loading: never
}>()
type Response = typeof Response.Item
```

Here are some different ways to create Zitems (I call it `Zitem`, it's just items).

```ts
const resLoading = Response.item("loading", undefined) // You need to pass an undefined explicitly!
const resError = Response.item("error", new Error("Some error message"))
const resSuccess = Response.item("success", "Some data received")

// Syntactic sugar
const resLoading = Response.loading() // Here you don't need to pass the undefined.
const resError = Response.error(new Error("Some error message"))
const resSuccess = Response.success("Some data received")
```

Also, you can use the match result:

```ts
const res = Response.loading()
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
// ready = true
```

Caution: all the matcher functions should return the same thing! This will cause a type error:

```ts
const ready = Response.match(res, {
	success: (data) => {
		console.log(`Received data successfully: `)
		console.log(data)
		return true
	},
	// This function has a type error because it's not returning a boolean
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

These are the basic usage of the **unsafe** Zenums. Yes, there are safer Zenums.

## Safe Zenums

Work in Progress...

## More

I will write examples of Zenum for almost all the features. The examples are in [the `examples` directory of this repo](https://github.com/zihan-ch/zenum/tree/main/examples). The examples of Zenum itself is in the [`examples/core` directory](https://github.com/zihan-ch/zenum/tree/main/examples/core).

What are some real world situations that we can use Zenum? I wrote a helper package that converts a React Query into a Zenum. See it's [README.md](https://github.com/zihan-ch/zenum/tree/main/packages/react-query-zenum) to find more info.