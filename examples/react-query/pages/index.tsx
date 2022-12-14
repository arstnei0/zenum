import Link from "next/link"

export default function Home() {
	return (
		<>
			<Link href="/query">Query example page</Link>
			<Link href="/mutation">Mutation example page</Link>
		</>
	)
}
