import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Topbar from '../components/Topbar';
import GradientBars from '../components/ui/GradientBars';

export default function Therapy() {
  const [sessionActive, setSessionActive] = useState(false);
  const [mode, setMode] = useState('idle'); // idle | greeting | listening | processing | speaking
  const [transcript, setTranscript] = useState([]); // {role: 'assistant'|'user', text}
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const rafRef = useRef(null);
  const speakIntervalRef = useRef(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sensitivity, setSensitivity] = useState(2.0); // user-adjustable visual gain
  const rollingPeakRef = useRef(0.2);

  const RecognitionCtor = useMemo(() => {
    return typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  }, []);

  useEffect(() => {
    synthRef.current = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }, []);

  const appendTranscript = useCallback((role, text) => {
    setTranscript((prev) => [...prev, { role, text }]);
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    setMode('speaking');
    const utter = new SpeechSynthesisUtterance(text);
    // Simulate speaking level animation
    if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
    let t = 0;
    speakIntervalRef.current = setInterval(() => {
      // simple oscillation between 0.15 and 0.7
      t += 0.15;
      const oscillate = 0.15 + (Math.sin(t) * 0.5 + 0.5) * 0.55;
      setAudioLevel(oscillate);
    }, 80);
    utter.onend = () => {
      if (speakIntervalRef.current) {
        clearInterval(speakIntervalRef.current);
        speakIntervalRef.current = null;
      }
      setAudioLevel(0.05);
      if (sessionActive) {
        setMode('listening');
        startListening();
      } else {
        setMode('idle');
      }
    };
    synthRef.current.cancel();
    synthRef.current.speak(utter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive]);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try { rec.onresult = null; rec.onend = null; rec.onerror = null; } catch (_) {}
      try { rec.stop(); } catch (_) {}
    }
  }, []);

  const startListening = useCallback(() => {
    if (!RecognitionCtor) return;
    stopListening();
    const rec = new RecognitionCtor();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    recognitionRef.current = rec;
    setMode('listening');

    let finalText = '';
    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interim += result[0].transcript;
      }
      // Optional: could show interim somewhere
    };

    rec.onerror = () => {
      if (sessionActive) {
        // Retry listening after small delay
        setTimeout(() => startListening(), 500);
      }
    };

    rec.onend = () => {
      if (!sessionActive) return;
      const text = finalText.trim();
      if (text) {
        appendTranscript('user', text);
        setMode('processing');
        const reply = generateAssistantReply(text);
        appendTranscript('assistant', reply);
        speak(reply);
      } else {
        // Nothing picked up; resume
        setMode('listening');
        startListening();
      }
    };

    try {
      rec.start();
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RecognitionCtor, appendTranscript, speak, stopListening, sessionActive]);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);
        // compute peak and RMS
        let sumSquares = 0;
        let peak = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128; // -1..1
          sumSquares += v * v;
          const av = Math.abs(v);
          if (av > peak) peak = av;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        // maintain a decaying rolling peak for normalization
        const decay = 0.9;
        rollingPeakRef.current = Math.max(peak, rollingPeakRef.current * decay);
        const normBase = rollingPeakRef.current > 0.05 ? rollingPeakRef.current : 0.05;
        // combine rms and peak, normalize by rolling peak, then apply sensitivity
        let level = (rms * 8 + peak * 3) / (normBase * 3 + 0.15);
        level = Math.pow(Math.min(1, Math.max(0, level)), 0.7);
        level = Math.min(1, level * sensitivity);
        // ensure visible baseline while listening
        if (mode === 'listening') level = Math.max(level, 0.1);
        if (mode === 'listening') setAudioLevel(level);
        rafRef.current = requestAnimationFrame(updateLevel);
      };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateLevel);
    } catch (e) {
      // Permission denied or no mic: keep working without levels
      console.warn('Microphone unavailable', e);
    }
  }, [mode]);

  const generateAssistantReply = (userText) => {
    // Simple placeholder logic; can be replaced with real LLM/backend
    if (/hello|hi|hey/i.test(userText)) return "Hi, I'm here with you. What's on your mind today?";
    if (/stress|anx/i.test(userText)) return 'I hear there is some stress. Can you tell me what triggered it?';
    if (/sad|down|upset/i.test(userText)) return 'Thanks for sharing that. What do you think might help right now?';
    return "I understand. Tell me more about how that makes you feel.";
  };

  const handleStart = useCallback(() => {
    setSessionActive(true);
    setTranscript([]);
    setMode('greeting');
    const greeting = 'Hello, I am your therapy assistant. I will listen and respond. When you are ready, start speaking.';
    appendTranscript('assistant', greeting);
    // Ensure mic permission & analyser
    startMic();
    speak(greeting);
  }, [appendTranscript, speak, startMic]);

  const handleStop = useCallback(() => {
    setSessionActive(false);
    stopListening();
    if (synthRef.current) synthRef.current.cancel();
    setMode('idle');
    setAudioLevel(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (_) {}
      audioCtxRef.current = null;
    }
  }, [stopListening]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      setSessionActive(false);
      stopListening();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [stopListening]);

  const barColors = mode === 'speaking'
    ? ['#a855f7', 'transparent'] // purple for speaking
    : ['#06b6d4', 'transparent']; // cyan for idle/listening

  return (
    <main className="relative h-screen">
      <GradientBars bars={28} colors={barColors} level={audioLevel} />
      <div className="relative z-10 px-8 py-6 h-full flex flex-col">
        <Topbar title="Therapy" />
        {/* Top CTA in white area */}
        <div className="w-full flex items-center justify-center mt-6">
          <div className="text-center space-y-2">
            {!sessionActive ? (
              <>
                <h2 className="text-2xl font-semibold">Ready when you are</h2>
                <p className="text-sm opacity-80">Press Start, allow mic, and begin speaking naturally.</p>
                <button onClick={handleStart} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 text-white shadow-sm hover:brightness-110 transition">Start Session</button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">Session in progress</h2>
                <p className="text-sm opacity-80">You can speak any time. Click End to stop.</p>
                <button onClick={handleStop} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 text-white shadow-sm hover:brightness-110 transition">End Session</button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 grid place-items-center">
          <div className="backdrop-blur-md bg-white/50 rounded-3xl shadow-card p-6 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm uppercase tracking-wide">
                <span className={`px-2 py-1 rounded ${mode === 'speaking' ? 'bg-purple-100 text-purple-700' : mode === 'listening' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-700'}`}>
                  {mode}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span>Sensitivity</span>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="text-center mb-2 text-sm opacity-80">Live transcript</div>
            <div className="h-[52vh] overflow-auto rounded-2xl bg-white/70 p-4 space-y-3">
              {transcript.length === 0 && (
                <div className="text-sm opacity-70">No messages yet.</div>
              )}
              {transcript.map((t, i) => (
                <div key={i} className={`flex ${t.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`${t.role === 'assistant' ? 'bg-white border border-black/5 text-gray-800' : 'bg-brand-500 text-white'} px-3 py-2 rounded-2xl max-w-[80%] shadow-sm`}> 
                    <div className="text-[11px] opacity-70 mb-1">{t.role === 'assistant' ? 'Assistant' : 'You'}</div>
                    <div className="text-sm leading-relaxed">{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


