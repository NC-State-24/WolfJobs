import React, { useState,useEffect } from "react";
import axios from "axios";
import VideoDropzone from "../../components/Video/VideoDropzone";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";

const Video: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const userId = useUserStore((state) => state.id);
  const updateVideo = useUserStore((state) => state.updateVideo);
  const updateVideoId = useUserStore((state) => state.updateVideoId);

  useEffect(() => {
    const checkExistingVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/getVideo/${userId}`);
      if (response.status === 200) {
        setFile(response.data);
      }
    } catch (error) {
        console.error("Error fetching existing video:", error);
      }
    };
    checkExistingVideo();
  }, [userId]);

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("id", userId);

    try {
      const response = await axios.post(
        "http://localhost:8000/users/uploadVideo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Intro Video Uploaded Successfully.");
        updateVideo(file.name);
        updateVideoId(response.data.videoId); // Assuming the backend returns videoId
      }
    } catch (error) {
      console.error("Error uploading the video:", error);
      const errorMessage = error
      toast.error(`Intro Video could not be uploaded {} ${errorMessage}`);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-1/2">
          <VideoDropzone onFileUpload={(acceptedFiles) => setFile(acceptedFiles[0])} />
          <div className="flex flex-row">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded"
            >
              Upload Intro Video
            </button>
          </div>

          {(file) && (
            <div className="mt-4">
              <p>Current Intro Video: {file.name}</p>
              <a
                href={`/videoviewer/${userId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 mt-2 font-bold text-white bg-red-500 rounded"
              >
                View
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Video;