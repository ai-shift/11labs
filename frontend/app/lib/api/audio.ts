import { BACKEND_ENDPOINT } from '@/config';

export class AudioStreamingClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private onStateChange: (state: 'connecting' | 'streaming' | 'stopped' | 'error') => void;

  constructor(onStateChange: (state: 'connecting' | 'streaming' | 'stopped' | 'error') => void) {
    this.onStateChange = onStateChange;
  }

  connect() {
    try {
      // Convert http(s) to ws(s) for WebSocket connection
      const wsUrl = BACKEND_ENDPOINT.replace('https://', 'wss://').replace('http://', 'ws://') + '/radio-streams';
      console.log('Connecting to radio stream:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      this.audioContext = new AudioContext();
      this.onStateChange('connecting');

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.onStateChange('streaming');
      };

      this.ws.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          try {
            const arrayBuffer = await event.data.arrayBuffer();
            await this.playAudioChunk(arrayBuffer);
          } catch (error) {
            console.error('Error processing audio chunk:', error);
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onStateChange('error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.onStateChange('stopped');
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.onStateChange('error');
    }
  }

  private async playAudioChunk(arrayBuffer: ArrayBuffer) {
    if (!this.audioContext) return;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start();
    } catch (error) {
      console.error('Error playing audio chunk:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.onStateChange('stopped');
  }

  sendFlowCommand(command: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text: command }));
    }
  }
} 