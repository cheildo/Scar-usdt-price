const Web3 = require("web3");
const redis = require('redis');
const axios = require('axios');

// const {m721Address, m721ABI} = require('./config/config');

const apiUrl = 'https://api.livecoinwatch.com/coins/single';
const apiKey = '39657e64-05bd-4f51-ad4f-13ea96045bff';

const client = redis.createClient({
    password: 'pubxorrOatPXj6oN0eXunJIVqGKqzggD',
    socket: {
        host: 'redis-12544.c54.ap-northeast-1-2.ec2.cloud.redislabs.com',
        port: 12544,
    }
  });
  client.connect();
  client.on('error', err => console.log('Redis Client Error', err));
  client.on("connect", () => {
    console.log("Connected to redis database!");
  });

// const provider = new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org/')
// const web3 = new Web3(provider);
// const market721Contract = new web3.eth.Contract(m721ABI, m721Address);

async function main() {
    
    // const scarToWei = web3.utils.toWei('1' , 'ether')
    // console.log("scarToWei: ", scarToWei, "wei");
    // let scarToBUSD = await market721Contract.methods.getBUSDfromSCAR(scarToWei).call()
    //     .catch(error => {
    //         console.error(error)
    // })
    // const busdToEther = web3.utils.fromWei(scarToBUSD , 'ether')
    // console.log(`1 SCAR" = ${busdToEther} USD`);

    const rate = await fetchData();
    const newRate = rate-rate*1/100
    console.log("newRate: ", newRate);

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
    //console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


main()
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

setInterval(main, 30000);
