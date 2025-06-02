// Configuration: 1 = Demo Mode, 0 = API Mode
const DEMO_MODE = 0;

// Base API URL
const API_BASE_URL = 'https://JeorgeC-FlashCardBackEnd.hf.space';

// Demo data
const demoFolders = [
    { folder_id: "1", folder_name: "Mathematics", total_flashcards: 15, total_correct: 45, total_incorrect: 15, total_challenges: 6 },
    { folder_id: "2", folder_name: "History", total_flashcards: 12, total_correct: 32, total_incorrect: 8, total_challenges: 4 },
    { folder_id: "3", folder_name: "Science", total_flashcards: 20, total_correct: 58, total_incorrect: 22, total_challenges: 8 },
    { folder_id: "4", folder_name: "English Literature", total_flashcards: 8, total_correct: 21, total_incorrect: 9, total_challenges: 3 },
    { folder_id: "5", folder_name: "Geography", total_flashcards: 18, total_correct: 40, total_incorrect: 20, total_challenges: 5 }
];

const demoFlashcards = {
    "1": [
        { question_id: "1", question: { text: "What is 2 + 2?", image_url: null }, answers: [{ text: "4", image_url: null }] },
        { question_id: "2", question: { text: "What is the derivative of x²?", image_url: null }, answers: [{ text: "2x", image_url: null }] },
        { question_id: "3", question: { text: "What is the square root of 64?", image_url: null }, answers: [{ text: "8", image_url: null }] },
        { question_id: "4", question: { text: "What is 15% of 200?", image_url: null }, answers: [{ text: "30", image_url: null }] },
        { question_id: "5", question: { text: "What is the area of a circle with radius 5?", image_url: null }, answers: [{ text: "25π or approximately 78.54", image_url: null }] }
    ]
};

// Global variables
let currentFolder = null;
let currentFlashcards = [];
let challengeIndex = 0;
let challengeResults = { correct: 0, incorrect: 0 };
let folders = [];
let questionResults = []; // Track each question's result
let currentReviewType = null; // Track current review type



// API functions
async function fetchFolders() {
    if (DEMO_MODE) {
        return demoFolders.sort((a, b) => a.folder_name.localeCompare(b.folder_name));
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/flashcard-lists`);
            const data = await response.json();
            console.log(data);
            return data.sort((a, b) => a.folder_name.localeCompare(b.folder_name));
        } catch (error) {
            console.error('Error fetching folders:', error);
            return [];
        }
    }
}

async function fetchFlashcards(folderId) {
    if (DEMO_MODE) {
        return demoFlashcards[folderId] || [];
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/flashcard-folder/${folderId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            return [];
        }
    }
}

async function markChallengeComplete(folderId, correct, incorrect) {
    if (!DEMO_MODE) {
        try {
            await fetch(`${API_BASE_URL}/done-challenge/${folderId}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correct, incorrect })
            });
        } catch (error) {
            console.error('Error marking challenge complete:', error);
        }
    }
}

// UI functions
function calculateWinRate(correct, incorrect) {
    const total = correct + incorrect;
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}


function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showMainPage() {
    showPage('mainPage');
    currentFolder = null;
}

function renderFolders(foldersToRender = folders) {
    const folderList = document.getElementById('folderList');
    folderList.innerHTML = '';
    
    foldersToRender.forEach(folder => {
        const folderItem = document.createElement('div');
        const winRate = calculateWinRate(folder.total_correct || 0, folder.total_incorrect || 0);
        const hasStats = (folder.total_correct || 0) + (folder.total_incorrect || 0) > 0;
        folderItem.className = 'folder-item';
        folderItem.onclick = () => showFolder(folder);
        
        folderItem.innerHTML = `
            <div class="folder-name">${folder.folder_name}</div>
            <div class="folder-stats">
                <div class="flashcard-count">${folder.total_flashcards} cards</div>
                ${hasStats ? `<div class="win-rate">Win Rate: ${winRate}%</div>` : '<div class="win-rate">No attempts yet</div>'}
            </div>
        `;
        
        folderList.appendChild(folderItem);
    });
}

async function showFolder(folder) {
    currentFolder = folder;
    document.getElementById('folderTitle').textContent = folder.folder_name;
    const winRate = calculateWinRate(folder.total_correct || 0, folder.total_incorrect || 0);
    const hasStats = (folder.total_correct || 0) + (folder.total_incorrect || 0) > 0;
    const winRateText = hasStats ? `${winRate}%` : 'No attempts yet';
    document.getElementById('folderWinRate').textContent = winRateText;
        
    const flashcards = await fetchFlashcards(folder.folder_id);
    currentFlashcards = flashcards;
    
    renderFlashcards(flashcards);
    showPage('folderPage');
}

function renderFlashcards(flashcards) {
    const flashcardList = document.getElementById('flashcardList');
    flashcardList.innerHTML = '';

    flashcards.forEach((flashcard, index) => {
        const question = flashcard.question || {};
        const answer = flashcard.answers[0] || {};

        const questionContent = question.text
            ? `<span>${question.text}</span>`
            : question.image_url
                ? `<img src="${question.image_url}" alt="Question Image" style="max-width: 100%; height: auto;">`
                : `<span>No question content</span>`;

        const answerContent = answer.text
            ? answer.text
            : answer.image_url
                ? `<img src="${answer.image_url}" alt="Answer Image" style="max-width: 100%; height: auto;">`
                : `No answer content`;

        const flashcardItem = document.createElement('div');
        flashcardItem.className = 'flashcard-item';

        flashcardItem.innerHTML = `
            <div class="flashcard-question" onclick="toggleAnswer(${index})">
                ${questionContent}
                <span class="expand-icon">▼</span>
            </div>
            <div class="flashcard-answer" id="answer-${index}">
                ${answerContent}
            </div>
        `;

        flashcardList.appendChild(flashcardItem);
    });
}


function toggleAnswer(index) {
    const answer = document.getElementById(`answer-${index}`);
    const icon = answer.previousElementSibling.querySelector('.expand-icon');
    
    answer.classList.toggle('show');
    icon.classList.toggle('expanded');
}

function startChallenge() {
    challengeIndex = 0;
    challengeResults = { correct: 0, incorrect: 0 };
    questionResults = []; // Reset question tracking
    
    if (currentFlashcards.length === 0) {
        alert('No flashcards available for this folder.');
        return;
    }
    
    currentFlashcards = [...currentFlashcards].sort(() => Math.random() - 0.5);
    
    showPage('challengePage');
    showCurrentQuestion();
}

function showCurrentQuestion() {
    if (challengeIndex >= currentFlashcards.length) {
        showResults();
        return;
    }

    const flashcard = currentFlashcards[challengeIndex];
    const question = flashcard.question || {};
    const answer = flashcard.answers[0] || {};

    const questionContent = question.text
        ? question.text
        : question.image_url
            ? `<img src="${question.image_url}" alt="Question Image" style="max-width: 100%; height: auto;">`
            : 'No question content';

    const answerContent = answer.text
        ? answer.text
        : answer.image_url
            ? `<img src="${answer.image_url}" alt="Answer Image" style="max-width: 100%; height: auto;">`
            : 'No answer content';

    const questionElem = document.getElementById('challengeQuestion');
    const answerElem = document.getElementById('challengeAnswer');

    questionElem.innerHTML = questionContent;
    answerElem.innerHTML = answerContent;
    answerElem.classList.remove('show');

    const progress = ((challengeIndex + 1) / currentFlashcards.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('questionCounter').textContent =
        `Question ${challengeIndex + 1} of ${currentFlashcards.length}`;

    document.getElementById('revealBtn').style.display = 'inline-block';
    document.getElementById('correctBtn').style.display = 'none';
    document.getElementById('incorrectBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
}


function revealAnswer() {
    document.getElementById('challengeAnswer').classList.add('show');
    document.getElementById('revealBtn').style.display = 'none';
    document.getElementById('correctBtn').style.display = 'inline-block';
    document.getElementById('incorrectBtn').style.display = 'inline-block';
}

function markCorrect() {
    challengeResults.correct++;
    questionResults.push({
        question: currentFlashcards[challengeIndex],
        isCorrect: true
    });
    document.getElementById('correctBtn').style.display = 'none';
    document.getElementById('incorrectBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
}

function markIncorrect() {
    challengeResults.incorrect++;
    questionResults.push({
        question: currentFlashcards[challengeIndex],
        isCorrect: false
    });
    document.getElementById('correctBtn').style.display = 'none';
    document.getElementById('incorrectBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
}

function nextQuestion() {
    challengeIndex++;
    showCurrentQuestion();
}

function endChallenge() {
    if (confirm('Are you sure you want to end the challenge? Your progress will be lost.')) {
        showPage('folderPage');
    }
}

async function showResults() {
    document.getElementById('correctCount').textContent = challengeResults.correct;
    document.getElementById('incorrectCount').textContent = challengeResults.incorrect;
    document.getElementById('totalCount').textContent = challengeResults.correct + challengeResults.incorrect;

    // Add this new section:
    const sessionWinRate = calculateWinRate(challengeResults.correct, challengeResults.incorrect);
    document.getElementById('sessionWinRate').textContent = sessionWinRate + '%';

    if (currentFolder) {
        await markChallengeComplete(currentFolder.folder_id, challengeResults.correct, challengeResults.incorrect);
    }
    
    showPage('resultsPage');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFolders = folders.filter(folder => 
            folder.folder_name.toLowerCase().includes(searchTerm)
        );
        renderFolders(filteredFolders);
    });
}

function toggleReview(type) {
    const reviewSection = document.getElementById('reviewSection');
    
    // If same type is clicked or section is visible, hide it
    if (currentReviewType === type && reviewSection.style.display !== 'none') {
        hideReview();
        return;
    }
    
    // Update all stat cards to remove active state
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.remove('active-stat');
    });
    
    // Add active state to clicked card
    event.currentTarget.classList.add('active-stat');
    
    let questionsToShow = [];
    let title = '';
    
    switch(type) {
        case 'correct':
            questionsToShow = questionResults.filter(result => result.isCorrect);
            title = 'Correct Answers';
            break;
        case 'incorrect':
            questionsToShow = questionResults.filter(result => !result.isCorrect);
            title = 'Incorrect Answers';
            break;
        case 'total':
            questionsToShow = questionResults;
            title = 'All Questions';
            break;
    }
    
    currentReviewType = type;
    document.getElementById('reviewTitle').textContent = title;
    renderReviewList(questionsToShow, type === 'total');
    
    // Show the review section with animation
    reviewSection.style.display = 'block';
    setTimeout(() => {
        reviewSection.classList.add('show');
    }, 10);
}

function hideReview() {
    const reviewSection = document.getElementById('reviewSection');
    reviewSection.classList.remove('show');
    
    // Remove active state from all stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.remove('active-stat');
    });
    
    setTimeout(() => {
        reviewSection.style.display = 'none';
        currentReviewType = null;
    }, 300);
}

function renderReviewList(results, showStatus = false) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';

    if (results.length === 0) {
        reviewList.innerHTML = '<p class="text-muted text-center py-4">No questions to display.</p>';
        return;
    }

    results.forEach((result, index) => {
        const flashcard = result.question;
        const isCorrect = result.isCorrect;
        const question = flashcard.question || {};
        const answer = flashcard.answers[0] || {};

        const questionContent = question.text
            ? `<span>${question.text}</span>`
            : question.image_url
                ? `<img src="${question.image_url}" alt="Question Image" style="max-width: 100%; height: auto;">`
                : `<span>No question content</span>`;

        const answerContent = answer.text
            ? answer.text
            : answer.image_url
                ? `<img src="${answer.image_url}" alt="Answer Image" style="max-width: 100%; height: auto;">`
                : `No answer content`;

        const flashcardItem = document.createElement('div');
        flashcardItem.className = 'flashcard-item';
        if (showStatus) {
            flashcardItem.classList.add(isCorrect ? 'correct-border' : 'incorrect-border');
        }

        flashcardItem.innerHTML = `
            <div class="flashcard-question" onclick="toggleReviewAnswer(${index})">
                ${questionContent}
                <div class="d-flex align-items-center">
                    ${showStatus ? `<span class="status-badge ${isCorrect ? 'correct' : 'incorrect'} me-2">
                        <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                    </span>` : ''}
                    <span class="expand-icon">▼</span>
                </div>
            </div>
            <div class="flashcard-answer" id="review-answer-${index}">
                ${answerContent}
            </div>
        `;

        reviewList.appendChild(flashcardItem);
    });
}


function toggleReviewAnswer(index) {
    const answer = document.getElementById(`review-answer-${index}`);
    const icon = answer.previousElementSibling.querySelector('.expand-icon');
    
    answer.classList.toggle('show');
    icon.classList.toggle('expanded');
}


// Initialize app
async function init() {
    folders = await fetchFolders();
    renderFolders();
    setupSearch();
}

// Start the app
init();
