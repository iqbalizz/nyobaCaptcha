import fetch from "node-fetch";
import { bootstrap } from "global-agent";

// Setel alamat proxy dan port
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://192.168.243.61:7071';

bootstrap();

const testDulu = () => new Promise((resolve, reject) => {
    fetch(`https://2captcha.com.com/in.php `, {
        method: 'POST',
        body: {
            "key": "d1aaead8bf67966d9ce5a44914ceb244",
            "method": "turnstile",
            "sitekey": "0x4AAAAAAAAjq6WYeRDKmebM",
            "data": "7fab0000b0e0ff00",
            "pagedata": "3gAFo2...0ME1UVT0=",
            "pageurl": "https://2captcha.com/",
            "action": "managed",
            "json": 1
        }
    })
        .then(async res => {
            const getValue = {
                result: await res.text()
            }
            resolve(getValue)
        })
        .catch(error => reject(error))
});

(async () => {
    const result = await testDulu()
    console.log(result)
})();