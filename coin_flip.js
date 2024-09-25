// Wait for a specific amount of ms
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Store and get local extension data
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
            await storeData(thisKey, settingsDefaultValues[i]);
            console.log(thisKey, settingsDefaultValues[i]);
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
    'targetHeads',
    'hotkeysEnabled'
];
const settingsDefaultValues = [
    true,
    true,
    true,
];

let fakeCoin;
let newStartButton;
let settings;
let currentlyFlippedAtIndex = 0;
let flipping = false;

// Defines where is the tails side and the heads side in the sprite sheet
const numSides = 18;
const headsIndex = 0;
const tailsIndex = 9;

// Actually flip the coin and create a fake coin
async function flipCoin() {
    // If we are already flipping then don't start
    if (flipping)
        return null;
    
    flipping = true;
    
    // To update if the option changes in the action menu
    if (await getData("targetHeads") == true) {
        targetIndex = headsIndex
    } else {
        targetIndex = tailsIndex;
    }
    
    // Defines the information for this specific flip
    const numRotations = getRandomInt(1, 3);
    const timeForCoinToRotate = 2500 / numRotations;
    
    // Get the heads and tails label
    const headsLabel = document.querySelector('h3[jsname="DyVWtc"]');
    const tailsLabel = document.querySelector('h3[jsname="va93q"]');

    // Hide both the labels
    headsLabel.style.opacity = "0";
    tailsLabel.style.opacity = "0";
    headsLabel.style.transition = "opacity 1s";
    tailsLabel.style.transition = "opacity 1s";

    // Create the fake coin and the "flipping" text
    if (fakeCoin == undefined) {
        // Get the original coin flip canvas and sheet
        coinFlipCanvas = document.querySelector('canvas[jsname="UzWXSb"]');
        coinFlipSheet = document.querySelector('img[jsname="gtVczb"]');
        startButtonParent = document.querySelector('div[jsname="prQWAb"]').parentElement; // So we can create a fake start button
        
        if (coinFlipCanvas == undefined) {
            flipping = false;
            return;
        }
        
        coinFlipSheet.remove();

        // Remove all children of the start button
        while (startButtonParent.firstChild) {
            startButtonParent.removeChild(startButtonParent.lastChild);
        }

        // create the fake start button
        newStartButton = document.createElement("button");
        newStartButton.classList.add("kIGsIe");
        newStartButton.ariaHidden = false;
        
        // Start flipping the coin on click
        newStartButton.addEventListener("click", async () => {
            await flipCoin();
        });

        startButtonParent.appendChild(newStartButton);
        
        wrapper = document.createElement("div");
        wrapper.classList.add("CoinFlipWrapper");

        // Load the sprite sheet
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
    
    // The coin can flip clockwise or counter-clockwise
    if (Math.round(Math.random()) == 1) {
        fakeCoin.style.animationDirection = "reverse";
    } else {
        fakeCoin.style.animationDirection = "normal";
    }
    
    // The coin is now flipping
    fakeCoin.classList.add("CoinFlipping");

    // Calculate the number of times to rotate in the specified amount of time
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

    currentlyFlippedAtIndex = targetIndex; //  So we can start at this index next flip
    fakeCoin.classList.remove("CoinFlipping"); // No longer flipping

    // Wait a second to display the results as text
    await delay(100);
    
    // Display the heads or tails label below the coin
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
    // If we can't find the coin then don't load
    if (document.querySelector('canvas[jsname="UzWXSb"]') == undefined) {
        return;
    }

    // Check to see if the extension is actually enabled
    settings = await getSettings();
    if (!settings.extensionEnabled) {
        return;
    }

    await flipCoin();
})();

document.addEventListener("keypress", async (e) => {
    if (await getData("hotkeysEnabled") != true) return;

    switch (e.code) {
        case "KeyT":
            await storeData("targetHeads", false);
            break;
        case "KeyH":
            await storeData("targetHeads", true);
            break;
        default:
            return;
    }
});