"use strict";

const walletAddress = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const notFound = document.getElementById("notfound");
const assets = document.getElementById("assets");
const dapps = document.getElementById("dapps");
const form = document.getElementById("form");
const loader = document.getElementById("loader");

const server_url = "http://localhost:8080";

walletAddress.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

async function getRarities() {
  try {
    const response = await fetch(server_url + "/GetRarityRanks", {
      dataType: "json",
      method: "GET",
      // "mode":"no-cors",
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
    notFound.innerHTML = "There was an error loading part of the script. Rarity information is temporarily unavailable.";
    return null; // Ew.
  }
}

var rarityTools;

(async () => {
  rarityTools = await getRarities();
})();

async function searchAddress() {
  const state = {
    all_nfts: [],
    walletAddress: walletAddress.value,
    policyID: "8dd5717e7d4d993019dbd788c19837910e3fcf647ab282f828c80a7a",
  };


  const encoded = convertASCIItoHex(state.walletAddress);

  console.log(state.walletAddress)
  console.log(encoded)

  setState({ formHidden: true, buttonLabel: "Searching..." });

  if (state.walletAddress.startsWith("CardaWorld")) {
    getNftDetails(
      rarityTools,
      state.all_nfts,
      state.policyID + encoded
    );
  } else if (state.walletAddress.startsWith("addr1")) {
    fetch(server_url + "/CheckPoolPm/" + state.walletAddress, {
      dataType: "jsonp",
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        var all_assets = response.tokens;
        var cardaworld_counter = 0;

        all_assets.map((asset) => {
          if (asset.policy.startsWith(state.policyID)) {
            if (asset.quantity > 0) {
              cardaworld_counter += 1;

              var encoded = convertASCIItoHex(asset.name);
              var asset_id = state.policyID + encoded;
              var metadata = asset.metadata;
              var image_ipfs = metadata.image.replace("ipfs://", "");
              var imageURL = "https://infura-ipfs.io/ipfs/" + image_ipfs;
              var nft_info = {
                asset_id: asset_id,
                description: metadata.description,
                name: metadata.name,
                imageURL: imageURL,
                rarities: metadata["rare biomes"],
                moons: metadata["moons"],
                galaxyType: metadata["galaxy type"],
                viewerIpfs: metadata.files[0].src.replace("ipfs://", ""),
                rings: metadata.rings,
                planetType: metadata["planet type"],
                planetName: metadata["planet name"],
                planetSize: metadata["planet size"],
                atmosphere: metadata["atmosphere"],
                rarityRank: "Unavailable",
                rarityScore: "Unavailable",
              };

              if (rarityTools) {
                nft_info["rarityRank"] = rarityTools[asset.name]["rarityRank"]
                nft_info["rarityScore"] = rarityTools[asset.name]["rarityScore"];
              }

              state.all_nfts = state.all_nfts.concat(nft_info);
            }
          }
        });

        if (cardaworld_counter == 0) {
          setState({
            formHidden: false,
            buttonLabel: "Search",
            notFoundText:
              "CardaWorlds not found for this address. Please check the address or try again.",
            all_nfts: state.all_nfts,
          });
        } else {
          setState({
            formHidden: false,
            buttonLabel: "Search",
            notFoundText: "",
            all_nfts: state.all_nfts,
          });
        }
      })

      .catch((err) => {
        console.log(err);
        // window.alert("Please enter a valid address");
        setState({
          formHidden: false,
          buttonLabel: "Search",
          notFoundText:
            "CardaWorlds not found for this address. Please check the address or try again.",
        });
      });
  } else {
    setState({
      formHidden: false,
      buttonLabel: "Search",
      notFoundText:
        "CardaWorlds not found for this address. Please enter a valid address.",
    });
    console.log("Please enter a valid address");
    //window.alert("Please enter a valid address");
  }

  setState({ all_nfts: [] });
}

function getNftDetails(rarityTools, allNfts, assetID) {
  fetch(server_url + "/CheckAsset/" + assetID, {
    dataType: "jsonp",
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      var metadata = response.onchain_metadata;
      var image_ipfs = metadata.image.replace("ipfs://", "");
      var imageURL = "https://infura-ipfs.io/ipfs/" + image_ipfs;
      var nft_info = {
        asset_id: response.asset,
        asset_name: response.name,
        name: metadata.name,
        imageURL: imageURL,
        rarities: metadata["rare biomes"],
        moons: metadata["moons"],
        galaxyType: metadata["galaxy type"],
        viewerIpfs: metadata.files[0].src.replace("ipfs://", ""),
        rings: metadata.rings,
        planetType: metadata["planet type"],
        planetName: metadata["planet name"],
        planetSize: metadata["planet size"],
        atmosphere: metadata["atmosphere"],
        rarityRank: "Unavailable",
        rarityScore: "Unavailable",
      };
      if (rarityTools) {
        nft_info["rarityRank"] = rarityTools[metadata.name.replace(" #", "")]["rarityRank"];
        nft_info["rarityScore"] = rarityTools[metadata.name.replace(" #", "")]["rarityScore"];
      }
      if (response.quantity > 0) {
        setState({
          all_nfts: allNfts.concat(nft_info),
          formHidden: false,
          buttonLabel: "Search",
          notFoundText: "",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function setState(settings) {
  if (typeof settings.formHidden !== "undefined") {
    if (settings.formHidden) {
      form.style.display = "none";
      loader.style.display = "block";
    } else {
      form.style.display = "block";
      loader.style.display = "none";
    }
  }

  if (typeof settings.buttonLabel !== "undefined") {
    searchButton.innerHTML = settings.buttonLabel;
  }

  if (typeof settings.notFoundText !== "undefined") {
    notFound.innerHTML = settings.notFoundText;
  }

  if (typeof settings.dapps !== "undefined") {
    dapps.innerHTML = settings.dapps;
  }

  if (typeof settings.all_nfts !== "undefined") {
    const finalHtml = [];

    for (const nftId in settings.all_nfts) {
      const nft = settings.all_nfts[nftId];

      finalHtml.push(`<div class="asset">`);
      finalHtml.push(`<img src="${nft.imageURL}">`);
      finalHtml.push(`<h3>${nft.name}</h3>`);
      finalHtml.push(`<h4>${nft.planetName}</h4>`);
      finalHtml.push(`<p>Features</p>`);
      finalHtml.push(`<div class="features">`);
      if (nft.moons !== "No")
        finalHtml.push(`<div class="feature">Moons</div>`);
      if (nft.rings !== "No")
        finalHtml.push(`<div class="feature">Gyros</div>`);
      finalHtml.push(`<div class="feature">${nft.planetType}</div>`);
      finalHtml.push(`<div class="feature">${nft.galaxyType} Galaxy</div>`);
      finalHtml.push(`<div class="feature">${nft.atmosphere} Atmosphere</div>`);
      finalHtml.push(`<div class="feature">${nft.rarities}</div>`);
      finalHtml.push(`</div>`);
      finalHtml.push(`<p>Rarity</p>`);
      finalHtml.push(`<div class="features features__rarity">`);
      finalHtml.push(
        `<div class="feature">Rarity rank: ${nft.rarityRank}</div>`
      );
      finalHtml.push(
        `<div class="feature">Rarity score: ${nft.rarityScore}</div>`
      );
      finalHtml.push(`</div>`);
      finalHtml.push(`<div style="display: flex;gap: 30px;">`);
      finalHtml.push(
        `<a class="vr" href="https://www.jpg.store/asset/${nft.asset_id}" target="_blank" rel="noopener noreferrer">More Details</a>`
      );
      finalHtml.push(
        `<a class="vr" href="https://ipfs.cardaworlds.io/ipfs/${nft.viewerIpfs}" target="_blank" rel="noopener noreferrer">View in 3D</a>`
      );
      finalHtml.push(`</div>`);
      finalHtml.push(`</div>`);
    }

    assets.innerHTML = finalHtml.join("");
  }
}

function convertASCIItoHex(asciiVal) {
  const final = [];
  const vals = asciiVal.split("");

  for (let i = 0; i < vals.length; i++) {
    const asciiCode = vals[i].charCodeAt(0);
    const hexValue = asciiCode.toString(16);

    final.push(hexValue);
  }

  return final.join("");
}

const isBrowser = () => typeof window !== "undefined";

function getCardano() {
  const cardano = isBrowser() && window.cardano;
  return cardano;
}

async function instantiateDapps() {
  const cardano = getCardano();

  console.log(cardano)

  const existingWallets = cardano
    ? Object.keys(cardano).filter(
      (walletName) =>
        walletName === "nami" ||
        walletName === "eternl" ||
        walletName === "gerowallet" ||
        walletName === "flint"
    )
    : [];

  const toAdd = [];

  for (const wallet of existingWallets) {
    toAdd.push(`<button onclick="javascript:connectDapp('${wallet}')"><img src="${cardano[wallet].icon}"> Connect ${wallet}</button>`);
  }

  setState({ dapps: toAdd.join("") });
}

async function connectDapp(walletName) {
  setState({
    formHidden: true,
    buttonLabel: "Searching...",
  });

  const cardano = getCardano();

  if (cardano[walletName]) {
    const api = await cardano[walletName].enable();
    const usedAddresses = await api.getUsedAddresses();
    const unusedAddresses = await api.getUnusedAddresses();

    const policyId = "8dd5717e7d4d993019dbd788c19837910e3fcf647ab282f828c80a7a";

    const allAddresses = usedAddresses.concat(unusedAddresses);

    const usefulAddresses = [];

    for await (const a of allAddresses) {

      const response = await fetch(server_url + "/AssetsFromBytes/" + a, {
        dataType: "jsonp",
        method: "GET",
      });

      const json = await response.json();


      for (var i = 0; i < json.assets.length; i++) {
        const containsCarda = json.assets[i].filter(function (o) {
          return o.unit.startsWith(policyId);
        }).length > 0;

        if (containsCarda) {
          usefulAddresses.push(json.address);
        }
      }
    }

    var all_nfts = [];
    var cardaworld_counter = 0;

    console.log(rarityTools)
    
    for await (const address of usefulAddresses) {
      const response = await fetch(server_url + "/CheckPoolPm/" + address, {
        dataType: "jsonp",
        method: "GET",
      })
      
      const json = await response.json();
      
      json.tokens.map((asset) => {
        if (asset.policy.startsWith(policyId)) {
          if (asset.quantity > 0) {
            cardaworld_counter += 1;

            var encoded = convertASCIItoHex(asset.name);
            var asset_id = policyId + encoded;
            var metadata = asset.metadata;
            var image_ipfs = metadata.image.replace("ipfs://", "");
            var imageURL = "https://infura-ipfs.io/ipfs/" + image_ipfs;
            var nft_info = {
              asset_id: asset_id,
              description: metadata.description,
              name: metadata.name,
              imageURL: imageURL,
              rarities: metadata["rare biomes"],
              moons: metadata["moons"],
              galaxyType: metadata["galaxy type"],
              viewerIpfs: metadata.files[0].src.replace("ipfs://", ""),
              rings: metadata.rings,
              planetType: metadata["planet type"],
              planetName: metadata["planet name"],
              planetSize: metadata["planet size"],
              atmosphere: metadata["atmosphere"],
              rarityRank: "Unavailable",
              rarityScore: "Unavailable",
            };

            if (rarityTools) {
              nft_info["rarityRank"] = rarityTools[asset.name]["rarityRank"];
              nft_info["rarityScore"] = rarityTools[asset.name]["rarityScore"];
            }

            all_nfts = all_nfts.concat(nft_info);
          }
        }
      });
    }

    console.log(all_nfts)

    if (cardaworld_counter == 0) {
      setState({
        formHidden: false,
        buttonLabel: "Search",
        notFoundText:
          "CardaWorlds not found for this address. Please check the address or try again.",
        all_nfts: all_nfts,
      });
    } else {
      setState({
        formHidden: false,
        buttonLabel: "Search",
        notFoundText: "",
        all_nfts: all_nfts,
      });
    }
  }
}

instantiateDapps()