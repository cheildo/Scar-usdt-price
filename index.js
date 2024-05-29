const Web3 = require("web3");
const redis = require('redis');
const axios = require('axios');
require("dotenv").config();


const apiUrl = process.env.API_URL
const apiKey = process.env.API_KEY;

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
  });
  client.connect();
  client.on('error', err => console.log('Redis Client Error', err));
  client.on("connect", () => {
    console.log("Connected to redis database!");
  });


async function main() {
    const rate = await fetchData();
    console.log("Rate: ", rate);

    try {
        await client.set('scarPrice:scarPrice', JSON.stringify(rate))
    }catch (error) {
        console.error('ScarPrice: Error redis set: ', error);
    }
    console.log(`Scar price updated`);
}

const fetchData = async () => {
  try {
    const response = await axios.post(apiUrl, {
      currency: 'USD',
      code: 'SCAR'
    }, {
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey
      }
    });
    const data = response.data;
    const rate = data.rate
    return rate;
    //console.log("Rate: ", rate);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

main()
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

setInterval(main, 180000);
