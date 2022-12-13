import { useQuery } from "@tanstack/react-query"
import { Query, queryToZenum } from "react-query-zenum"

export default function Home() {
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
