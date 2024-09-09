let body = document.querySelector("body");
let header = document.querySelector("#header");

//OPTION IMG FILES
const imgBob = "images/bob.gif";

//OPTION AUDIO FILES
const soundUhh = new Audio("sounds/uhh.mp3");
const soundBob = new Audio("sounds/bobScream.mp3");
const soundBobFound = new Audio("sounds/bobFound.mp3");

//OPTION ELEMENTS
let selectOpt = [
    "Cow",
    "Crocodile",
    "Cat",
    "Bred",
    "Bob",
    "Bear",
    "Dog",
    "Shoebill",
];
selectOpt.sort();

let selectDiv = document.querySelector("#itemSelect");

selectOpt.map((value, _) => createOpt(value));

function createOpt(value) {
    const newOption = document.createElement("option");
    newOption.value = value;
    newOption.text = value;
    selectDiv.appendChild(newOption);
};

//FORM REFERENCES
let selection = document.querySelector("#selection");
let form = document.querySelector("#submitForm");
let formName = document.querySelector("#itemName");
let formFile = document.querySelector("#myFile");
let formSubmit = document.querySelector("#submit");

//CENTER PAGE REFERENCES
let centerBox = document.querySelector("#center");
const centerBoxWidth = centerBox.clientWidth;
const centerBoxHeight = centerBox.clientHeight;
let startBox = document.querySelector("#startBox");
let selectedItem = document.querySelector("#selectedItem");
let centerWave = document.querySelector("#centerWave");
let centerTap = document.querySelector("#centerTap");
let centerShout = document.querySelector("#soundPara");
let imgSpeaker = document.querySelector("#speaker");
let start = document.querySelector("#start");

//FOOTER REFERENCES
let reference =  document.querySelector("#reference");
let creator = document.querySelector("#creator");

//SCRIPT
function playItemSound(src) {
    src.currentTime = 0;
    src.play();
};

selectedItem.style.color = "blue";
selectedItem.addEventListener("click", () => playItemSound(soundUhh)); //FIX SOUND TO DYNAMIC

centerShout.style.color = "blue";
centerShout.addEventListener("click", () => playItemSound(soundUhh)); //FIX SOUND TO DYNAMIC

//UPDATE HEADER
function updateHeader() {
    selection.style.display = "none";
    form.style.display = "none";
    startBox.style.display = "none";

    const playHeader = document.createElement("p");
    playHeader.textContent = `Looking for ${selectedItem.textContent}`;
    header.appendChild(playHeader);
};

//CALULATE VOLUME SPECTRUM
function calculateVolume(distance, maxDistance) {
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    return 1 - normalizedDistance; // adjust formula as needed for your desired effect
};

//UPDATE MOUSE EVENET
function updateMouseEvent(event, audio, playImg) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate body center
    const bodyRect = centerBox.getBoundingClientRect();
    const bodyCenterX = bodyRect.left + bodyRect.width / 2;
    const bodyCenterY = bodyRect.top + bodyRect.height / 2;

    // Calculate image center
    const imgRect = playImg.getBoundingClientRect();
    const imageCenterX = imgRect.left + imgRect.width / 2;
    const imageCenterY = imgRect.top + imgRect.height / 2;

    //Calculate distance from mouse to body center
    const bodyDistance = Math.sqrt(Math.pow(mouseX - bodyCenterX, 2) + Math.pow(mouseY - bodyCenterY, 2));
    const bodyMaxDistance = Math.max(bodyRect.width, bodyRect.height) / 2;

    // Calculate distance from mouse to image center
    const imgDistance = Math.sqrt(Math.pow(mouseX - imageCenterX, 2) + Math.pow(mouseY - imageCenterY, 2));
    const imgMaxDistance = Math.max(imgRect.width, imgRect.height) / 2;
    
    // Map distance to volume (0-1)
    const volume = calculateVolume(imgDistance, bodyMaxDistance);
    audio.volume = volume;
    audio.play();
    audio.loop = true; //LOOP AUDIO WITH MOUSE MOVEMENT AROUND IMAGE

    console.log("Image Distance:", imgDistance);
    console.log("Body Distance:", bodyDistance);

    console.log("Volume:", volume);
    console.log('mousemove event fired')
};

//PLAY GAME FUNCTION
function play(src, audio, audioFound) {
    updateHeader();

    //UPDATE IMAGE
    const playImg = document.createElement("img");
    playImg.src = src;
    centerBox.appendChild(playImg);

    playImg.style.opacity = "0"; //CHANGE TO "0" FOR INVISIBILITY TO BE FOUND
    playImg.style.position = "absolute";

    playImg.onload = () => {
        //RANDOMIZE IMAGE PLACEMENT
        const imgWidth = playImg.clientWidth;
        const imgHeight = playImg.clientHeight;

        const maxLeft = centerBoxWidth - imgWidth;
        const maxTop = centerBoxHeight - imgHeight;

        playImg.style.left = Math.floor(Math.random() * maxLeft) + "px";
        playImg.style.top = Math.floor(Math.random() * maxTop) + "px";

        let isFound = false;
        //PLAYS updateMouseEvent
        centerBox.addEventListener("mousemove", (event) => {
            if (isFound == false) {
                updateMouseEvent(event, audio, playImg);
            } else {
                audio.pause();
                audio.volume = 0;
            }

            playImg.addEventListener("mouseover", () => {
                isFound = true;
                endGame(playImg, audioFound);
            }); //FIX SOUNDS TO DYNAMIC
        });


        //PAUSES AUDIO WHEN MOUSE LEAVES VIEWPORT
        centerBox.addEventListener('mouseleave', () => {
            audio.pause();
        });
    };      
};

function endGame(playImg, audioFound) {
    playImg.style.opacity = "1";
    playItemSound(audioFound);
};

//GAME START BUTTON
start.addEventListener("click", () => {
    play(imgBob, soundBob, soundBobFound)
}); //FIX IMAGE & AUDIO TO DYNAMIC