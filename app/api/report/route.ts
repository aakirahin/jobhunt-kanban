import { withAuth } from "@/lib/apiUtils"
import { ReportStats } from "@/lib/reportUtils"
import { NextResponse } from "next/server"

const ARRANGEMENT_LABELS: Record<string, string> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" }

const topEntry = (data: Record<string, number>): string | null => {
    const entries = Object.entries(data)
    if (!entries.length) return null
    return entries.sort((a, b) => b[1] - a[1])[0][0]
}

export const POST = withAuth(async (request) => {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 })

    const stats: ReportStats = await request.json()
    const topArrangement = topEntry(stats.by_work_arrangement)

    const prompt = `You are analyzing someone's job search. Write a 2-3 sentence encouraging, data-driven summary. Be honest but motivating, and end with one concrete suggestion.

Stats:
- Total applications: ${stats.total}
- Response rate: ${Math.round(stats.response_rate * 100)}% (companies that responded)
- Interview rate: ${Math.round(stats.interview_rate * 100)}%
- Offer rate: ${Math.round(stats.offer_rate * 100)}%
${topArrangement ? `- Most applied work arrangement: ${ARRANGEMENT_LABELS[topArrangement] ?? topArrangement}` : ""}`

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "openrouter/free",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			reasoning: { enabled: true },
		}),
		signal: AbortSignal.timeout(60_000), // Abort after 1 minute
	});

    if (!res.ok) return NextResponse.json({ error: "OpenAI request failed" }, { status: 502 })

    const json = await res.json()
    const summary: string = json.choices?.[0]?.message?.content ?? "Unable to generate summary."
    return NextResponse.json({ summary })
})
