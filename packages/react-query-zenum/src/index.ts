import * as rq from "@tanstack/react-query"
import { zenum } from "zenum"

export const Query = zenum<{
	loading: undefined
	error: any
	success: any
	paused: undefined
}>()
export type Query = typeof Query.Item

export function queryToZenum(
	query: rq.UseQueryResult
): [Query, rq.UseQueryResult] {
	let q: Query

	if (query.isLoading) q = Query.loading()
	else if (query.isSuccess) q = Query.success(query.data)
	else if (query.isError) q = Query.error(query.error)

	return [q, query]
}

export const Mutation = zenum<{
	idle: undefined
	loading: undefined
	error: any
	success: any
}>()
export type Mutation = typeof Mutation.Item

export function mutationToZenum(
	mutation: rq.UseMutationResult
): [Mutation, rq.UseMutationResult] {
	let m: Mutation

	if (mutation.isLoading) m = Mutation.loading()
	else if (mutation.isSuccess) m = Mutation.success(mutation.data)
	else if (mutation.isError) m = Mutation.error(mutation.error)
	else if (mutation.isIdle) m = Mutation.idle()

	return [m, mutation]
}
