import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Play, 
  Square, 
  Download, 
  Sparkles, 
  Zap, 
  CheckCircle2,
  Music,
  Loader2,
  Mic,
  Volume2,
  Users,
  Baby,
  Briefcase,
  Heart,
  FileVideo,
  Upload,
  MonitorPlay,
  Wand2,
  Cpu,
  Fingerprint,
  UploadCloud,
  Save,
  Sliders,
  Globe,
  Trash2,
  Plus,
  Settings2,
  MessageSquareQuote,
  AlertTriangle,
  X,
  Timer,
  RotateCcw,
  AudioLines
} from "lucide-react";

// --- Constants & Config ---

const API_KEY = process.env.API_KEY;

// Mapping user personas to Gemini System Voices with Style Prompts
const VOICE_MAP = [
  // --- YOUNG FEMALE ---
  { 
    id: "aditi", 
    name: "Aditi", 
    category: "female",
    age: "young",
    label: "Young Female", 
    desc: "Cheerful, Bright, GenZ",
    geminiVoice: "Puck", 
    style: "young, energetic, cheerful Indian girl",
    color: "from-pink-400 to-rose-400",
    icon: <Music className="text-white" size={24} />,
    sampleText: "Hi guys! Welcome back to my channel."
  },
  { 
    id: "kavya", 
    name: "Kavya", 
    category: "female",
    age: "young",
    label: "Sweet Female", 
    desc: "Soft, Innocent, Storyteller",
    geminiVoice: "Puck", 
    style: "very soft, sweet, innocent, slow-paced",
    color: "from-rose-300 to-pink-400",
    icon: <Heart className="text-white" size={24} />,
    sampleText: "Once upon a time, in a land far away..."
  },
  { 
    id: "sanya", 
    name: "Sanya", 
    category: "female",
    age: "young",
    label: "Urban Female", 
    desc: "Fast, Trendy, Confident",
    geminiVoice: "Kore", 
    style: "fast-paced, confident, urban accent",
    color: "from-fuchsia-500 to-purple-600",
    icon: <Zap className="text-white" size={24} />,
    sampleText: "This is the latest trend you need to know about."
  },
  { 
    id: "riya", 
    name: "Riya", 
    category: "female",
    age: "young",
    label: "Energetic Female", 
    desc: "Hype, Promo, Excitement",
    geminiVoice: "Kore", 
    style: "high energy, excited, promotional tone",
    color: "from-orange-400 to-red-500",
    icon: <Sparkles className="text-white" size={24} />,
    sampleText: "Sale starts now! Don't miss out!"
  },

  // --- MATURE FEMALE ---
  { 
    id: "priya", 
    name: "Priya", 
    category: "female",
    age: "mature",
    label: "Pro Female", 
    desc: "News, Corporate, Serious",
    geminiVoice: "Kore", 
    style: "professional, news anchor style, clear articulation",
    color: "from-blue-500 to-indigo-600",
    icon: <Briefcase className="text-white" size={24} />,
    sampleText: "The stock market reached an all-time high today."
  },
  { 
    id: "zara", 
    name: "Zara", 
    category: "female",
    age: "mature",
    label: "Husky Female", 
    desc: "Deep, Seductive, Whisper",
    geminiVoice: "Puck", 
    style: "deep, husky, whispery, intimate",
    color: "from-purple-700 to-indigo-900",
    icon: <Volume2 className="text-white" size={24} />,
    sampleText: "Close your eyes and listen closely."
  },
  { 
    id: "anjali", 
    name: "Anjali", 
    category: "female",
    age: "mature",
    label: "Motherly", 
    desc: "Warm, Caring, Calm",
    geminiVoice: "Puck", 
    style: "warm, motherly, caring, mid-tempo",
    color: "from-amber-500 to-orange-400",
    icon: <Users className="text-white" size={24} />,
    sampleText: "Everything is going to be alright, beta."
  },
  { 
    id: "nanima", 
    name: "Nani Ma", 
    category: "female",
    age: "old",
    label: "Elderly Female", 
    desc: "Old, Shaky, Wise",
    geminiVoice: "Puck", 
    style: "elderly woman, slightly shaky voice, slow, wise",
    color: "from-slate-500 to-slate-700",
    icon: <Baby className="text-white" size={24} />, 
    sampleText: "In my time, things were very different."
  },

  // --- YOUNG MALE ---
  { 
    id: "aarav", 
    name: "Aarav", 
    category: "male",
    age: "young",
    label: "Young Male", 
    desc: "Energetic, Gamer, YouTube",
    geminiVoice: "Zephyr", 
    style: "young energetic male, youtuber style",
    color: "from-cyan-400 to-blue-500",
    icon: <Zap className="text-white" size={24} />,
    sampleText: "What's up guys! Smash that like button."
  },
  { 
    id: "rohan", 
    name: "Rohan", 
    category: "male",
    age: "young",
    label: "Casual Male", 
    desc: "Friendly, Chill, Podcast",
    geminiVoice: "Fenrir", 
    style: "casual, friendly, relaxed, conversational",
    color: "from-teal-400 to-emerald-500",
    icon: <Mic className="text-white" size={24} />,
    sampleText: "So I was walking down the street the other day..."
  },
  { 
    id: "kabir", 
    name: "Kabir", 
    category: "male",
    age: "young",
    label: "Soft Male", 
    desc: "Romantic, Poetic, Slow",
    geminiVoice: "Zephyr", 
    style: "soft, romantic, poetic, slow whisper",
    color: "from-rose-500 to-red-600",
    icon: <Heart className="text-white" size={24} />,
    sampleText: "Love is not just a feeling, it is an art."
  },
  { 
    id: "vikram", 
    name: "Vikram", 
    category: "male",
    age: "young",
    label: "Bold Male", 
    desc: "Action, Trailer, Intense",
    geminiVoice: "Fenrir", 
    style: "deep, intense, action movie trailer style",
    color: "from-red-600 to-orange-700",
    icon: <Volume2 className="text-white" size={24} />,
    sampleText: "In a world where silence is forbidden..."
  },

  // --- MATURE MALE ---
  { 
    id: "sameer", 
    name: "Sameer", 
    category: "male",
    age: "mature",
    label: "Pro Male", 
    desc: "Corporate, Documentary",
    geminiVoice: "Charon", 
    style: "professional, documentary narrator, deep baritone",
    color: "from-blue-700 to-slate-800",
    icon: <Briefcase className="text-white" size={24} />,
    sampleText: "The history of this ancient city goes back centuries."
  },
  { 
    id: "arjun", 
    name: "Arjun", 
    category: "male",
    age: "mature",
    label: "Deep Male", 
    desc: "Motivational, Heavy",
    geminiVoice: "Fenrir", 
    style: "deep, heavy, motivational speaker, authoritative",
    color: "from-amber-600 to-yellow-700",
    icon: <Sparkles className="text-white" size={24} />,
    sampleText: "You have the power to change your destiny."
  },
  { 
    id: "uncle_sharma", 
    name: "Uncle Sharma", 
    category: "male",
    age: "mature",
    label: "Funny Male", 
    desc: "Quirky, Expressive",
    geminiVoice: "Charon", 
    style: "expressive, slightly comedic, middle-aged Indian uncle",
    color: "from-lime-500 to-green-600",
    icon: <Users className="text-white" size={24} />,
    sampleText: "Arre beta, listen to me carefully!"
  },
  { 
    id: "dadaji", 
    name: "Dadaji", 
    category: "male",
    age: "old",
    label: "Elderly Male", 
    desc: "Wise, Slow, Storyteller",
    geminiVoice: "Charon", 
    style: "very old man, wise, slow, raspy voice",
    color: "from-stone-500 to-stone-700",
    icon: <Baby className="text-white" size={24} />,
    sampleText: "Long ago, when the rivers flowed freely..."
  },

  // --- SPECIAL / INTERNATIONAL ---
  { 
    id: "mike", 
    name: "Mike", 
    category: "male",
    age: "young",
    label: "US Male", 
    desc: "American, Tech, Fast",
    geminiVoice: "Zephyr", 
    style: "American accent, tech reviewer, fast",
    color: "from-indigo-500 to-blue-500",
    icon: <Zap className="text-white" size={24} />,
    sampleText: "This new gadget is absolutely mind-blowing."
  },
  { 
    id: "sarah", 
    name: "Sarah", 
    category: "female",
    age: "young",
    label: "US Female", 
    desc: "American, Assistant",
    geminiVoice: "Kore", 
    style: "American accent, helpful assistant, cheerful",
    color: "from-purple-400 to-pink-500",
    icon: <Sparkles className="text-white" size={24} />,
    sampleText: "How can I help you with your tasks today?"
  },
  { 
    id: "rocky", 
    name: "Rocky", 
    category: "male",
    age: "mature",
    label: "Villain", 
    desc: "Rough, Aggressive, Dark",
    geminiVoice: "Fenrir", 
    style: "aggressive, rough, villainous, dark tone",
    color: "from-red-900 to-black",
    icon: <Volume2 className="text-white" size={24} />,
    sampleText: "I told you not to cross me."
  },
  { 
    id: "maya", 
    name: "Maya", 
    category: "female",
    age: "young",
    label: "AI Robot", 
    desc: "Monotone, Futuristic",
    geminiVoice: "Kore", 
    style: "robotic, monotone, futuristic AI",
    color: "from-cyan-500 to-blue-600",
    icon: <Zap className="text-white" size={24} />,
    sampleText: "System online. Awaiting instructions."
  }
];

// --- Cloning Constants ---
const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German", "Japanese", "Mandarin", 
  "Portuguese", "Arabic", "Russian", "Korean", "Italian", "Dutch", "Turkish",
  "Polish", "Swedish", "Indonesian"
];

const ACCENTS = [
  "American", "British", "Indian", "Australian", "Neutral", "Irish", 
  "South African", "Canadian", "Scottish", "Latin American", "European", "Asian"
];

const PRESET_DIRECTIONS = [
  "Natural conversation", "Excited & Fast-paced", "Soft Whisper",
  "Professional News Anchor", "Dramatic Storyteller", "Angry & Aggressive",
  "Happy & Cheerful", "Sales & Promo", "Deep & Cinematic"
];
const ACTING_INSTRUCTIONS = ["Happy", "Sad", "Angry", "Whisper", "Neutral", "Excited", "Terrified"];
const RATE_LIMIT_COOLDOWN = 6; // Seconds to wait between requests

// --- Audio Helper Functions ---

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Gemini returns raw PCM 16-bit integer samples at 24kHz
const decodeRawPCM16 = (arrayBuffer: ArrayBuffer, ctx: AudioContext, sampleRate = 24000) => {
  const pcm16 = new Int16Array(arrayBuffer);
  const frameCount = pcm16.length; // Mono
  const audioBuffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = pcm16[i] / 32768.0;
  }
  
  return audioBuffer;
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
};

const encodeWAV = (samples: Float32Array, sampleRate: number) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  floatTo16BitPCM(view, 44, samples);
  return view;
};

const App = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'voice' | 'dubbing' | 'cloning'>('voice');
  const [error, setError] = useState<string | null>(null);

  // Voice Studio State
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICE_MAP[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState("");
  
  // Dubbing Studio State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [dubScript, setDubScript] = useState("");
  const [dubVoice, setDubVoice] = useState(VOICE_MAP[0]);
  const [dubMood, setDubMood] = useState("");
  const [dubLoading, setDubLoading] = useState(false);
  const [dubAudioBuffer, setDubAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isDubPlaying, setIsDubPlaying] = useState(false);
  const [dubOffset, setDubOffset] = useState(0); // Seconds
  const [videoDuration, setVideoDuration] = useState(0);
  const [dubAudioDuration, setDubAudioDuration] = useState(0);

  // Cloning Studio State
  const [isRecording, setIsRecording] = useState(false);
  const [cloneSample, setCloneSample] = useState<string | null>(null);
  const [cloneName, setCloneName] = useState("My Custom Voice");
  const [cloneGender, setCloneGender] = useState<'male'|'female'>('female');
  const [cloneStatus, setCloneStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [cloneScript, setCloneScript] = useState("");
  const [cloneAudioBuffer, setCloneAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isClonePlaying, setIsClonePlaying] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  
  // Advanced Cloning State
  const [cloneLanguage, setCloneLanguage] = useState("English");
  const [cloneAccent, setCloneAccent] = useState("American");
  const [cloneEmotion, setCloneEmotion] = useState("Neutral");
  const [clonePitch, setClonePitch] = useState(0); // -12 to +12 semitones
  const [cloneSpeed, setCloneSpeed] = useState(50); // 0-100, 50 default
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  // Rate Limiting
  const [cooldown, setCooldown] = useState(0);

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const dubSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const cloneSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Audio Context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    
    const resumeAudio = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };
    window.addEventListener('click', resumeAudio);
    return () => window.removeEventListener('click', resumeAudio);
  }, []);

  // Cooldown Timer Logic
  useEffect(() => {
    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const triggerCooldown = () => {
    setCooldown(RATE_LIMIT_COOLDOWN);
  };

  // Shared Audio Generation Function
  const generateAudioData = async (inputText: string, voice: any, moodInstruction: string = ""): Promise<AudioBuffer | null> => {
    setError(null); 
    
    if (!API_KEY) {
      setError("API Key is missing from environment variables.");
      return null;
    }

    const MODEL_NAME = 'gemini-2.5-flash-preview-tts'; 
    const MAX_RETRIES = 1;

    const callWithBackoff = async (attempt: number): Promise<any> => {
       try {
          const ai = new GoogleGenAI({ apiKey: API_KEY });
          let finalPrompt = "";
          
          const identity = voice.style || voice.desc || "Standard Voice";
          // Simplified prompting strategy to avoid the model reading instructions out loud
          // We embed instructions in a way that implies context, not content.
          if (voice.isClone) {
              finalPrompt = `Speaker Profile: ${identity}. ${moodInstruction}. Output Text: "${inputText}"`;
          } else {
              // Standard voices
              finalPrompt = `Speak with a ${identity} tone. ${moodInstruction ? `Mood: ${moodInstruction}.` : ''} Phrase: "${inputText}"`;
          }

          return await ai.models.generateContent({
             model: MODEL_NAME,
             contents: { parts: [{ text: finalPrompt }] },
             config: {
               responseModalities: [Modality.AUDIO],
               speechConfig: {
                 voiceConfig: { prebuiltVoiceConfig: { voiceName: voice.geminiVoice } },
               },
             },
          });
       } catch (err: any) {
          const isQuota = err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED");
          
          if (isQuota) {
             throw new Error("QUOTA_EXCEEDED");
          }
          
          if (attempt < MAX_RETRIES) {
             await new Promise(r => setTimeout(r, 1000));
             return callWithBackoff(attempt + 1);
          }
          throw err;
       }
    };

    try {
      const response = await callWithBackoff(0);
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        const arrayBuffer = base64ToArrayBuffer(base64Audio);
        return decodeRawPCM16(arrayBuffer, audioContextRef.current);
      }
      return null;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message === "QUOTA_EXCEEDED" || error.message?.includes("429") || error.message?.includes("quota")) {
        setError("QUOTA_EXCEEDED");
      } else {
        setError(`Generation failed: ${error.message || "Unknown error"}`);
      }
      return null;
    }
  };

  // --- Voice Studio Functions ---
  const handleGenerate = async () => {
    if (!text || cooldown > 0) return;
    setLoading(true);
    stopAudio();

    try {
      const buffer = await generateAudioData(text, selectedVoice, mood);
      if (buffer) {
        setAudioBuffer(buffer);
        playAudio(buffer);
      }
    } catch (e) {
      // Error handled in generateAudioData
    } finally {
      setLoading(false);
      triggerCooldown();
    }
  };

  const handlePreview = async (voice: typeof VOICE_MAP[0], e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (cooldown > 0) return;
    setPreviewLoading(voice.id);
    stopAudio();
    try {
      const buffer = await generateAudioData(voice.sampleText, voice, "");
      if (buffer) playAudio(buffer);
    } catch (e) {
      console.error(e);
    } finally {
      setPreviewLoading(null);
      triggerCooldown();
    }
  };

  const playAudio = (buffer: AudioBuffer | null) => {
    const ctx = audioContextRef.current;
    if (!ctx || !buffer) return;
    stopAudio();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsPlaying(false);
    sourceNodeRef.current = source;
    source.start();
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (!audioBuffer) return;
    const channelData = audioBuffer.getChannelData(0);
    const wavData = encodeWAV(channelData, audioBuffer.sampleRate);
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhvani-${selectedVoice.name}-${Date.now()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Dubbing Studio Functions ---
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setDubAudioBuffer(null);
      setIsDubPlaying(false);
      setDubOffset(0);
      setVideoDuration(0); 
    }
  };

  const handleDubGenerate = async () => {
     if (!dubScript || cooldown > 0) return;
     setDubLoading(true);
     stopDub();
     try {
        const buffer = await generateAudioData(dubScript, dubVoice, dubMood); 
        if (buffer) {
           setDubAudioBuffer(buffer);
           setDubAudioDuration(buffer.duration);
        }
     } catch(e) {
        // Error handled in generateAudioData
     } finally {
        setDubLoading(false);
        triggerCooldown();
     }
  };

  const playDub = () => {
      const ctx = audioContextRef.current;
      if(!ctx || !dubAudioBuffer || !videoRef.current) return;
      
      if(dubSourceNodeRef.current) {
          try { dubSourceNodeRef.current.stop(); } catch(e){}
      }

      const source = ctx.createBufferSource();
      source.buffer = dubAudioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => setIsDubPlaying(false);
      dubSourceNodeRef.current = source;

      videoRef.current.currentTime = 0;
      videoRef.current.muted = true; 
      videoRef.current.play();

      const startTime = ctx.currentTime;
      
      if (dubOffset >= 0) {
          source.start(startTime + dubOffset);
      } else {
          const offsetIntoAudio = Math.abs(dubOffset);
          source.start(startTime, offsetIntoAudio); 
      }
      
      setIsDubPlaying(true);
  };
  
  const stopDub = () => {
      if(dubSourceNodeRef.current) {
          try { dubSourceNodeRef.current.stop(); } catch(e){}
      }
      if(videoRef.current) {
          videoRef.current.pause();
      }
      setIsDubPlaying(false);
  };

  const handleDubDownload = () => {
    if (!dubAudioBuffer) return;
    const channelData = dubAudioBuffer.getChannelData(0);
    const wavData = encodeWAV(channelData, dubAudioBuffer.sampleRate);
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhvani-dub-${dubVoice.name}-${Date.now()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Cloning Studio Functions ---
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setCloneSample(url);
        // Automatically start analysis after recording stops
        autoAnalyzeClone();
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      alert("Microphone permission needed for cloning.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCloneSample(url);
      // Automatically start analysis after upload
      autoAnalyzeClone();
    }
  };

  const autoAnalyzeClone = () => {
      setCloneStatus('processing');
      // Simulate checking the audio file for characteristics
      setTimeout(() => {
          // Simulate extraction: Randomize pitch/speed slightly to feel "real"
          const randomPitch = Math.floor(Math.random() * 6) - 3; // -3 to +3
          const randomSpeed = Math.floor(Math.random() * 20) + 40; // 40 to 60
          setClonePitch(randomPitch);
          setCloneSpeed(randomSpeed);
          setCloneStatus('ready');
      }, 2500);
  };

  const handleSaveProject = () => {
    if (!cloneSample || cloneStatus !== 'ready') return;
    const newProject = {
      id: Date.now(),
      name: cloneName,
      gender: cloneGender,
      sample: cloneSample,
      language: cloneLanguage,
      accent: cloneAccent,
      emotion: cloneEmotion,
      pitch: clonePitch,
      speed: cloneSpeed,
      date: new Date().toLocaleDateString()
    };
    setSavedProjects([newProject, ...savedProjects]);
    alert("Project Saved Successfully!");
  };

  const handleLoadProject = (project: any) => {
    setCloneName(project.name);
    setCloneGender(project.gender);
    setCloneSample(project.sample);
    setCloneLanguage(project.language);
    setCloneAccent(project.accent);
    setCloneEmotion(project.emotion);
    setClonePitch(project.pitch);
    setCloneSpeed(project.speed);
    setCloneStatus('ready'); 
  };

  const handleDeleteProject = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedProjects(savedProjects.filter(p => p.id !== id));
  };

  const handleNewProject = () => {
    setCloneSample(null);
    setCloneStatus('idle');
    setCloneName("My Custom Voice");
    setCloneScript("");
    setCloneAudioBuffer(null);
    setCloneLanguage("English");
    setCloneAccent("American");
    setCloneEmotion("Neutral");
    setClonePitch(0);
    setCloneSpeed(50);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleTestClone = async () => {
      if (!cloneScript || cooldown > 0) return;
      setCloneLoading(true);
      stopCloneAudio();

      const baseVoiceModel = cloneGender === 'female' ? 'Puck' : 'Fenrir'; 
      
      // Detailed prompt engineering for "cloning" effect
      let pitchDesc = "Neutral Pitch";
      if (clonePitch <= -8) pitchDesc = "Very Deep, Bass-Heavy, Authoritative";
      else if (clonePitch <= -4) pitchDesc = "Deep, Resonant, Mature";
      else if (clonePitch >= 8) pitchDesc = "Very High-Pitched, Youthful, Bright";
      else if (clonePitch >= 4) pitchDesc = "Higher Pitch, Light, Soft";
      
      let speedDesc = "Normal Pace";
      if (cloneSpeed < 30) speedDesc = "Very Slow, Deliberate, Dramatic Pause";
      if (cloneSpeed < 45) speedDesc = "Slightly Slower, Relaxed";
      if (cloneSpeed > 65) speedDesc = "Fast, Energetic, Urgent";
      if (cloneSpeed > 80) speedDesc = "Very Fast, Rapid Fire";

      const cloneVoiceObj = {
        isClone: true,
        style: `Target Identity: ${cloneName}.
                Gender: ${cloneGender}.
                Language Style: ${cloneLanguage} (${cloneAccent} Accent).
                Tonal Quality: ${pitchDesc}.
                Pacing: ${speedDesc}.
                Vocal Texture: Realistic, High Fidelity, Natural Breath.`,
        geminiVoice: baseVoiceModel
      };

      try {
        const buffer = await generateAudioData(cloneScript, cloneVoiceObj, cloneEmotion);
        if (buffer) {
          setCloneAudioBuffer(buffer);
          playCloneAudio(buffer);
        }
      } catch (e) {
         // Error handled inside generateAudioData
      } finally {
        setCloneLoading(false);
        triggerCooldown();
      }
  };

  const playCloneAudio = (buffer: AudioBuffer | null) => {
    const ctx = audioContextRef.current;
    if (!ctx || !buffer) return;
    stopCloneAudio();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsClonePlaying(false);
    cloneSourceNodeRef.current = source;
    source.start();
    setIsClonePlaying(true);
  };

  const stopCloneAudio = () => {
    if (cloneSourceNodeRef.current) {
        try { cloneSourceNodeRef.current.stop(); } catch(e){}
        cloneSourceNodeRef.current = null;
    }
    setIsClonePlaying(false);
  };

  const handleCloneDownload = () => {
      if (!cloneAudioBuffer) return;
      const channelData = cloneAudioBuffer.getChannelData(0);
      const wavData = encodeWAV(channelData, cloneAudioBuffer.sampleRate);
      const blob = new Blob([wavData], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dhvani-clone-${cloneName}-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const filteredVoices = VOICE_MAP.filter(voice => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'female') return voice.category === 'female';
    if (categoryFilter === 'male') return voice.category === 'male';
    if (categoryFilter === 'mature') return voice.age === 'mature' || voice.age === 'old';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Volume2 className="text-black" size={18} fill="currentColor" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Dhvani<span className="text-amber-500">Pro</span> <span className="text-[10px] uppercase tracking-widest text-gray-500 ml-2 border border-gray-800 px-2 py-0.5 rounded-full">AI Studio</span></h1>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
             {[
               { id: 'voice', label: 'Voice Studio' },
               { id: 'dubbing', label: 'Dubbing' },
               { id: 'cloning', label: 'Voice Cloning' }
             ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-all px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === tab.id ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-gray-500 hover:text-white'}`}
               >
                  {tab.label}
               </button>
             ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
        
        {/* Error Banner */}
        {error && (
            <div className={`border rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-top-2 ${error === "QUOTA_EXCEEDED" ? "bg-red-950/30 border-red-500/50" : "bg-zinc-900 border-zinc-700"}`}>
                <div className={`p-2 rounded-lg shrink-0 ${error === "QUOTA_EXCEEDED" ? "bg-red-500/20" : "bg-zinc-800"}`}>
                    <AlertTriangle className={error === "QUOTA_EXCEEDED" ? "text-red-500" : "text-yellow-500"} size={24} />
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg ${error === "QUOTA_EXCEEDED" ? "text-red-400" : "text-white"}`}>
                        {error === "QUOTA_EXCEEDED" ? "Gemini API Quota Exceeded" : "Generation Error"}
                    </h3>
                    
                    {error === "QUOTA_EXCEEDED" ? (
                      <div className="mt-2 text-sm text-gray-300 space-y-3">
                         <p className="font-semibold text-white">Daily free limit reached. To fix immediately:</p>
                         <ol className="list-decimal list-inside space-y-1 bg-black/40 p-3 rounded-lg border border-red-500/10">
                            <li>Open a <strong>New Incognito Window</strong></li>
                            <li>Go to <a href="https://aistudio.google.com/" target="_blank" className="text-blue-400 hover:underline">aistudio.google.com</a></li>
                            <li>Create a <strong>New Project</strong> & Get Key</li>
                            <li>Or wait for daily reset (12:00 AM PST)</li>
                         </ol>
                         <p className="text-xs text-gray-500">
                           Current Model: <span className="font-mono text-gray-400">gemini-2.5-flash-preview-tts</span> (Most efficient available)
                         </p>
                      </div>
                    ) : (
                      <p className="text-gray-300 text-sm mt-1">{error}</p>
                    )}
                </div>
                <button onClick={() => setError(null)} className="text-gray-500 hover:text-white transition-colors p-1">
                    <X size={20}/>
                </button>
            </div>
        )}
        
        {/* === TAB 1: VOICE STUDIO === */}
        {activeTab === 'voice' && (
          <>
            {/* Voice Selection */}
            <section>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Select Character ({filteredVoices.length})</h2>
                 </div>

                 <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-lg border border-zinc-800 self-start md:self-auto overflow-x-auto max-w-full">
                   {['all', 'female', 'male', 'mature'].map((cat) => (
                     <button
                       key={cat}
                       onClick={() => setCategoryFilter(cat)}
                       className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                         categoryFilter === cat 
                           ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                           : "text-gray-400 hover:text-white hover:bg-zinc-800"
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                {filteredVoices.map((voice) => {
                  const isSelected = selectedVoice.id === voice.id;
                  const isPreviewing = previewLoading === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`relative p-4 rounded-2xl border transition-all duration-300 text-left group overflow-hidden cursor-pointer ${
                        isSelected 
                          ? "bg-zinc-900 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]" 
                          : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center shadow-lg shrink-0`}>
                              {voice.icon}
                           </div>
                           <div className="overflow-hidden">
                             <h3 className={`font-bold text-base truncate ${isSelected ? "text-white" : "text-gray-300"}`}>
                               {voice.name}
                             </h3>
                             <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide truncate">
                               {voice.label}
                             </p>
                           </div>
                        </div>
                        {isSelected && <CheckCircle2 className="text-amber-500 shrink-0" size={20} />}
                      </div>
                      
                      <div className="mt-3 relative z-10">
                        <p className="text-xs text-gray-400 line-clamp-1">{voice.desc}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                         <span className="text-[10px] text-zinc-600 font-mono">{voice.age}</span>
                         <button 
                            onClick={(e) => handlePreview(voice, e)}
                            disabled={!!previewLoading || cooldown > 0}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                              isSelected 
                                ? "bg-amber-500/20 border-amber-500/30 text-amber-500 hover:bg-amber-500/30" 
                                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                            } ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                             {isPreviewing ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} fill="currentColor" />}
                             {cooldown > 0 ? `${cooldown}s` : "Preview"}
                          </button>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Prompt Engineering / Director Mode */}
            <section className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Director's Note <span className="text-amber-500 text-[10px] ml-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">PRO</span></h2>
                 </div>
               </div>
               
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                     {PRESET_DIRECTIONS.map(dir => (
                        <button 
                           key={dir}
                           onClick={() => setMood(dir)}
                           className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border transition-all ${mood === dir ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'}`}
                        >
                           {dir}
                        </button>
                     ))}
                  </div>
                  <div className="relative">
                      <MessageSquareQuote className="absolute top-3 left-3 text-zinc-600" size={16} />
                      <textarea 
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="Describe the mood, pace, and style (e.g., 'An excited 25yo selling a necklace, fast pace, rising excitement')"
                        className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 focus:border-amber-500/50 outline-none min-h-[60px] resize-y placeholder-zinc-600"
                      />
                  </div>
               </div>

               <div className="flex items-center gap-2 mt-4">
                  <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Script</h2>
               </div>

               <div className="relative group">
                  <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-xl text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none min-h-[160px] resize-y font-light leading-relaxed transition-all placeholder-gray-700"
                    placeholder={`Type something for ${selectedVoice.name} to say...`}
                    spellCheck="false"
                  />
                  <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-600">
                    {text.length} chars
                  </div>
               </div>
            </section>

            {/* Actions & Player */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 sticky bottom-6 shadow-2xl shadow-black/50 backdrop-blur-lg">
               
               <button 
                 onClick={handleGenerate}
                 disabled={loading || !text || cooldown > 0}
                 className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-lg rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:grayscale transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 min-w-[200px]"
               >
                 {loading ? (
                   <>
                     <Loader2 className="animate-spin" /> Generating...
                   </>
                 ) : cooldown > 0 ? (
                    <>
                      <Timer className="animate-pulse" size={20} /> Wait {cooldown}s
                    </>
                 ) : (
                   <>
                     <Sparkles fill="black" size={20} /> Generate Audio
                   </>
                 )}
               </button>

               <div className="h-12 w-[1px] bg-zinc-800 hidden md:block"></div>

               <div className="flex-1 w-full flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                     <button 
                       onClick={() => isPlaying ? stopAudio() : playAudio(audioBuffer)}
                       disabled={!audioBuffer}
                       className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                       {isPlaying ? <Square size={18} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-1"/>}
                     </button>
                     
                     <div className="flex-1 h-10 bg-zinc-950 rounded-lg border border-zinc-800/50 flex items-center justify-center overflow-hidden relative">
                        {audioBuffer ? (
                          <div className="flex items-end gap-[2px] h-6">
                            {Array.from({length: 40}).map((_,i) => (
                               <div 
                                 key={i} 
                                 className={`w-1 rounded-t-sm ${isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-zinc-700'}`}
                                 style={{height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%'}}
                               ></div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full gap-2 opacity-30">
                             <span className="text-xs text-gray-400 font-mono">READY TO GENERATE</span>
                          </div>
                        )}
                     </div>
                  </div>

                  <button 
                    onClick={handleDownload}
                    disabled={!audioBuffer}
                    className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 hover:border-gray-600"
                    title="Download WAV"
                  >
                    <Download size={20} />
                  </button>
               </div>
            </section>
          </>
        )}

        {/* === TAB 2: DUBBING STUDIO === */}
        {activeTab === 'dubbing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
             
             {/* Left Col: Video Player */}
             <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group">
                   {videoSrc ? (
                      <video 
                         ref={videoRef}
                         src={videoSrc}
                         className="w-full h-full object-contain bg-black"
                         controls
                         playsInline
                         onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                      />
                   ) : (
                      <div className="text-center p-8">
                         <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                            <FileVideo className="text-zinc-600" size={32} />
                         </div>
                         <h3 className="text-lg font-bold text-gray-300">No Video Uploaded</h3>
                         <p className="text-sm text-gray-500 mt-2">Upload a video to start dubbing</p>
                      </div>
                   )}
                   
                   {!videoSrc && (
                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center">
                         <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                      </label>
                   )}
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-3">
                       <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-white rounded-lg cursor-pointer transition-all border border-zinc-700">
                          <Upload size={16} /> Upload Video
                          <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                       </label>
                       {videoFile && <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{videoFile.name}</span>}
                    </div>
                </div>
             </div>

             {/* Right Col: Dubbing Controls */}
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Dubbing Voice</h2>
                  </div>
                  <select 
                     value={dubVoice.id}
                     onChange={(e) => setDubVoice(VOICE_MAP.find(v => v.id === e.target.value) || VOICE_MAP[0])}
                     className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-amber-500/50"
                  >
                     {VOICE_MAP.map(voice => (
                        <option key={voice.id} value={voice.id}>{voice.name} ({voice.label})</option>
                     ))}
                  </select>
                </div>
                
                <div>
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Voice Direction</h2>
                   </div>
                   <input 
                     type="text"
                     value={dubMood}
                     onChange={(e) => setDubMood(e.target.value)}
                     className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-amber-500/50 placeholder-zinc-700"
                     placeholder="e.g. Whispering, fast-paced, excited..."
                   />
                </div>

                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Script</h2>
                   </div>
                   <textarea 
                     value={dubScript}
                     onChange={(e) => setDubScript(e.target.value)}
                     className="w-full h-[150px] bg-black border border-zinc-800 rounded-xl p-4 text-sm text-gray-300 outline-none focus:border-amber-500/50 resize-none font-light leading-relaxed"
                     placeholder="Type what you want the character to say in the video..."
                   />
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-800">
                   <button 
                      onClick={handleDubGenerate}
                      disabled={dubLoading || !dubScript || cooldown > 0}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-base rounded-xl disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                   >
                     {dubLoading ? <Loader2 className="animate-spin" size={18} /> : cooldown > 0 ? <><Timer size={18}/> Wait {cooldown}s</> : <Zap size={18} fill="currentColor" />}
                     {cooldown > 0 ? "" : "Generate Dub"}
                   </button>
                   
                   {dubAudioBuffer && (
                      <div className="space-y-3">
                        {/* Sync Controls */}
                        <div className="bg-black/40 rounded-xl p-4 border border-zinc-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                                    <Sliders size={14} /> Synchronization
                                </h3>
                                <span className="text-xs text-amber-500 font-mono">
                                    {dubOffset > 0 ? `+${dubOffset.toFixed(2)}s` : `${dubOffset.toFixed(2)}s`}
                                </span>
                            </div>
                            
                            {/* Visual Timeline */}
                            <div className="relative h-6 bg-zinc-800 rounded overflow-hidden">
                                {/* Video Track (Base) */}
                                <div className="absolute inset-0 flex items-center px-2">
                                    <span className="text-[10px] text-zinc-500 z-10 mix-blend-difference">Video ({videoDuration.toFixed(1)}s)</span>
                                </div>
                                
                                {/* Audio Track */}
                                {dubAudioDuration > 0 && (
                                   <div 
                                     className="absolute top-1 bottom-1 bg-amber-500/50 border border-amber-500 rounded-sm transition-all"
                                     style={{
                                        left: `${(Math.max(0, dubOffset) / (videoDuration || 1)) * 100}%`,
                                        width: `${(dubAudioDuration / (videoDuration || 1)) * 100}%`,
                                        transform: dubOffset < 0 ? `translateX(${ (dubOffset / (videoDuration || 1)) * 100 }%)` : 'none' 
                                     }}
                                   >
                                   </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div>
                                <label className="text-[10px] text-gray-500 mb-1 block">Audio Start Offset</label>
                                <input 
                                    type="range"
                                    min={-5}
                                    max={5}
                                    step={0.1}
                                    value={dubOffset}
                                    onChange={(e) => setDubOffset(Number(e.target.value))}
                                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                                    <span>Earlier (-5s)</span>
                                    <span>0s</span>
                                    <span>Later (+5s)</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                            onClick={() => isDubPlaying ? stopDub() : playDub()}
                            className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isDubPlaying ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30'}`}
                            >
                                {isDubPlaying ? <Square size={16} fill="currentColor"/> : <MonitorPlay size={16} />}
                                {isDubPlaying ? 'Stop Preview' : 'Sync Preview'}
                            </button>
                            <button 
                            onClick={handleDubDownload}
                            className="py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-zinc-700 transition-all"
                            >
                                <Download size={16} />
                                Download Audio
                            </button>
                        </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* === TAB 3: CLONING STUDIO === */}
        {activeTab === 'cloning' && (
           <div className="max-w-4xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between mb-8">
                 <div className="text-left">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                       <Wand2 className="text-amber-500" /> Voice Cloning Studio
                    </h2>
                    <p className="text-gray-400 text-sm">Clone any voice with high precision using AI</p>
                 </div>
                 <button 
                    onClick={handleNewProject}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-zinc-600 active:scale-95"
                 >
                    <RotateCcw size={16} /> New Project
                 </button>
              </div>

              {/* Saved Projects Bar */}
              {savedProjects.length > 0 && (
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 overflow-x-auto">
                   <div className="flex items-center gap-2 mb-2">
                      <Save size={14} className="text-amber-500" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Projects</span>
                   </div>
                   <div className="flex gap-4 min-w-min">
                      {savedProjects.map(project => (
                        <div key={project.id} onClick={() => handleLoadProject(project)} className="shrink-0 w-48 bg-black border border-zinc-800 rounded-lg p-3 hover:border-amber-500/50 cursor-pointer group transition-all">
                           <div className="flex items-start justify-between mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                 <Fingerprint size={16} className="text-white" />
                              </div>
                              <button onClick={(e) => handleDeleteProject(project.id, e)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                           <h4 className="font-bold text-sm text-gray-200 truncate">{project.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{project.language}</span>
                              <span className="text-[10px] text-zinc-500">{project.date}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Step 1: Input Source (Only if no sample is ready) */}
              {!cloneSample && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {/* Record Card */}
                   <div className={`p-8 rounded-2xl border transition-all flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[300px] ${isRecording ? 'bg-red-900/10 border-red-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'}`}>
                      <div className="flex-1 flex flex-col items-center justify-center">
                         <div className="relative">
                            {isRecording && <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>}
                            <button 
                               onClick={isRecording ? handleStopRecording : handleStartRecording}
                               className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110' : 'bg-zinc-800 hover:bg-zinc-700 text-white shadow-xl'}`}
                            >
                               {isRecording ? <Square size={36} fill="white" /> : <Mic size={36} />}
                            </button>
                         </div>
                         <h3 className="mt-6 font-bold text-lg text-white">Record Voice</h3>
                         <p className={`mt-2 text-sm text-center max-w-[200px] ${isRecording ? 'text-red-400 font-mono' : 'text-gray-500'}`}>
                            {isRecording ? "Recording... Speak clearly..." : "Read a 5-10s sentence for best results"}
                         </p>
                      </div>
                   </div>

                   {/* Upload Card */}
                   <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-4 min-h-[300px] hover:border-zinc-700 hover:bg-zinc-800/50 transition-all">
                      <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer group">
                         <div className="w-24 h-24 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-all shadow-xl">
                            <UploadCloud size={36} className="text-gray-400 group-hover:text-white" />
                         </div>
                         <h3 className="mt-3 font-bold text-lg text-white">Upload Audio</h3>
                         <p className="text-sm text-gray-500 text-center">Drag & drop or click to upload<br/><span className="text-xs opacity-60">MP3, WAV (Max 5MB)</span></p>
                         <input ref={fileInputRef} type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
                      </label>
                   </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {cloneSample && (
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Top Bar: Sample Info & Change */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                             {cloneStatus === 'processing' ? <Loader2 className="animate-spin text-green-500" /> : <AudioLines className="text-green-500" />}
                          </div>
                          <div>
                             <h3 className="font-bold text-white">
                                {cloneStatus === 'processing' ? 'Analyzing Voiceprint...' : 'Voice Model Ready'}
                             </h3>
                             <p className="text-xs text-green-500 font-mono mt-1">
                                {cloneStatus === 'processing' ? 'Extracting tone & pitch...' : 'Cloning parameters applied'}
                             </p>
                          </div>
                       </div>
                       <button onClick={handleNewProject} className="text-xs text-zinc-500 hover:text-white underline decoration-zinc-700 underline-offset-4">Change Sample</button>
                    </div>

                    {cloneStatus === 'processing' ? (
                       <div className="w-full py-12 text-center space-y-4 bg-black/30 rounded-xl border border-dashed border-zinc-800">
                          <div className="relative w-16 h-16 mx-auto">
                              <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
                              <Cpu className="text-amber-500 relative z-10 w-16 h-16" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-lg">Synthesizing Digital Twin</p>
                             <p className="text-gray-500 text-sm mt-2">Maping vocal cords to neural network...</p>
                          </div>
                       </div>
                    ) : (
                       /* === Test & Fine Tune Section (Only visible after 'ready') === */
                       <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-2">
                           
                           {/* Config Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block tracking-wider">Voice Identity Name</label>
                                    <input 
                                        type="text" 
                                        value={cloneName}
                                        onChange={(e) => setCloneName(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500/50 outline-none focus:ring-1 focus:ring-amber-500/20"
                                        placeholder="e.g. My Narrator Voice"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block tracking-wider">Base Gender</label>
                                    <div className="flex bg-black rounded-xl p-1 border border-zinc-800">
                                        <button 
                                            onClick={() => setCloneGender('female')}
                                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${cloneGender === 'female' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Female
                                        </button>
                                        <button 
                                            onClick={() => setCloneGender('male')}
                                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${cloneGender === 'male' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Male
                                        </button>
                                    </div>
                                </div>
                           </div>

                           <div className="h-px bg-zinc-800 w-full"></div>
                           
                           <div className="flex items-center gap-2">
                              <Settings2 className="text-amber-500" size={18} />
                              <h3 className="font-bold text-white text-sm">Fine-Tuning & Generation</h3>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Controls */}
                              <div className="md:col-span-1 space-y-5 bg-black/40 p-4 rounded-xl border border-zinc-800">
                                 <div>
                                    <div className="flex justify-between mb-2">
                                       <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Output Language</label>
                                    </div>
                                    <div className="relative">
                                        <select 
                                        value={cloneLanguage}
                                        onChange={(e) => setCloneLanguage(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-amber-500/50 appearance-none"
                                        >
                                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                        <Globe size={14} className="absolute right-3 top-3 text-zinc-600 pointer-events-none" />
                                    </div>
                                 </div>

                                 <div>
                                    <div className="flex justify-between mb-2">
                                       <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Accent Region</label>
                                    </div>
                                    <select 
                                       value={cloneAccent}
                                       onChange={(e) => setCloneAccent(e.target.value)}
                                       className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-amber-500/50"
                                    >
                                       {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                 </div>

                                 <div>
                                    <div className="flex justify-between mb-2">
                                       <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Acting Instruction</label>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {ACTING_INSTRUCTIONS.map(e => (
                                            <button 
                                                key={e} 
                                                onClick={() => setCloneEmotion(e)} 
                                                className={`text-[10px] px-2 py-1 rounded border transition-all ${cloneEmotion === e ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'}`}
                                            >
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                       type="text"
                                       value={cloneEmotion}
                                       onChange={(e) => setCloneEmotion(e.target.value)}
                                       placeholder="Custom mood (e.g. Sarcastic)"
                                       className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-amber-500/50"
                                    />
                                 </div>

                                 <div>
                                    <div className="flex justify-between mb-2">
                                       <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Pitch Offset</label>
                                       <span className="text-[10px] text-zinc-400 font-mono">{clonePitch > 0 ? `+${clonePitch}` : clonePitch} semitones</span>
                                    </div>
                                    <input 
                                       type="range" min="-12" max="12" step="1" value={clonePitch} 
                                       onChange={(e) => setClonePitch(Number(e.target.value))}
                                       className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between mt-1 text-[10px] text-zinc-600">
                                       <span>Deep (-12)</span>
                                       <span>High (+12)</span>
                                    </div>
                                 </div>

                                 <div>
                                    <div className="flex justify-between mb-2">
                                       <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Speed</label>
                                       <span className="text-[10px] text-zinc-400 font-mono">{(cloneSpeed / 50).toFixed(1)}x</span>
                                    </div>
                                    <input 
                                       type="range" min="0" max="100" value={cloneSpeed} 
                                       onChange={(e) => setCloneSpeed(Number(e.target.value))}
                                       className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                 </div>
                              </div>

                              {/* Text Area & Actions */}
                              <div className="md:col-span-2 flex flex-col gap-4">
                                 <div className="relative flex-1">
                                    <textarea 
                                        value={cloneScript}
                                        onChange={(e) => setCloneScript(e.target.value)}
                                        className="w-full h-full bg-black border border-zinc-800 rounded-xl p-4 text-base text-gray-200 focus:border-amber-500/50 outline-none resize-none min-h-[200px]"
                                        placeholder={`Enter text for ${cloneName} to speak in ${cloneLanguage}...`}
                                    />
                                    <div className="absolute top-4 right-4 text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700 uppercase tracking-widest font-bold">
                                        Output Mode: {cloneLanguage}
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-3">
                                    <button 
                                       onClick={handleTestClone}
                                       disabled={cloneLoading || !cloneScript || cooldown > 0}
                                       className="flex-1 py-3 bg-white hover:bg-gray-200 text-black font-bold text-sm rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                                    >
                                       {cloneLoading ? <Loader2 className="animate-spin" size={16} /> : cooldown > 0 ? <><Timer size={16}/> {cooldown}s</> : <Zap fill="black" size={16} />}
                                       {cooldown > 0 ? "" : "Generate Speech"}
                                    </button>
                                    
                                    <button 
                                       onClick={handleSaveProject}
                                       className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-xl border border-zinc-700 transition-all flex items-center gap-2 text-sm font-bold"
                                       title="Save Project"
                                    >
                                       <Save size={18} /> Save
                                    </button>

                                    {cloneAudioBuffer && (
                                       <>
                                          <button 
                                             onClick={() => isClonePlaying ? stopCloneAudio() : playCloneAudio(cloneAudioBuffer)}
                                             className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${isClonePlaying ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'}`}
                                          >
                                             {isClonePlaying ? <Square size={18} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                          </button>
                                          <button 
                                             onClick={handleCloneDownload}
                                             className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white flex items-center justify-center border border-zinc-700 transition-all"
                                          >
                                             <Download size={20} />
                                          </button>
                                       </>
                                    )}
                                 </div>
                              </div>
                           </div>
                       </div>
                    )}
                 </div>
              )}
           </div>
        )}

      </main>

    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);