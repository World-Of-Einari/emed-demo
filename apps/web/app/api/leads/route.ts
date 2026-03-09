import { ensureLeadsIndex, getEsClient, LEADS_INDEX } from "@emed/es";

const client = getEsClient();

export async function GET() {
  console.log("[GET /api/leads] Fetching all leads");

  try {
    await ensureLeadsIndex(client);

    const response = await client.search({
      index: LEADS_INDEX,
      sort: [{ createdAt: { order: "desc" } }],
      size: 100,
    });

    const leads = response.hits.hits.map((hit) => hit._source);

    console.log(`[GET /api/leads] Returning ${leads.length} leads`);
    return Response.json(leads);
  } catch (error) {
    console.error("[GET /api/leads] Failed to fetch leads:", error);
    return new Response("Failed to fetch leads", { status: 500 });
  }
}
