import React, { useState, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

const VideoRecorder = () => {
  const { userId } = useSubscription();
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      uploadVideo(blob);
    };
    recordedChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVideo = async (blob: Blob) => {
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('video', blob);
    formData.append('user_id', userId);
    const delete_at = new Date();
    delete_at.setFullYear(delete_at.getFullYear() + 1);
    formData.append('delete_at', delete_at.toISOString());

    const { data, error } = await fetch('/api/video-storage', {
      method: 'POST',
      body: formData,
    }).then(res => res.json());

    if (error) {
      console.error('Error uploading video:', error);
    } else {
      console.log('Video uploaded successfully:', data);
    }
  };

  return (
    <div>
      <h2>Video Recorder</h2>
      <video ref={videoRef} autoPlay muted playsInline></video>
      <div>
        {!isRecording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <button onClick={handleStopRecording}>Stop Recording</button>
        )}
      </div>
      {videoURL && (
        <div>
          <h3>Playback</h3>
          <video src={videoURL} controls></video>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
