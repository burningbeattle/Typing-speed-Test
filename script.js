const quoteDisplayElement = document.getElementById('quote');
const inputAreaElement = document.getElementById('input-area');
const timeLeftElement = document.getElementById('time-left');
const wpmElement = document.getElementById('wpm');
const restartButton = document.getElementById('restart-btn');

let timer;
let timeLeft = 60;
let wordCount = 0;

async function fetchQuote() {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return data.content;
}

async function renderNewQuote() {
    const quote = await fetchQuote();
    quoteDisplayElement.innerHTML = quote;
    inputAreaElement.value = null;
    inputAreaElement.disabled = false;
    inputAreaElement.focus();
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 60;
    timeLeftElement.innerText = timeLeft;
    wordCount = 0;
    wpmElement.innerText = 0;

    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            inputAreaElement.disabled = true;
            calculateWPM();
        }
    }, 1000);
}

function calculateWPM() {
    const words = inputAreaElement.value.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minutes = (60 - timeLeft) / 60;
    const wpm = Math.round(words / minutes);
    wpmElement.innerText = wpm;
}

inputAreaElement.addEventListener('input', () => {
    wordCount = inputAreaElement.value.trim().split(/\s+/).filter(word => word.length > 0).length;
    wpmElement.innerText = Math.round(wordCount / ((60 - timeLeft) / 60));
});

restartButton.addEventListener('click', renderNewQuote);

document.addEventListener('DOMContentLoaded', () => {
    renderNewQuote();
});
