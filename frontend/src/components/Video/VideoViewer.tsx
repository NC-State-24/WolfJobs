import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function VideoViewer() {
  const { applicantId } = useParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getVideo() {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/getVideo/${applicantId}`,
          {
            responseType: "blob",
          }
        );
        const contentType = response.headers['content-type'];
        const videoBlobUrl = URL.createObjectURL(new Blob([response.data],{type: contentType}));
        setVideoUrl(videoBlobUrl);
      } catch (error) {
        console.error("Error fetching video", error);
        setError("Failed to load video. Please try again later.");
      }
    }
    getVideo();
  }, [applicantId]);

  // Cleanup the blob URL
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {videoUrl ? (
        <div className="border-2 border-black shadow-lg">
          <video 
            controls 
            width="640" 
            height="360"
            className="max-w-full"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="text-center">Loading video...</div>
      )}
    </div>
  );
}

export default VideoViewer;