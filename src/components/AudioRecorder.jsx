import { Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";

export default function AudioRecorder({setMessage , setProcessing}) {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const onSubmitAudio = async (audioFile) => {
        try {
            const formData = new FormData();
            formData.append("audio", audioFile);

            // Use fetch directly or adjust postJSON to handle FormData without JSON
            setProcessing(true);
            const response = await fetch("http://localhost:5000/api/advisory/stt", {
                method: "POST",
                body: formData,
            });

            const res = await response.json();
            console.log("Response from audio upload:", res);
            setProcessing(false);
            if (res && res.text) {
                setMessage(res.text);
            }
        } catch (error) {
            console.error("Failed to upload audio", error);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);

                await onSubmitAudio(audioBlob);

                // Optional cleanup after upload
                // URL.revokeObjectURL(url);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
         <button
            onClick={recording?stopRecording: startRecording}
            className={`p-2 rounded-lg ${recording ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            
            {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
    );
}
