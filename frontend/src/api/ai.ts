import axios from "axios";
import { aiQuestionsURL, fetchSuggestedPayURL } from "./constants";
import { BiSolidChevronRightSquare } from "react-icons/bi";

const generateQuestions = async (
  description: string,
  skill: string
): Promise<any[]> => {
  try {
    const response = await axios.post(aiQuestionsURL, {
      description: description,
      skill: skill,
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

const fetchSuggestedPay = async (
  jobRole: string,
  location: string
): Promise<any[]> => {
  try {
    const response = await axios.post(fetchSuggestedPayURL, {
      jobRole: jobRole,
      location: location,
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export { generateQuestions, fetchSuggestedPay };
