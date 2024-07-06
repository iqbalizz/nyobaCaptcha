// import fetch from "node-fetch";
import axios from "axios";
// import { bootstrap } from "global-agent";

// // Setel alamat proxy dan port
// process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://192.168.77.129:7071';

// bootstrap();


async function solveStandaloneCaptcha(apiKey, sitekey, pageurl) {
    try {
        const response = await axios.post('http://2captcha.com/in.php', null, {
            params: {
                method: 'turnstile',
                key: apiKey,
                sitekey: sitekey,
                pageurl: pageurl,
                json: 1
            }
        });

        // console.log(response)

        if (response.data.status !== 1) {
            throw new Error('Failed to submit captcha task');
        }

        const taskId = response.data.request;
        return getResult(apiKey, taskId);
    } catch (error) {
        console.error('Error solving standalone captcha:', error);
    }
}

async function getResult(apiKey, taskId) {
    try {
        while (true) {
            const response = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${taskId}&json=1`);


            console.log(response.data);
            console.log(response.env)

            if (response.data.status === 1) {
                return {
                    token: response.data.request,
                    userAgent: response.data.useragent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                };
            }

            if (response.data.status === 0) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu 5 detik sebelum mencoba lagi
            } else {
                throw new Error('Failed to get captcha result');
            }
        }
    } catch (error) {
        console.error('Error getting captcha result:', error);
    }
}

// const testAja = (inputEmail, token, userAgent) => new Promise((resolve, reject) => {
//     const dataString = `name=jhgjhgjhgjh&email=${inputEmail}&cf-turnstile-response=${token}`;

//     fetch(`https://hendyanmadethis.com/iqbal/submit_form.php`, {
//         method: "POST",
//         headers: {
//             'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//             'accept-language': 'id,en-US;q=0.9,en;q=0.8,id-ID;q=0.7',
//             'cache-control': 'max-age=0',
//             'content-type': 'application/x-www-form-urlencoded',
//             'origin': 'https://hendyanmadethis.com',
//             'priority': 'u=0, i',
//             'referer': 'https://hendyanmadethis.com/iqbal/',
//             'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"Windows"',
//             'sec-fetch-dest': 'document',
//             'sec-fetch-mode': 'navigate',
//             'sec-fetch-site': 'same-origin',
//             'sec-fetch-user': '?1',
//             'upgrade-insecure-requests': '1',
//             'user-agent': userAgent
//         },
//         body: dataString
//     })
//         .then(res => res.text())
//         .then(res => resolve(res))
//         .catch(error => reject(error))
// });

const testAja = async (inputEmail, token, userAgent) => {
    try {
        const linkUrl = `https://hendyanmadethis.com/iqbal/submit_form.php`;

        const dataString = `name=jhgjhgjhgjh&email=${inputEmail}&cf-turnstile-response=${token}`

        const response = await axios.post(linkUrl, dataString, {
            headers: {
                'user-agent': userAgent,
                'Cookie': ``
            }
        });

        console.log(response.data)

    } catch (error) {
        console.error(error)
    }
};

(async () => {
    const inputEmail = `baaaaaaasdsdsaal@gmail.com`;
    const apiKey = 'd1aaead8bf67966d9ce5a44914ceb244';

    const standaloneCaptchaResult = await solveStandaloneCaptcha(apiKey, '0x4AAAAAAAeSbRUS6TWlS6OA', 'https://hendyanmadethis.com/iqbal/');
    console.log('Standalone Captcha Result:', standaloneCaptchaResult);

    if (standaloneCaptchaResult) {
        const { token, userAgent } = standaloneCaptchaResult;

        console.log('Token:', token);
        console.log('User Agent:', userAgent);

        const resultTest = await testAja(inputEmail, token, userAgent);
        console.log('Result Test:', resultTest);
    } else {
        console.error('Failed to solve CAPTCHA');
    }
})();