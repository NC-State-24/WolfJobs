import React, { useState } from 'react';
import axios from 'axios';
import ResumeDropzone from '../../components/Resume/ResumeDropzone';
import { useUserStore } from '../../store/UserStore';


const Resume: React.FC = () => {
  // State to store the uploaded file
  const [file, setFile] = useState<File | null>(null);
  
  // The current resume data
  const resumeName = useUserStore((state) => state.resume)
  const userId = useUserStore((state) => state.id)


  // Function to handle file submission
  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);

      try {
        // Replace with your actual endpoint
        const response = await axios.post('/fake-upload-endpoint', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle the response accordingly
        if (response.status === 200) {
          console.log('Resume uploaded successfully');
          // Update the current resume state if needed
        }
      } catch (error) {
        console.error('Error uploading the resume', error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-1/3">
          <ResumeDropzone onFileUpload={(acceptedFiles) => setFile(acceptedFiles[0])} />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded"
          >
            Upload Resume
          </button>
          {resumeName && (
            <div className="mt-4">
              <p>Current Resume: {resumeName}</p>
              <a href={`/resumeviewer/${userId}`} target="_blank" rel="noopener noreferrer">
                View
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resume;
