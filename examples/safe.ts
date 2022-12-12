// import { z } from "../src/index.js"
// import { safeZenum } from "../src/index.js"

// const Mutation = safeZenum({
//     id: z.number(),
//     name: z.string(),
//     content: z.string()
// })

// const RequestBase = z.object({ url: z.string() })
// const Request = safeZenum({
// 	get: RequestBase,
// 	post: RequestBase.merge(z.object({ body: Mutation })),
// })
