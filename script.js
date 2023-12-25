const words = ['Apple', 'Strawberry', 'Mango', 'Blackberry', 'Blueberry', 'Orange'];
const hangmanGraphics = [
    `
     ------
     |    |
     |
     |
     |
     |
    ---`,
    `
     ------
     |    |
     |    O
     |
     |
     |
    ---`,
    `
     ------
     |    |
     |    O
     |    |
     |
     |
    ---`,
    `
     ------
     |    |
     |    O
     |   /|
     |
     |
    ---`,
    `
     ------
     |    |
     |    O
     |   /|\\
     |
     |
    ---`,
    `
     ------
     |    |
     |    O
     |   /|\\
     |   /
     |
    ---`,
    `
     ------
     |    |
     |    O
     |   /|\\
     |   / \\
     |
    ---`
];
let selectedWord = '';
let guessedLetters = [];
let mistakes = 0;
let maxMistakes;

window.onload = function() {
    resetGame();
    document.getElementById('guessButton').addEventListener('click', makeLetterGuess);
    document.getElementById('guessWordButton').addEventListener('click', makeWordGuess);
    document.getElementById('resetButton').addEventListener('click', resetGame);
    document.getElementById('userGuess').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            makeLetterGuess();
        }
    });
    document.getElementById('userWordGuess').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            makeWordGuess();
        }
    });
};

function resetGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedLetters = [];
    mistakes = 0;
    maxMistakes = Math.min(selectedWord.length - 1, 5);
    document.getElementById('wordToGuess').innerText = '_ '.repeat(selectedWord.length);
    document.getElementById('lettersGuessed').innerText = 'Letters Guessed: ';
    document.getElementById('guessesRemaining').innerText = `Guesses Remaining: ${maxMistakes}`;
    document.getElementById('hangmanDrawing').innerText = hangmanGraphics[mistakes];
    document.getElementById('userGuess').value = '';
    document.getElementById('userWordGuess').value = '';
    document.getElementById('userGuess').focus();
    document.getElementById('guessButton').disabled = false;
    document.getElementById('guessWordButton').disabled = false;
    hideMessage();
}

function makeLetterGuess() {
    const guessInput = document.getElementById('userGuess');
    const guessedLetter = guessInput.value.toUpperCase();
    guessInput.value = '';

    if (guessedLetter.length !== 1 || !/^[A-Z]$/i.test(guessedLetter)) {
        showMessage('Please enter a single letter.');
        return;
    }

    if (!guessedLetters.includes(guessedLetter)) {
        guessedLetters.push(guessedLetter);
        if (!selectedWord.includes(guessedLetter)) {
            mistakes++;
            document.getElementById('hangmanDrawing').innerText = hangmanGraphics[mistakes];
        }
        updateWordDisplay();
        updateGuessedLettersDisplay();
        updateMistakesDisplay();
        checkGameStatus();
    } else {
        showMessage('You already guessed that letter.');
    }
}

function makeWordGuess() {
    const guessInput = document.getElementById('userWordGuess');
    const guessedWord = guessInput.value.toUpperCase();
    guessInput.value = '';

    if (guessedWord.length < 1) {
        showMessage('Please enter a word.');
        return;
    }

    if (guessedWord === selectedWord) {
        guessedLetters = Array.from(selectedWord);
        updateWordDisplay();
        showMessage('Congratulations! You guessed the word: ' + selectedWord);
        document.getElementById('guessButton').disabled = true;
        document.getElementById('guessWordButton').disabled = true;
    } else {
        showMessage('Incorrect! The correct word was: ' + selectedWord);
        document.getElementById('guessButton').disabled = true;
        document.getElementById('guessWordButton').disabled = true;
        // Display the full hangman graphic
        document.getElementById('hangmanDrawing').innerText = hangmanGraphics[hangmanGraphics.length - 1];
    }
}

function updateWordDisplay() {
    const wordDisplay = document.getElementById('wordToGuess');
    wordDisplay.innerText = selectedWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
}

function updateGuessedLettersDisplay() {
    document.getElementById('lettersGuessed').innerText = 'Letters Guessed: ' + guessedLetters.join(', ');
}

function updateMistakesDisplay() {
    document.getElementById('guessesRemaining').innerText = `Guesses Remaining: ${maxMistakes - mistakes}`;
}

function checkGameStatus() {
    if (mistakes > maxMistakes) {
        showMessage('Game Over! The correct word was: ' + selectedWord);
        document.getElementById('guessButton').disabled = true;
        document.getElementById('guessWordButton').disabled = true;
        // Display the full hangman graphic
        document.getElementById('hangmanDrawing').innerText = hangmanGraphics[hangmanGraphics.length - 1];
    } else if (!selectedWord.split('').some(letter => !guessedLetters.includes(letter))) {
        showMessage('Congratulations! You guessed the word: ' + selectedWord);
        document.getElementById('guessButton').disabled = true;
        document.getElementById('guessWordButton').disabled = true;
    }
}

function showMessage(message) {
    const messageElement = document.getElementById('gameMessage');
    messageElement.textContent = message;
    messageElement.classList.remove('hidden');
    messageElement.classList.add('visible');
}

function hideMessage() {
    const messageElement = document.getElementById('gameMessage');
    messageElement.classList.remove('visible');
    messageElement.classList.add('hidden');
}
