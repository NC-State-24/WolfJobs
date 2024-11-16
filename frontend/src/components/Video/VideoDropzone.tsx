import React, { useCallback } from "react";
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";

interface VideoDropzoneProps {
  onFileUpload: (files: File[]) => void;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Pass the accepted files to the parent component
    onFileUpload(acceptedFiles);

    // Handle any file rejections
    fileRejections.forEach((file) => {
      console.error(`File rejected: ${file.file.name}`);
      // Here you can handle displaying an error message to the user
    });
  }, [onFileUpload]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { 
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogg']
    },
    maxSize: 100 * 1024 * 1024, // limit the size to 100MB max
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone(dropzoneOptions);

  return (
    <div {...getRootProps()} className={`flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'bg-blue-100' : ''}`}>
      <input {...getInputProps()} />
      {
        isDragActive ? (
          <p className="text-gray-700">Drop the video files here ...</p>
        ) : (
          <p className="text-gray-700">Drag 'n' drop some video files here, or click to select files</p>
        )
      }
      {isDragReject && <p className="text-red-500">Some files will be rejected.</p>}
    </div>
  );
};

export default VideoDropzone;