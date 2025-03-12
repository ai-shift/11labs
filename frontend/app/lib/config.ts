export const config = {
  openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  backendEndpoint: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || process.env.BACKEND_ENDPOINT || 'https://8b0b-77-46-236-187.ngrok-free.app',
  apiEndpoints: {
    sessions: '/sessions',
    topics: '/topics',
    flowCommands: '/radio-streams/flow-commands',
    radioStreams: '/radio-streams'
  }
} as const;

// Validate required environment variables
if (!config.openaiApiKey) {
  console.error('Missing OpenAI API key in environment variables');
}

if (!config.backendEndpoint) {
  console.warn('Missing backend endpoint in environment variables');
}

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: keyof typeof config.apiEndpoints) => {
  return `${config.backendEndpoint}${config.apiEndpoints[endpoint]}`;
};

// Helper function to get WebSocket URL
export const getWebSocketUrl = () => {
  const wsUrl = config.backendEndpoint.replace(/^http/, 'ws');
  return `${wsUrl}${config.apiEndpoints.radioStreams}`;
}; 