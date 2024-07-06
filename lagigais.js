import fetch from "node-fetch";
import cheerio from "cheerio";
import axios from "axios";
import { bootstrap } from "global-agent";

// Setel alamat proxy dan port
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://192.168.77.129:7071';

bootstrap();

const getAuthToken = () => new Promise((resolve, reject) => {
    fetch(`https://www.driftingruby.com/users/sign_in`, {
        method: 'get',
        headers: {
            'Host': 'www.driftingruby.com',
            'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Accept-Language': 'en-US',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
            'Sec-Purpose': 'prefetch;prerender',
            'Purpose': 'prefetch',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Accept-Encoding': 'gzip, deflate, br',
            'Priority': 'u=0, i',
            'Connection': 'keep-alive'
        }
    })
        .then(async res => {
            const value = {
                cookie: res.headers.raw(`cookie`)[`set-cookie`],
                body: await res.text()
            }

            resolve(value)
        })
        .catch(err => reject(err))
});

const getSignIn = (authenticityToken, token, csrfToken, userAgent, cookieAuth) => new Promise((resolve, reject) => {
    const dataString = `authenticity_token=${authenticityToken}&user%5Bemail%5D=Iqbaallizz2%40gmail.com&user%5Bpassword%5D=Iqbal12345&user%5Bremember_me%5D=0&cf-turnstile-response=${token}&commit=Log+in`;

    fetch(`https://www.driftingruby.com/users/sign_in`, {
        method: "POST",
        headers: {
            'Host': 'www.driftingruby.com',
            'Content-Length': '778',
            'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
            'X-Csrf-Token': csrfToken,
            'Accept-Language': 'en-US',
            'Sec-Ch-Ua-Mobile': '?0',
            'User-Agent': userAgent,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'text/vnd.turbo-stream.html, text/html, application/xhtml+xml',
            'X-Turbo-Request-Id': 'c8c276ca-443a-4234-9453-7778b7ca0887',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Origin': 'https://www.driftingruby.com',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://www.driftingruby.com/users/sign_in',
            'Accept-Encoding': 'gzip, deflate, br',
            'Priority': 'u=1, i',
            'Cookie': cookieAuth
        },
        body: dataString,
        redirect: "manual"
    })
        .then(async res => {
            const value = {
                cookie: res.headers.raw(`cookie`)[`set-cookie`],
                body: await res.text()
            }

            resolve(value)
        })
        .catch(err => reject(err))
});

const getUserInfo = (csrfToken, userAgent, cookie) => new Promise((resolve, reject) => {
    fetch(`https://www.driftingruby.com/`, {
        method: "GET",
        headers: {
            'Host': 'www.driftingruby.com',
            'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
            'X-Csrf-Token': csrfToken,
            'Accept-Language': 'en-US',
            'Sec-Ch-Ua-Mobile': '?0',
            'User-Agent': userAgent,
            'Accept': 'text/vnd.turbo-stream.html, text/html, application/xhtml+xml',
            'X-Turbo-Request-Id': 'c4cd1d84-3234-43d9-9398-99344657473a',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://www.driftingruby.com/users/sign_in',
            'Accept-Encoding': 'gzip, deflate, br',
            'Priority': 'u=1, i',
            'Cookie': cookie
        }
    })
        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

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

export const getCookie = (resultCookie) => {

    let cookieObject = {}

    resultCookie.forEach((cookie, index) => {
        const data = cookie.split(`;`)

        const [nameValue, ...attributes] = data;

        const [name, value] = nameValue.split('=').map(part => part.trim());

        cookieObject[name] = `${name}=${value}`;

    });

    const cookie = Object.values(cookieObject).join('; ');
    return {
        cookieObject,
        cookie
    }
}

(async () => {

    const apiKey = 'd1aaead8bf67966d9ce5a44914ceb244';

    const resultAuthToken = await getAuthToken();
    const resultBody = resultAuthToken.body;

    const resultCookieAuth = resultAuthToken.cookie;

    const cookieGetAuth = getCookie(resultCookieAuth);

    const cookieAuth = cookieGetAuth.cookie

    const $ = cheerio.load(resultBody);

    // Mengambil nilai dari atribut 'value' pada elemen <input>
    const authenticityToken = $('input[name="authenticity_token"]').val();
    const csrfToken = $('meta[name="csrf-token"]').attr('content');
    const siteKey = $('div.cf-turnstile').attr('data-sitekey');



    console.log(resultAuthToken)
    console.log(authenticityToken)
    console.log(csrfToken)
    console.log(siteKey)
    console.log(cookieAuth)

    const standaloneCaptchaResult = await solveStandaloneCaptcha(apiKey, siteKey, 'https://www.driftingruby.com/users/sign_in');
    console.log(standaloneCaptchaResult)
    // console.log('Standalone Captcha Result:', standaloneCaptchaResult);

    const token = standaloneCaptchaResult.token;
    const userAgent = standaloneCaptchaResult.userAgent;

    console.log(token)
    console.log(userAgent)


    const resultSignIn = await getSignIn(authenticityToken, token, csrfToken, userAgent, cookieAuth)

    const resultBodySignIn = resultSignIn.body

    const resultCookieSignIn = resultSignIn.cookie

    const cookieGet = getCookie(resultCookieSignIn)
    const cookie = cookieGet.cookie;

    console.log(resultBodySignIn)
    console.log(resultSignIn)
    console.log(cookie)

    const resultUserInfo = await getUserInfo(csrfToken, userAgent, cookie)

    console.log(resultUserInfo)

})();