import { safeZenum, z, ZenumError } from "zenum"
import { printAndAssert } from "./utils/results"

const Mutation = safeZenum({
	id: z.number(),
	name: z.string(),
	content: z.string(),
})

const RequestBase = z.object({ url: z.string() })
const Request = safeZenum({
	get: RequestBase,
	post: RequestBase.merge(z.object({ body: Mutation.zod })),
})

const req1 = Request.get({ url: "/" })
const req2 = Request.post({ url: "/id", body: Mutation.id(1) })
const req3 = Request.post({ url: "/id", body: Mutation.content("Hello!") })
const errReq1 = "This is not an item" as any
const errReq2 = Request.get({} as any)
const errReq3 = (Request as any).put()

const requests = [req1, req2, req3, errReq1, errReq2, errReq3] as unknown[] // Infer the requests as unknwon to simulate the real situation
const results = requests.map(
	(/** This is unknown and untypesafe */ requestNotParsed) => {
		return Request.Result.match(Request.parse(requestNotParsed), {
			success(/** This is now known typesafe */ request) {
				return Request.match(request, {
					get({ url }) {
						return `Requesting url '${url}'`
					},
					post({ url, body }) {
						return `Mutating the ${Mutation.type(
							body
						)} of the url '${url}' with the payload ${Mutation.data(
							body
						)}`
					},
				})
			},
			error(error) {
				return ZenumError.match(error, {
					itemDataIllegal(data) {
						return `The data of the request is illegal. Received '${JSON.stringify(
							data
						)}'.`
					},
					itemTypeIllegal(type$) {
						return `The type of the request is illegal. Received '${type$.toString()}'.`
					},
					notAnItem(item) {
						return `The request is not a legal request. Received '${JSON.stringify(
							item
						)}'`
					},
				})
			},
		})
	}
)

printAndAssert(results, [
	"Requesting url '/'",
	"Mutating the id of the url '/id' with the payload 1",
	"Mutating the content of the url '/id' with the payload Hello!",
	`The request is not a legal request. Received '"This is not an item"'`,
	"The data of the request is illegal. Received '{}'.",
	"The type of the request is illegal. Received 'put'.",
])
