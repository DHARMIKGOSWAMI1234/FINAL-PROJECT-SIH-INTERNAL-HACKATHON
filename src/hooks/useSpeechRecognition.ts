import { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageCode } from '../types';

interface UseSpeechRecognitionProps {
  language?: LanguageCode;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export const useSpeechRecognition = ({
  language = 'en',
  onTranscript,
  onError,
}: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const initialTextRef = useRef<string>('');

  // Store latest callbacks in refs to avoid stale closure bugs in event listeners
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const isSupported =
    typeof window !== 'undefined' &&
    !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );

  const getLanguageTag = (lang: LanguageCode): string => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'gu':
        return 'gu-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore if already stopped
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (currentInputText: string = '') => {
      if (!isSupported) {
        const errMessage = 'Speech recognition is not supported by your browser.';
        setError(errMessage);
        onErrorRef.current?.(errMessage);
        return;
      }

      // Cleanup any previous instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getLanguageTag(language);

      initialTextRef.current = currentInputText;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let speechResult = '';
        for (let i = 0; i < event.results.length; i++) {
          speechResult += event.results[i][0].transcript;
        }

        const trimmedSpeech = speechResult.trim();
        const baseText = initialTextRef.current.trim();
        const finalCombined = baseText ? `${baseText} ${trimmedSpeech}` : speechResult;

        if (onTranscriptRef.current) {
          onTranscriptRef.current(finalCombined);
        }
      };

      recognition.onerror = (event: any) => {
        // Silently handle manual stop/abort
        if (event.error === 'aborted') {
          setIsListening(false);
          return;
        }

        let errDesc = 'Speech recognition error occurred.';
        if (event.error === 'not-allowed') {
          errDesc = 'Microphone permission denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'no-speech') {
          errDesc = 'No speech detected. Please try speaking again.';
        } else if (event.error === 'audio-capture') {
          errDesc = 'No microphone detected. Please check your audio input device.';
        } else if (event.error === 'network') {
          errDesc = 'Network error occurred during speech recognition.';
        }

        setError(errDesc);
        setIsListening(false);
        onErrorRef.current?.(errDesc);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err: any) {
        const msg = err?.message || 'Failed to start speech recognition.';
        setError(msg);
        setIsListening(false);
        onErrorRef.current?.(msg);
      }
    },
    [isSupported, language]
  );

  const toggleListening = useCallback(
    (currentInputText: string = '') => {
      if (isListening) {
        stopListening();
      } else {
        startListening(currentInputText);
      }
    },
    [isListening, startListening, stopListening]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
};
