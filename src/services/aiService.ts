export type AiInsightRequest = {
  topLocation?: {
    name: string;
    state: string;
    score: number;
    level: string;
  };
  criticalCount?: number;
  activeAlertCount?: number;
  prompt?: string;
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getAiInsight(request: AiInsightRequest) {
  const fallbackMessage = buildLocalInsight(request);

  if (!GEMINI_API_KEY) {
    return fallbackMessage;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a landslide monitoring AI assistant. Respond in 2 sentences max. Use this data: top location=${request.topLocation?.name ?? "N/A"}, state=${request.topLocation?.state ?? "N/A"}, score=${request.topLocation?.score ?? 0}, level=${request.topLocation?.level ?? "N/A"}, criticalCount=${request.criticalCount ?? 0}, activeAlerts=${request.activeAlertCount ?? 0}. User question: ${request.prompt ?? "Summarize the current risk."}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return fallbackMessage;
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? fallbackMessage;

    return text.trim() || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
}

function buildLocalInsight(request: AiInsightRequest) {
  const location = request.topLocation;
  const criticalCount = request.criticalCount ?? 0;
  const activeAlertCount = request.activeAlertCount ?? 0;

  if (!location) {
    return "Current monitoring data is stable, but no active risk hotspots are available yet.";
  }

  const areaText = `${location.name} in ${location.state}`;

  return `${areaText} currently shows the highest landslide risk at ${location.score}/100 and is classified as ${location.level.toLowerCase()} risk. There are ${criticalCount} critical sites and ${activeAlertCount} active alerts, so the monitoring team should prioritize inspection and communication in the next cycle.`;
}
