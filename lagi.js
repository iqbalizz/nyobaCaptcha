const { CurlGenerator } = require('curl-generator');
const { exec } = require('child_process');

const createCurlCommand = (url, method, headers, body) => {
    const params = {
        url,
        method,
        headers
    }
    if (body) params.body = body
    const generateCommand = CurlGenerator(params, { compressed: true })
    return generateCommand.replace('curl', '')
}


const execCommand = (command) => new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
        if (err) {
            reject(err, stderr)
        }

        resolve(stdout)
    });
});



(async () => {
    try {

        const curlImperSonatePattern = 'docker run --rm lwthiker/curl-impersonate:0.5-chrome curl_chrome101';

        const headers = {
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
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        }

        const curlGeneratorResult = createCurlCommand(encodeURI('https://hendyanmadethis.com/iqbal/submit_form.php'), 'POST', headers, 'name=jhgjhgjhgjh&email=lihatduluyuuk%40gmail.com&cf-turnstile-response=0.NW5_zsO0cwAfyxgCqFabIJtZaPFH7gnX_dQPmdRisjC8RD-zMU8mC7HBSQ6Bje9VeYLeQWQdOxbkc43zukAXfhGP4krOYRNrvjpPALUegWlDcJrXY4-gTOyIoFDSk1pwFD8164XHQJip4-BQvuU1MFKWnZDKGpvSSolWRr4doDvSbHNr_bgW0jWoXzubFzY17kKnt1t2av5Fug2iUpaZ4frHIHmYD2YcP-m6NZD5t3aoJXD8Urf3o51wryK-wYgEP9kQe4WoYkG1r_MejnFKQLRWoN5vxZ1oqXaUnyH07GiLmsik4piEg_W6hFSN1V3678uO-16pe9GnSP5MwgnrcQCpYu_gw6joKVie1gNCyhbxTNceEplk3kirGGuJ9MJTyw2PV8H_rQ_VnMaq3zPsxV_tMg3uP-O6m0E8xTob6Fn4JNZa1aMfG3JhycKlZd_c.EswIktFUACSKm0MHofRlkg.afe48dbcdbff26885924daea7d566ce15d11aa6b49d7d8de1f6221dec4b33117');
        const resultCurl = await execCommand(`${curlImperSonatePattern} ${curlGeneratorResult}`)

        console.log(resultCurl)
    } catch (e) {
        console.log(e)
    }

})();