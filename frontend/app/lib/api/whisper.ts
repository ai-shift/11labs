import { useState, useEffect, useRef } from 'react';
import { config } from '../config';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const silenceStartTime = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);

  const SILENCE_THRESHOLD = 15; // Increased threshold for better silence detection
  const SILENCE_DURATION = 3000; // Reduced to 3 seconds for better UX

  const checkForSilence = () => {
    if (!analyser.current || !isRecording) return;
    
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.current.getByteFrequencyData(dataArray);
    
    // Calculate RMS (Root Mean Square) for better volume detection
    const rms = Math.sqrt(
      dataArray.reduce((sum, val) => sum + (val * val), 0) / bufferLength
    );
    
    setVolumeLevel(rms);
    
    if (rms < SILENCE_THRESHOLD) {
      if (!silenceStartTime.current) {
        silenceStartTime.current = Date.now();
      } else if (Date.now() - silenceStartTime.current > SILENCE_DURATION) {
        console.log('Stopping due to silence', { rms, threshold: SILENCE_THRESHOLD });
        stopRecording();
        return;
      }
    } else {
      silenceStartTime.current = null;
    }
    
    animationFrame.current = requestAnimationFrame(checkForSilence);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContext.current?.state !== 'closed') {
        audioContext.current?.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Reset states
      setError(null);
      setTranscript('');
      silenceStartTime.current = null;
      
      // Setup audio analysis
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 2048;
      analyser.current.smoothingTimeConstant = 0.8;
      
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        if (audioChunks.current.length === 0) {
          setError('No audio recorded');
          return;
        }

        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        try {
          const text = await transcribeAudio(audioBlob);
          setTranscript(text);
        } catch (err) {
          setError('Transcription failed');
          console.error('Transcription error:', err);
        } finally {
          // Cleanup
          if (audioContext.current?.state !== 'closed') {
            audioContext.current?.close();
          }
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.current.start(1000);
      setIsRecording(true);
      animationFrame.current = requestAnimationFrame(checkForSilence);
      
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder.current || mediaRecorder.current.state !== 'recording') return;

    try {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      if (audioContext.current?.state !== 'closed') {
        audioContext.current?.close();
      }
      
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording');
    }
  };

  return {
    isRecording,
    transcript,
    error,
    volumeLevel,
    startRecording,
    stopRecording
  };
} 