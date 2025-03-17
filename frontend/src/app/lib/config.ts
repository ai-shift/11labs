import { BACKEND_HOST } from "@/config";

export const config = {
  openaiApiKey:
    process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  apiEndpoints: {
    sessions: "/sessions",
    topics: "/topics",
    flowCommands: "/radio-streams/flow-commands",
    radioStreams: "/radio-streams",
  },
} as const;

// Validate required environment variables
if (!config.openaiApiKey) {
  console.error("Missing OpenAI API key in environment variables");
}

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: keyof typeof config.apiEndpoints) => {
  return `${BACKEND_HOST}${config.apiEndpoints[endpoint]}`;
};

// Helper function to get WebSocket URL
export const getWebSocketUrl = () => {
  const wsUrl = BACKEND_HOST.replace(/^http/, "ws");
  return `${wsUrl}${config.apiEndpoints.radioStreams}`;
};
