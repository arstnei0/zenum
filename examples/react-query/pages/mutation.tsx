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
