console.log("Loaded background google coin flip thing");

// Wait for a specific amount of ms
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

let fakeCoin;
let newStartButton;
let flipping = false;

async function flipCoin() {
    if (flipping)
        return null;

    flipping = true;

    const numSides = 18;
    const headsIndex = 0;
    const tailsIndex = 9;
    
    targetIndex = tailsIndex;
    
    const numRotations = getRandomInt(1, 3);
    // const timeForCoinToRotate = getRandomInt(1250, 1500); // 1250
    // const timeForCoinToRotate = 2500;
    const timeForCoinToRotate = 2500 / numRotations;
    
    const headsLabel = document.querySelector('div[jsname="DyVWtc"]');
    const tailsLabel = document.querySelector('div[jsname="va93q"]');

    headsLabel.style.opacity = "0";
    tailsLabel.style.opacity = "0";
    headsLabel.style.transition = "opacity 1s";
    tailsLabel.style.transition = "opacity 1s";

    if (fakeCoin == undefined) {
        coinFlipCanvas = document.querySelector('canvas[jsname="UzWXSb"]');
        coinFlipSheet = document.querySelector('img[jsname="gtVczb"]');
        startButtonParent = document.querySelector('button[jsname="prQWAb"]').parentElement;
        

        console.log(coinFlipSheet);
        
        if (coinFlipCanvas == undefined) {
            console.log("Can't find coinflip");
            return;
        }
        
        coinFlipSheet.remove();

        // while (startButtonParent.firstChild) {
            // startButtonParent.removeChild(startButtonParent.lastChild);
            // startButtonParent
        // }
        for (child of startButtonParent.children) {
            console.log(child);
            child.style.display = "none";
        }

        newStartButton = document.createElement("button");
        newStartButton.classList.add("kIGsIe");
        newStartButton.ariaHidden = false;
        
        newStartButton.addEventListener("click", async () => {
            await flipCoin();
        });

        startButtonParent.appendChild(newStartButton);
        
        // childList = coinFlipCanvas.parentElement.parentElement.childNodes;
        // coinFlipSheet = childList[childList.length-1].firstChild.src;
        // console.log(coinFlipSheet);
        // console.log(coinFlipCanvas);
        
        wrapper = document.createElement("div");
        wrapper.classList.add("CoinFlipWrapper");
        
        fakeCoin = document.createElement("img");
        fakeCoin.classList.add("CoinToFlip");
        fakeCoin.src = "/logos/fnbx/coin_flip/coin_sheet.png";
        fakeCoin.width = "150";
        fakeCoin.style.width = "150px";
        
        // t = 0;
        // while (coinFlipCanvas.width != 150) {
        //     t++;
        //     if (t > 20) return;
        
        //     await delay(100);
        // }
        
        wrapper.appendChild(fakeCoin)
        coinFlipCanvas.parentElement.appendChild(wrapper);
        
        coinFlipCanvas.remove();
        // coinFlipCanvas.style.display = "none";
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

    targetUnix = Date.now() + (numRotations * timeForCoinToRotate);
    i = -1;
    numFlips = 0;
    timesToRotate = (numRotations * numSides * 2) + targetIndex + 2;
    // timesToRotate = 100
    console.log(timesToRotate);
    while (true) {
        timesToRotate--;
        if (timesToRotate == 0) break;
        await delay( ((targetUnix - Date.now()) / timesToRotate) - 0 );
        // i++;
        // i = (i % numSides)+1
        i = ( (i+1) % (numSides) )
        if (i == 0) {
            numFlips++;
        }
        
        // console.log(i);
        
        fakeCoin.style.transformOrigin = "50%" + ((150 * i) + 75) + "px";
        // fakeCoin.style.transformOrigin = (150 * i) + 75 + "px 50%";
        fakeCoin.style.top = "-" + 150 * i + "px";
        
        // fakeCoin.style.transformOrigin = "75px 225px";
        // fakeCoin.style.top = "-150px";
        
        // fakeCoin.style.transform = "translateY(-" + 150 * i + "px)"
        // if (i == targetIndex && animationEnded) {
            //     console.log(i, numFlips)
            //     // clearInterval(interval);
            //     break;
        // }
    }

    fakeCoin.classList.remove("CoinFlipping");

    await delay(100);
    
    headsLabel.style.opacity = "1";
    tailsLabel.style.opacity = "1";

    tailsLabel.ariaHidden = !(targetIndex == tailsIndex);
    headsLabel.ariaHidden = !(targetIndex == headsIndex);

    newStartButton.innerText = "Flip Again";
    newStartButton.style.cursor = "pointer";
    newStartButton.animate([{ "opacity": "0" }, { "opacity": "1" }], {"duration": 500});

    // if (targetIndex == tailsIndex) answerText.innerText = "Tails"
    // else answerText.innerText = "Heads";

    flipping = false;
}

(async() => {
    await flipCoin();

    // startButton = document.querySelector('button[jsname="prQWAb"]');
    // startButton.addEventListener("click", async () => {
    //     await flipCoin();
    // });
})();