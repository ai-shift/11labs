import { config, getEndpointUrl } from '@/lib/config';

interface SessionResponse {
  success: boolean;
  sessionId?: string;
}

interface TopicsResponse {
  success: boolean;
}

interface FlowCommandResponse {
  success: boolean;
}

class ApiClient {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor() {
    this.baseUrl = config.backendEndpoint;
    console.log('ApiClient initialized with baseUrl:', this.baseUrl);
  }

  private async makeRequest(endpoint: string, options: RequestInit) {
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(endpoint, {
      ...options,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    console.log(`${options.method} ${endpoint} response:`, {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      cookies: document.cookie
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Request failed:', {
        status: response.status,
        endpoint,
        error: errorText
      });
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }

    return response;
  }

  async initSession(): Promise<SessionResponse> {
    console.log('Initializing session...');
    try {
      const endpoint = getEndpointUrl('sessions');
      console.log('Session endpoint:', endpoint);

      const response = await this.makeRequest(endpoint, {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Session initialized successfully:', data);

      // Try to get session ID from cookie
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session_id='));
      if (sessionCookie) {
        const sessionId = sessionCookie.split('=')[1];
        this.sessionId = sessionId;
        console.log('Session ID from cookie:', sessionId);
        return { success: true, sessionId };
      }

      return { success: true };
    } catch (error) {
      console.error('Session initialization failed:', error);
      return { success: false };
    }
  }

  async setTopics(text: string): Promise<TopicsResponse> {
    console.log('Setting topics:', { text });
    try {
      if (!this.sessionId) {
        console.log('No session ID found, initializing session...');
        const sessionResponse = await this.initSession();
        if (!sessionResponse.success) {
          throw new Error('Failed to initialize session');
        }
      }

      const endpoint = getEndpointUrl('topics');
      console.log('Topics endpoint:', endpoint);

      const response = await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      console.log('Topics set successfully:', data);
      return { success: true };
    } catch (error) {
      console.error('Failed to set topics:', error);
      return { success: false };
    }
  }

  async sendFlowCommand(text: string): Promise<FlowCommandResponse> {
    console.log('Sending flow command:', { text });
    try {
      if (!this.sessionId) {
        console.log('No session ID found, initializing session...');
        const sessionResponse = await this.initSession();
        if (!sessionResponse.success) {
          throw new Error('Failed to initialize session');
        }
      }

      const endpoint = getEndpointUrl('flowCommands');
      console.log('Flow commands endpoint:', endpoint);

      const response = await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      console.log('Flow command sent successfully:', data);
      return { success: true };
    } catch (error) {
      console.error('Failed to send flow command:', error);
      return { success: false };
    }
  }

  getAudioStreamUrl(): string {
    return getEndpointUrl('radioStreams');
  }
}

export const apiClient = new ApiClient(); 