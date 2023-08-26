// Wait for a specific amount of ms
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function getData(key){ return new Promise(resolve => { chrome.storage.local.get(key, function (data) { resolve(Object.values(data)[0]); }); }); }
async function storeData(key, value){ await chrome.storage.local.set({[key]: value}); }

async function getMultipleDataValues(keys){ return new Promise(resolve => { chrome.storage.local.get(keys, function (data) { resolve(data); }); }) }
async function storeMultipleDataValues(keys){ await chrome.storage.local.set(keys); }

// Get local settings
async function getSettings() {
    settings = await getMultipleDataValues(settingsKeys);

    for (var i = 0; i < settingsKeys.length; i++) {
        thisKey = settingsKeys[i];
        thisValue = settings[thisKey];
        if (thisValue == undefined) {
            settings[thisKey] = settingsDefaultValues[i];
            await storeData(thisKey, thisValue);
        }
    }

    return settings;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


const settingsKeys = [
    'extensionEnabled',
    'targetHeads'
];
const settingsDefaultValues = [
    true,
    true
];

let fakeCoin;
let newStartButton;
let settings;
let currentlyFlippedAtIndex = 0;
let flipping = false;

async function flipCoin() {
    if (flipping)
        return null;

    flipping = true;

    const numSides = 18;
    const headsIndex = 0;
    const tailsIndex = 9;
    
    // To update if it changes in the action menu
    if (await getData("targetHeads") == true) {
        targetIndex = headsIndex
    } else {
        targetIndex = tailsIndex;
    }
    
    const numRotations = getRandomInt(1, 3);
    const timeForCoinToRotate = 2500 / numRotations;
    
    const headsLabel = document.querySelector('div[jsname="DyVWtc"]');
    const tailsLabel = document.querySelector('div[jsname="va93q"]');

    headsLabel.style.opacity = "0";
    tailsLabel.style.opacity = "0";
    headsLabel.style.transition = "opacity 1s";
    tailsLabel.style.transition = "opacity 1s";

    // Create the fake coin and the "flipping" text
    if (fakeCoin == undefined) {
        coinFlipCanvas = document.querySelector('canvas[jsname="UzWXSb"]');
        coinFlipSheet = document.querySelector('img[jsname="gtVczb"]');
        startButtonParent = document.querySelector('button[jsname="prQWAb"]').parentElement;
        
        if (coinFlipCanvas == undefined) {
            console.log("Can't find coinflip");
            return;
        }
        
        coinFlipSheet.remove();

        while (startButtonParent.firstChild) {
            startButtonParent.removeChild(startButtonParent.lastChild);
            startButtonParent
        }

        newStartButton = document.createElement("button");
        newStartButton.classList.add("kIGsIe");
        newStartButton.ariaHidden = false;
        
        newStartButton.addEventListener("click", async () => {
            await flipCoin();
        });

        startButtonParent.appendChild(newStartButton);
        
        wrapper = document.createElement("div");
        wrapper.classList.add("CoinFlipWrapper");

        fakeCoin = document.createElement("img");
        fakeCoin.classList.add("CoinToFlip");
        fakeCoin.src = "/logos/fnbx/coin_flip/coin_sheet.png";
        fakeCoin.width = "150";
        fakeCoin.style.width = "150px";
        
        wrapper.appendChild(fakeCoin);
        coinFlipCanvas.parentElement.appendChild(wrapper);
        
        coinFlipCanvas.remove();
    }
        
    newStartButton.innerText = "Flipping...";
    newStartButton.style.cursor = "inherit";

    newStartButton.animate([{ "opacity": "0" }, { "opacity": "1" }], {"duration": 500});
    
    
    fakeCoin.style.animationIterationCount = numRotations.toString();
    fakeCoin.style.animationDuration = timeForCoinToRotate + "ms";
    
    if (Math.round(Math.random()) == 1) {
        fakeCoin.style.animationDirection = "reverse";
    } else {
        fakeCoin.style.animationDirection = "normal";
    }
    
    fakeCoin.classList.add("CoinFlipping");

    i = currentlyFlippedAtIndex-1;
    targetUnix = Date.now() + (numRotations * timeForCoinToRotate);
    timesToRotate = (numRotations * numSides * 2) + targetIndex - currentlyFlippedAtIndex + 2;

    // Flip the coin
    while (true) {
        timesToRotate--;
        if (timesToRotate == 0) break;

        i = ( (i+1) % (numSides) )
        
        fakeCoin.style.transformOrigin = "50% " + ((150 * i) + 75) + "px";
        fakeCoin.style.top = "-" + 150 * i + "px";

        await delay( ((targetUnix - Date.now()) / timesToRotate) - 0 );
    }

    currentlyFlippedAtIndex = targetIndex;
    fakeCoin.classList.remove("CoinFlipping");

    await delay(100);
    
    headsLabel.style.opacity = "1";
    tailsLabel.style.opacity = "1";

    tailsLabel.ariaHidden = !(targetIndex == tailsIndex);
    headsLabel.ariaHidden = !(targetIndex == headsIndex);

    newStartButton.innerText = "Flip Again";
    newStartButton.style.cursor = "pointer";
    newStartButton.animate([{ "opacity": "0" }, { "opacity": "1" }], {"duration": 500});

    flipping = false;
}

(async() => {
    settings = await getSettings();

    if (!settings.extensionEnabled) {
        return;
    }

    await flipCoin();
})();