import axios from 'axios';
import fetch from 'node-fetch';

// Fungsi untuk memecahkan captcha standalone
async function solveStandaloneCaptcha(apiKey, sitekey, pageurl) {
    try {
        const response = await axios.post('http://2captcha.com/in.php', {
            method: 'turnstile',
            key: apiKey,
            sitekey: sitekey,
            pageurl: pageurl,
            json: 1
        });

        if (response.data.status !== 1) {
            throw new Error('Failed to submit captcha task');
        }

        const taskId = response.data.request;
        return getResult(apiKey, taskId);
    } catch (error) {
        console.error('Error solving standalone captcha:', error);
    }
}

// Fungsi untuk memecahkan captcha di halaman Turnstile Challenge
async function solveChallengeCaptcha(apiKey, sitekey, pageurl, cData, chlPageData, action) {
    try {
        const response = await axios.post('http://2captcha.com/in.php', {
            key: apiKey,
            method: 'turnstile',
            sitekey: sitekey,
            data: cData,
            pagedata: chlPageData,
            pageurl: pageurl,
            action: action,
            json: 1
        });

        if (response.data.status !== 1) {
            throw new Error('Failed to submit captcha task');
        }

        const taskId = response.data.request;

        console.log(taskId);

        return getResult(apiKey, taskId);
    } catch (error) {
        console.error('Error solving challenge captcha:', error);
    }
}

// Fungsi untuk mendapatkan hasil dari 2captcha
async function getResult(apiKey, taskId) {
    try {
        while (true) {
            const response = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${taskId}&json=1`)

            console.log(response)

            if (response.data.status === 1) {
                return {
                    token: response.data.request,
                    userAgent: response.data.useragent
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

const testAja = (inputEmail, token, userAgent) => new Promise((resolve, reject) => {
    const dataString = `name=jhgjhgjhgjh&email=${inputEmail}&cf-turnstile-response=${token}`

    fetch(`https://hendyanmadethis.com/iqbal/submit_form.php`, {
        method: "POST",
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'id,en-US;q=0.9,en;q=0.8,id-ID;q=0.7',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://hendyanmadethis.com',
            'priority': 'u=0, i',
            'referer': 'https://hendyanmadethis.com/iqbal/',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': `${userAgent}`
        },
        body: dataString
    })
        .then(res => res.text())
        .then(res => resolve(res))
        .catch(error => reject(error))
});


// Contoh penggunaan
(async () => {

    const inputEmail = `baaaaaaaaaaaaaaaaal@gmail.com`;

    const apiKey = '';

    // Kasus 1: Standalone Captcha siteKey loket 0x4AAAAAAAVGwLc24u4kvmvl
    const standaloneCaptchaResult = await solveStandaloneCaptcha(apiKey, '0x4AAAAAAAeSbRUS6TWlS6OA', 'https://hendyanmadethis.com/iqbal/');
    console.log(standaloneCaptchaResult)
    // console.log('Standalone Captcha Result:', standaloneCaptchaResult);

    const token = standaloneCaptchaResult.token;
    const userAgent = standaloneCaptchaResult.userAgent;

    console.log(token)
    console.log(userAgent)

    const resultTest = await testAja(inputEmail, token, userAgent)

    console.log(resultTest)

    // Kasus 2: Turnstile Challenge Captcha
    // const challengeCaptchaResult = await solveChallengeCaptcha(apiKey, '0x0AAAAAAADnPIDROzbs0Aaj', 'https://2captcha.com/', '7fab0000b0e0ff00', '3gAFo2...0ME1UVT0=', 'managed');
    // console.log('Challenge Captcha Result:', challengeCaptchaResult);


})();