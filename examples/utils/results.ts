function assertResults(a: any[], b: any[]) {
	const success = a.reduce(
		(prev, curr, i) => (prev ? prev : curr === b[i]),
		false
	)
	if (success) console.log(`One assertion passed.`)
	else console.log(`One assertion failed.`)
}

function printResults(results: any) {
	console.log(`The results are: `, results)
}

export function printAndAssert(a: any[], b: any[]) {
	printResults(a)
	assertResults(a, b)
}
