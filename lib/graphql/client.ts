interface GraphQLResponse<T> {
  data: T | null
  errors?: Array<{ message: string }>
}

interface GraphQLResult<T> {
  data: T | null
  error: string | null
}

/** Send a GraphQL request through our API proxy */
export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<GraphQLResult<T>> {
  try {
    const response = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as { error?: string } | null
      return { data: null, error: errorBody?.error ?? `Request failed with status ${response.status}` }
    }

    const json = (await response.json()) as GraphQLResponse<T>

    if (json.errors && json.errors.length > 0) {
      return { data: null, error: json.errors[0]?.message ?? "GraphQL error" }
    }

    return { data: json.data, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Unknown error" }
  }
}
