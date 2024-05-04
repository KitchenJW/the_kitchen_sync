const piclist = [
    "images/AMCI.jpg",
    "images/Archibald Motley_Nightlife_1943.jpg",
    "images/Archibald Motley_Saturday_Night_1935.jpg",
    "images/camp.jpg",
    "images/highlake.jpg",
    "images/Killin.png",
    "images/misticswamp.jpg",
    "images/mount.jpg",
    "images/soundgirl.jpg",
    "images/swimmer.jpg",
    "images/stuff.jpg",
    "images/bike.jpg",
    "images/city.jpg",
    "images/ducklings.png",
    "images/fence.jpg",
    "images/grapes.jpg",
    "images/labrador.jpg",
    "images/minecraft.jpg",
    "images/dragon.jpg",
    "images/sbslogo.png",
    "images/van.jpg",
];
const puzzle = document.querySelector("#puzzle");
let audioElement = new Audio();
let originalImage = [];
let bgcolor = (document.querySelector("body").style.backgroundColor =
    getBackgroundColor());
let score = 0;
let highscore = 0;
let gameTime = null;
let stopClock = false;
let oMinutes = 5,
    oSeconds = 1;
let minutes = oMinutes,
    seconds = oSeconds;
let pic = parseInt(Math.random() * piclist.length);
let numSquares = 3;
let img = new Image();
let maxWidth = 800;
let maxHeight = 500;
let imgOriginalWidth = img.width;
let imgOriginalHeight = img.height;
let pieceWidth = parseInt(imgOriginalWidth / numSquares);
let pieceHeight = parseInt(imgOriginalHeight / numSquares);

const vid = document.getElementById("chg");
function setupVideo() {
    const playButton = document.getElementById("play");
    const btnPanel = document.getElementById("video-controls");
    playButton.onclick = function () {
        vid.play();
        btnPanel.style.display = "none";
        setTimeout(() => {
            hideVideo();
            startGame();
        }, 14500);
    };
}

setupVideo();

function hideVideo() {
    const videoContainer = document.querySelector(".video-container");
    videoContainer.className = "hidden";
}
function startGame() {
    document.querySelector("main").className = "";
    img.src = piclist[pic];
    img.onload = makePuzzle;
}
// setTimeout(() => { titlePage() }, 5000);
//start game after 5 seconds

function requestSpotifyToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const data = {
        grant_type: 'client_credentials',
        client_id: '1c3732984774417c8ebe8095c2affb10',
        client_secret: 'd13d57b5542740bcbdfc534660419f27'
    };

    const searchParams = Object.keys(data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
}

// function to slice the puzzle based on the size of the original image and
// the number of squares you want:
function makePuzzle() {
    puzzle.innerHTML = "";
    originalImage = [];
    // reset the puzzle dimensions:
    imgOriginalWidth = img.width;
    imgOriginalHeight = img.height;
    if (window.innerWidth < 800) {
        maxWidth = 400;
        maxHeight = 250;
    } else {
        maxWidth = 800;
        maxHeight = 500;
    }
    const scaleFactor = Math.min(
        maxHeight / imgOriginalHeight,
        maxWidth / imgOriginalWidth
    );
    // recalculate the width of the pieces:
    pieceWidth = parseInt(imgOriginalWidth / numSquares);
    pieceHeight = parseInt(imgOriginalHeight / numSquares);
    // invoke the set up function:
    initCSS(puzzle, numSquares);
    for (let col = 0; col < numSquares; col++) {
        for (let row = 0; row < numSquares; row++) {
            // 1. calculate the start of the puzzle slice:
            const x = row * pieceWidth;
            const y = col * pieceHeight;
            // 2. create a new canvas tag to hold the puzzle piece:
            const canvasID = `c_${col}${row}`;
            let piece = `
<div class="piece-holder"
style="width:${pieceWidth * scaleFactor}; height:${pieceHeight * scaleFactor};"
ondrop="drop(event)" ondragover="allowDrop(event)">
<canvas
id=${canvasID}
width="${pieceWidth * scaleFactor}"
height="${pieceHeight * scaleFactor}"
draggable="true"
ondragstart="drag(event)"></canvas>
</div>
`;
            // 3. add it to the DOM:
            puzzle.insertAdjacentHTML("beforeend", piece);
            // 4. draw the slice on the appropriate canvas element:
            const canvas = document.getElementById(canvasID);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                img,
                x,
                y,
                pieceWidth,
                pieceHeight,
                0,
                0,
                pieceWidth * scaleFactor,
                pieceHeight * scaleFactor
            );
            originalImage.push(canvasID);
        }
    }
    // after we draw all of the puzzle pieces, we need to
    // shuffle them:
    shuffle();
    document.querySelector("#score").innerHTML = score;
    showToolbar();
    clock();
}
function showToolbar() {
    document.querySelector("#toolbar").className = "";
}
function hideToolbar() {
    document.querySelector("#toolbar").className = "hidden";
}
//This function increases the difficulty at specific intervals
function nextLevel() {
    if (score > 0 && score % 25 === 0 && oMinutes > 0) {
        oMinutes--;
        numSquares += 1;
    }
    if (score > 0 && score % 100 === 0) {
        oMinutes += 2;
    }
    (minutes = oMinutes), (seconds = oSeconds);
    document.querySelector("#timer").style = "color:#630675";
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function shuffle() {
    const numShuffles = numSquares * 10;
    const puzzlePieces = document.querySelectorAll(".piece-holder");
    for (let i = 0; i < numShuffles; i++) {
        // grab a random piece from the pieces:
        const randomIndex = getRandomInt(puzzlePieces.length);
        const randomPiece = puzzlePieces[randomIndex];
        puzzle.appendChild(randomPiece);
    }
}
function getBackgroundColor() {
    const r = Math.floor(Math.random() * 175);
    const g = Math.floor(Math.random() * 175);
    const b = Math.floor(Math.random() * 175);
    console.log(r, g, b);
    return `rgb(${r}, ${g}, ${b})`;
}
// function that sets up the layout of each puzzle:
function initCSS(container, numSquares) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${numSquares}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${numSquares}, 1fr)`;
    container.style.border = "10px solid midnightblue";
    container.style.borderRadius = "10px";
}
// function that sets up the win/lose format of container
function initCSS2(container) {
    container.style.display = "flex";
    container.style.alignContent = "center";
    container.style.justifyContent = "center";
    container.style.border = "none";
}
function clock() {
    timeReset();
    document.querySelector("#timer").innerHTML = "";
    gameTime = setInterval(() => {
        seconds--;
        if (seconds == 0 && minutes > 0) {
            minutes--;
            seconds = 59;
        }
        if (minutes < 1) {
            document.querySelector("#timer").style = "color:red";
        }
        if (seconds < 10) {
            document.querySelector("#timer").innerHTML =
                minutes + ":0" + seconds;
        } else {
            document.querySelector("#timer").innerHTML =
                minutes + ":" + seconds;
        }
        if (minutes < 1 && seconds < 1) {
            //This stops the clock on a lose.
            timeReset();
            lose();
        }
        //This stops the clock on a win
        if (
            document.querySelector("#puzzle").innerHTML ==
            `<img src="${img.src}">`
        ) {
            timeReset();
        }
    }, 1000);
}
function timeReset() {
    if (gameTime !== null) {
        clearInterval(gameTime);
    }
    gameTime = null;
}
function makeNewPuzzle() {
    pic = parseInt(Math.random() * piclist.length);
    img = new Image();
    img.src = piclist[pic];
    numSquares = numSquares;
    bgcolor = document.querySelector("body").style.backgroundColor =
        getBackgroundColor();
    img.onload = makePuzzle;
}
function lose() {
    if (score > highscore) {
        highscore = score;
    }
    document.querySelector(
        "#puzzle"
    ).innerHTML = `<h2 id="message">Nice Try Dude!</h2>
<section id="highscore"><h1>High Score = </h1>
<div>${highscore}</div>
</section>
<audio autoplay>
    <source src="sounds/evil_laugh.mp3" type="audio/mp3">
</audio>
<button id="restart" onclick="restart()">Restart</button>
`;
    document.querySelector("#score").innerHTML = score;
    initCSS2(puzzle);
}
function restart() {
    score = 0;
    (oMinutes = 5), (oSeconds = 1);
    (minutes = oMinutes), (seconds = oSeconds);
    document.querySelector("#timer").style = "color:white";
    pic = parseInt(Math.random() * piclist.length);
    img = new Image();
    img.src = piclist[pic];
    numSquares = numSquares;
    bgcolor = document.querySelector("body").style.backgroundColor =
        getBackgroundColor();
    img.onload = makePuzzle;
}
function resetPuzzle() {
    // stopClock = true;
    timeReset();
    makePuzzle();
}
function showMenu() {
    document.querySelector("#browse").className = "";
    document.querySelector("#menu").className = "hidden";
}
function hideMenu() {
    document.querySelector("#browse").className = "hidden";
    document.querySelector("#menu").className = "";
}
function picChoice() {
    timeReset();
    document.querySelector(
        "#browse"
    ).innerHTML = `<input type="file" id="imageLoader" onchange="userChoice(event)" />`;
}
function musicChoice() {
    timeReset();
    document.querySelector(
        "#browse"
    ).innerHTML = `<input type="file" id="musicLoader" onchange="loadAudio(event)" />`;
}
function browseDefault() {
    document.querySelector(
        "#browse"
    ).innerHTML = `<button id="pics" onclick="picChoice()">PICS</button>
<button id="music" onclick="musicChoice()">MUSIC</button>
<div>
<button id="musicOff" onclick="stop()">Stop</button>
<button id="musicOn" onclick="play()">Play</button>
</div>`;
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    const parentOfSource = document.getElementById(data).parentElement;
    const parentOfTarget = ev.target.parentElement;
    parentOfSource.appendChild(ev.target);
    parentOfTarget.appendChild(document.getElementById(data));
    let matches = 0;
    for (let i = 0; i < originalImage.length; i++) {
        const puzzlePieces = document.querySelectorAll(".piece-holder canvas");
        if (originalImage[i] == puzzlePieces[i].id) {
            matches++;
        }
    }
    if (matches == originalImage.length) {
        score++;
        nextLevel();
        document.querySelector("#puzzle").innerHTML = `<img src="${img.src}">
<button class = "next" onClick = "makeNewPuzzle()">Next
Puzzle</button>`;
        hideToolbar();
        document.querySelector("#score").innerHTML = score;
        initCSS2(puzzle);
        timeReset();
    }
}
// new code:
function userChoice(ev) {
    //set global variable to true:
    // stopClock = true;
    var reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = function (event) {
        img = new Image();
        img.src = event.target.result;
        img.onload = makePuzzle;
        browseDefault();
        hideMenu();
    };
}
// end new code
// New code:
const modalElement = document.querySelector(".modal-bg");
document.querySelector(".open").focus();
function showModalWithImage() {
    // show modal:
    modalElement.classList.remove("hidden");
    // accessibility features:
    modalElement.setAttribute("aria-hidden", "false");
    document.querySelector(".close").focus();
    hideToolbar();
    // update picture:
    document.querySelector(
        ".modal-body"
    ).innerHTML = `<img src="${img.src}" />`;
}
function closeModal() {
    // hide modal:
    modalElement.classList.add("hidden");
    // accessibility features:
    modalElement.setAttribute("aria-hidden", "false");
    document.querySelector(".open").focus();
    showToolbar();
}
function loadAudio(ev) {
    var reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = function (event) {
        audioElement.setAttribute("src", event.target.result);
        audioElement.play();
        browseDefault();
        clock();
        hideMenu();
    };
}
function stop() {
    audioElement.pause();
    hideMenu();
}
function play() {
    audioElement.play();
    hideMenu();
}
