import { zenum } from "../src/index.js"

type Data = string
const Response = zenum<{
	success: Data
	error: Error
	loading: never
}>()
type Response = typeof Response.Item

const resSuccess = Response.success("Hello Zenum!")
const resLoading = Response.loading()
const resError = Response.error(new Error("A fetch error occured!"))

const responses = [resSuccess, resLoading, resError]
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

/* results = [
    'Received data: Hello Zenum!',
    'The data is still loading...',
    'An error occured: A fetch error occured!'
] */
console.log(results)
