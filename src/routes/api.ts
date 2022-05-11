import { router } from "../components/router";
import axios from "axios";

const prices_and_rarity = {
  '17158':{"price":'8000000', "toMint":"10"},
  '17321':{"price":'10000000', "toMint":"5"}
}

export function init() {
  router.get("/GetNfts/:projectID", async (ctx) => {
    const projectID = ctx.params.projectID;

    const api_url = "https://api.nft-maker.io/GetNfts/" + process.env.API_KEY + "/" + projectID + "/all";
    console.log(api_url)

    const response = await axios.get(api_url);
    ctx.body = response.data;
  });

  router.get('/GetRarityRanks', async (ctx) => {
    const api_url = "https://cnft.tools/api/rankings/8dd5717e7d4d993019dbd788c19837910e3fcf647ab282f828c80a7a/";
    
    const response = await axios.get(api_url);
    ctx.body = response.data;
  });    

  router.get('/GetProjectPriceAndRarity/:projectID', async (ctx) => {
    const projectID = ctx.params.projectID;

    const price = prices_and_rarity[projectID]["price"];
    const toMint = prices_and_rarity[projectID]["toMint"];
    
    ctx.body = {"price":price, "toMint":toMint};
  });

  router.get('/CheckCardanoAddress/:address', async (ctx) => {
    const address = ctx.params.address;

    const api_url = "https://cardano-mainnet.blockfrost.io/api/v0/addresses/" + address;
    
    const headers = {'project_id':'cAiR6OBMC8HcwEc8kf9BVPR05eqW1Cx0'}
    const response = await axios.get(api_url, { headers: headers });
    
    ctx.body = response.data;
  });

  router.get('/CheckAddressTransactions/:address', async (ctx) => {
    const address = ctx.params.address;

    const api_url = "https://cardano-mainnet.blockfrost.io/api/v0/addresses/"+ address +"/transactions";
    
    const headers = {'project_id':'cAiR6OBMC8HcwEc8kf9BVPR05eqW1Cx0'}
    const response = await axios.get(api_url, { headers: headers })
    
    ctx.body = response.data;
  });

  router.get('/CheckPoolPm/:address', async (ctx) => {
    const address = ctx.params.address;

    const api_url = "https://pool.pm/wallet/" + address;
    
    const response = await axios.get(api_url);
    
    ctx.body = response.data;
  });

  router.get('/CheckAsset/:asset', async (ctx) => {
    const asset = ctx.params.asset;

    const api_url = "https://cardano-mainnet.blockfrost.io/api/v0/assets/"+ asset;

    const headers = {'project_id':'cAiR6OBMC8HcwEc8kf9BVPR05eqW1Cx0'}
    const response = await axios.get(api_url, { headers: headers})
    
    ctx.body = response.data;
  });

  router.get('/GetAddresses/:asset', async (ctx) => {
    const asset = ctx.params.asset;

    ctx.body = await getAddresses(asset);
  });

  router.get('/AssetsFromPolicy/:policyID/:page', async (ctx) => {
    const policyID = ctx.params.policyID;
    const page = ctx.params.page;

    ctx.body = await assetsFromPolicy(policyID, page);
  });

  router.get('/HoldersFromPolicy/:policyId', async (ctx) => {
    const policyID = ctx.params.policyID;

    const holders_list: any[] = []
    const holders_json={}

    var page=0

    while (true) {
        page += 1;

        const assets = await assetsFromPolicy(policyID, page);
        
        if (assets.length == 0) {
          break;
        }

        for await (const asset of assets) {
            try {
              const holder = await getAddresses(asset["asset"]);
              const address = holder[0]["address"];

              if (address in Object.keys(holders_json)) {
                holders_json[address] += 1;
              } else {
                holders_json[address]=1
              }

              if (!(address in holders_list)) {
                holders_list.push(address);
              }
            } catch(err) {
              console.error(err);
            }
        }
    }

    ctx.body = holders_json;
  });
}

async function assetsFromPolicy(policyID, page) {
  const api_url = "https://cardano-mainnet.blockfrost.io/api/v0/assets/policy/" + policyID + "?page=" + page;
  
  const headers = {'project_id':'cAiR6OBMC8HcwEc8kf9BVPR05eqW1Cx0'}
  const response = await axios.get(api_url, { headers:headers });
  
  return response.data;
}

async function getAddresses(asset) {
  const api_url = "https://cardano-mainnet.blockfrost.io/api/v0/assets/" + asset + "/addresses";
    
  const headers = {'project_id':'cAiR6OBMC8HcwEc8kf9BVPR05eqW1Cx0'}
  const response = await axios.get(api_url, {headers: headers})
  
  return response.data;
}