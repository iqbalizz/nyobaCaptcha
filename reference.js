const axios = require('axios');

const CAPSOLVER_API_KEY = "";
const PAGE_URL = "https://peet.ws/turnstile-test/non-interactive.html";
const WEBSITE_KEY = "0x4AAAAAAABS7vwvV6VFfMcD";

async function solvecf(metadata_action = null, metadata_cdata = null) {
    const url = "https://api.capsolver.com/createTask";
    const task = {
        type: "AntiTurnstileTaskProxyLess",
        websiteURL: PAGE_URL,
        websiteKey: WEBSITE_KEY,
    };
    if (metadata_action || metadata_cdata) {
        task.metadata = {};
        if (metadata_action) {
            task.metadata.action = metadata_action;
        }
        if (metadata_cdata) {
            task.metadata.cdata = metadata_cdata;
        }
    }
    const data = {
        clientKey: CAPSOLVER_API_KEY,
        task: task
    };
    const response = await axios.post(url, data);
    console.log(response.data);
    return response.data.taskId;
}

async function solutionGet(taskId) {
    const url = "https://api.capsolver.com/getTaskResult";
    let status = "";
    while (status !== "ready") {
        const data = { clientKey: CAPSOLVER_API_KEY, taskId: taskId };
        const response = await axios.post(url, data);
        console.log(response.data);
        status = response.data.status;
        console.log(status);
        if (status === "ready") {
            return response.data.solution;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

async function main() {
    const start_time = Date.now();

    const taskId = await solvecf();
    const solution = await solutionGet(taskId);
    if (solution) {
        const user_agent = solution.userAgent;
        const token = solution.token;

        console.log("User_Agent:", user_agent);
        console.log("Solved Turnstile Captcha, token:", token);
    }

    const end_time = Date.now();
    const elapsed_time = (end_time - start_time) / 1000;
    console.log(`Time to solve the captcha: ${elapsed_time} seconds`);
}

main().catch(console.error);