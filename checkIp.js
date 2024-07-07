import axios from "axios";
import { publicIpv4 } from "public-ip";

import { bootstrap } from "global-agent";

// Setel alamat proxy dan port
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://192.168.6.144:7071';

bootstrap();

const apiKey = '55b5fe1bca6b45bebe393da67aa77db7'; // Ganti dengan API key Anda dari ipgeolocation.io

(async () => {
    try {
        const ip = await publicIpv4();

        console.log(ip)

        console.log(`Your public IP address is: ${ip}`);

        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
        const data = response.data;

        console.log(data)

        console.log(`Region: ${data.country_capital}`);
        console.log(`Country: ${data.country_name}`);
    } catch (error) {
        console.error('Error fetching information:', error);
    }
})();