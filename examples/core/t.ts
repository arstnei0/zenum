import { zenum } from "zenum"
import { printAndAssert } from "../utils/results"

type Data = string
const Response = zenum<{
	success: any
	error: any
	loading: undefined
}>()
type Response = typeof Response.Item

const resSuccess = Response.success("Hello Zenum!")
const resLoading = Response.loading()
const resError = Response.error(new Error("A fetch error occured!"))

const responses = [resSuccess, resLoading, resError] // Gather all the responses generated into an array

responses.forEach((response) =>
	Response.match(response, {
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
)

const results = responses.map((response) =>
	Response.match(response, {
		success(data) {
			return `Received data: ${data}`
		},
		error(error) {
			return `An error occured: ${error.message}`
		},
		loading() {
			return `The data is still loading...`
		},
	})
)

printAndAssert(results, [
	"Received data: Hello Zenum!",
	"The data is still loading...",
	"An error occured: A fetch error occured!",
])

// const query = {
// 	isLoading: false,
// 	isError: false,
// 	error: undefined,
// 	data: "WOW",
// } /** Some query */

// const res = query.isLoading
// 	? Response.loading(null)
// 	: query.isError
// 	? Response.error(query.error)
// 	: Response.success(query.data)