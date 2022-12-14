# React Query with Zenum

The package provides a wrapper that converts a react query into a Zenum.

## Install

Use whichever package manager to install React Query Zenum. For example:

```shell
pnpm add react-query-zenum@latest
```

## Usage

Wrapping `useQuery` example:

```ts
import { useQuery } from "@tanstack/react-query"
import { Query, queryToZenum } from "react-query-zenum"

export default function QueryPage() {
	const [query, { refetch }] = queryToZenum(
		useQuery({
			queryKey: ["fetch"],
			queryFn: async () =>
				(
					await fetch("https://fakerapi.it/api/v1/users?_quantity=1")
				).json(),
		})
	)

	return Query.match(query, {
		loading: () => <h1>Loading</h1>,
		success(data: any) {
			return (
				<>
					<h1>Data received: {JSON.stringify(data)}</h1>
					<button onClick={() => refetch()}>Refetch</button>
				</>
			)
		},
		error() {
			return <h1>Error!</h1>
		},
	})
}
```

Wrapping `useMutation` example: 

```ts
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Mutation, mutationToZenum } from "react-query-zenum"

export default function MutationPage() {
	const [number, setNumber] = useState(0)
	const [mutation, { mutate }] = mutationToZenum(
		useMutation({
			mutationFn: () =>
				new Promise((resolve) => {
					setTimeout(() => {
						setNumber(number + 1)
						resolve("Number increased: " + (number + 1))
					}, 1000)
				}),
		})
	)

	const increaseButton = (
		<button onClick={() => mutate({})}>
			<h1>Increase the number!</h1>
		</button>
	)

	return Mutation.match(mutation, {
		success: (data: any) => (
			<>
				<h1>{data}</h1>
				{increaseButton}
			</>
		),
		loading: () => <h1>Mutating...</h1>,
		_: () => increaseButton,
	})
}
```