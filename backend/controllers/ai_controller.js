// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const { exec } = require('child_process');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const isUndefinedOrEmpty = require("../utils/common");

function runPythonScript(jobDescription, skill) {
    // Construct the command, passing arguments to the Python script
    // Siddhi - const command = `"C:\\Users\\siddh\\AppData\\Local\\Programs\\Python\\Python312\\python.exe" controllers\\script.py "${jobDescription}" "${skill}"`;
    const command = `python ./controllers/script.py "${jobDescription}" "${skill}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Python script error: ${stderr}`);
                reject(new Error(stderr));
            }

            resolve(stdout);
        });
    });
}

module.exports.generateQuestions = async function (req, res) {
    const description = req.body.description;
    const skill = req.body.skill;

    if (isUndefinedOrEmpty(req.body.description) || isUndefinedOrEmpty(req.body.skill)) {
        return res.status(400).send({ message: `Required fields missing` });
    }

    try {
        const op = await runPythonScript(description, skill);
        return res.status(200).send({ data: eval(op) });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send({ message: `Something went wrong: ${error.message}` });
    }
};

module.exports.fetchSuggestedPay = async function (req, res) {
    const jobRole = req.body.jobRole;
    const location = req.body.location;

    if (isUndefinedOrEmpty(req.body.jobRole) || isUndefinedOrEmpty(req.body.location)) {
        return res.status(400).send({ message: `Required fields missing` });
    }

    try {
        //console.log(process.env.GEMINI_API_KEY)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate suggested hourly pay rate in US dollars for job role: ${jobRole} at location: ${location}. I don't want any explanation, just give me a oneline short answer which is to the point and answers my question.`;
        const result = await model.generateContent(prompt);
        return res.status(200).send({ data: result.response.text() });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send({ message: `Something went wrong: ${error.message}` });
    }
}