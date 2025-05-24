// Configuration: 1 = Demo Mode, 0 = API Mode
const DEMO_MODE = 1;

// Demo data
const demoFolders = [
    { folder_id: "1", folder_name: "Mathematics", total_flashcards: 15 },
    { folder_id: "2", folder_name: "History", total_flashcards: 12 },
    { folder_id: "3", folder_name: "Science", total_flashcards: 20 },
    { folder_id: "4", folder_name: "English Literature", total_flashcards: 8 },
    { folder_id: "5", folder_name: "Geography", total_flashcards: 18 }
];

const demoFlashcards = {
    "1": [
        { question_id: "1", question: { text: "What is 2 + 2?", image_url: null }, answers: [{ text: "4", image_url: null }] },
        { question_id: "2", question: { text: "What is the derivative of x²?", image_url: null }, answers: [{ text: "2x", image_url: null }] },
        { question_id: "3", question: { text: "What is the square root of 64?", image_url: null }, answers: [{ text: "8", image_url: null }] },
        { question_id: "4", question: { text: "What is 15% of 200?", image_url: null }, answers: [{ text: "30", image_url: null }] },
        { question_id: "5", question: { text: "What is the area of a circle with radius 5?", image_url: null }, answers: [{ text: "25π or approximately 78.54", image_url: null }] }
    ],
    "2": [
        { question_id: "6", question: { text: "When did World War II end?", image_url: null }, answers: [{ text: "1945", image_url: null }] },
        { question_id: "7", question: { text: "Who was the first President of the United States?", image_url: null }, answers: [{ text: "George Washington", image_url: null }] },
        { question_id: "8", question: { text: "In which year did the Berlin Wall fall?", image_url: null }, answers: [{ text: "1989", image_url: null }] },
        { question_id: "9", question: { text: "Who wrote the Declaration of Independence?", image_url: null }, answers: [{ text: "Thomas Jefferson", image_url: null }] }
    ],
    "3": [
        { question_id: "10", question: { text: "What is the chemical symbol for gold?", image_url: null }, answers: [{ text: "Au", image_url: null }] },
        { question_id: "11", question: { text: "How many bones are in the adult human body?", image_url: null }, answers: [{ text: "206", image_url: null }] },
        { question_id: "12", question: { text: "What is the speed of light in vacuum?", image_url: null }, answers: [{ text: "299,792,458 meters per second", image_url: null }] },
        { question_id: "13", question: { text: "What gas makes up about 78% of Earth's atmosphere?", image_url: null }, answers: [{ text: "Nitrogen", image_url: null }] }
    ],
    "4": [
        { question_id: "14", question: { text: "Who wrote 'Romeo and Juliet'?", image_url: null }, answers: [{ text: "William Shakespeare", image_url: null }] },
        { question_id: "15", question: { text: "What is the first line of 'Pride and Prejudice'?", image_url: null }, answers: [{ text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", image_url: null }] }
    ],
    "5": [
        { question_id: "16", question: { text: "What is the capital of Australia?", image_url: null }, answers: [{ text: "Canberra", image_url: null }] },
        { question_id: "17", question: { text: "Which is the longest river in the world?", image_url: null }, answers: [{ text: "The Nile River", image_url: null }] },
        { question_id: "18", question: { text: "What is the highest mountain in the world?", image_url: null }, answers: [{ text: "Mount Everest", image_url: null }] }
    ]
};

// Global variables
let currentFolder = null;
let currentFlashcards = [];
let challengeIndex = 0;
let challengeResults = { correct: 0, incorrect: 0 };
let folders = [];

// API functions
async function fetchFolders() {
    if (DEMO_MODE) {
        return demoFolders.sort((a, b) => a.folder_name.localeCompare(b.folder_name));
    } else {
        try {
            const response = await fetch('/flashcard-lists');
            const data = await response.json();
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
            const response = await fetch(`/flashcard-folder/${folderId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            return [];
        }
    }
}

async function markChallengeComplete(folderId) {
    if (!DEMO_MODE) {
        try {
            await fetch(`/done-challenge/${folderId}`, { method: 'POST' });
        } catch (error) {
            console.error('Error marking challenge complete:', error);
        }
    }
}

// UI functions
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
        folderItem.className = 'folder-item';
        folderItem.onclick = () => showFolder(folder);
        
        folderItem.innerHTML = `
            <div class="folder-name">${folder.folder_name}</div>
            <div class="flashcard-count">${folder.total_flashcards} cards</div>
        `;
        
        folderList.appendChild(folderItem);
    });
}

async function showFolder(folder) {
    currentFolder = folder;
    document.getElementById('folderTitle').textContent = folder.folder_name;
    
    const flashcards = await fetchFlashcards(folder.folder_id);
    currentFlashcards = flashcards;
    
    renderFlashcards(flashcards);
    showPage('folderPage');
}

function renderFlashcards(flashcards) {
    const flashcardList = document.getElementById('flashcardList');
    flashcardList.innerHTML = '';
    
    flashcards.forEach((flashcard, index) => {
        const flashcardItem = document.createElement('div');
        flashcardItem.className = 'flashcard-item';
        
        flashcardItem.innerHTML = `
            <div class="flashcard-question" onclick="toggleAnswer(${index})">
                <span>${flashcard.question.text}</span>
                <span class="expand-icon">▼</span>
            </div>
            <div class="flashcard-answer" id="answer-${index}">
                ${flashcard.answers[0].text}
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
    
    if (currentFlashcards.length === 0) {
        alert('No flashcards available for this folder.');
        return;
    }
    
    // Shuffle flashcards for random order
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
    document.getElementById('challengeQuestion').textContent = flashcard.question.text;
    document.getElementById('challengeAnswer').textContent = flashcard.answers[0].text;
    document.getElementById('challengeAnswer').classList.remove('show');
    
    // Update progress
    const progress = ((challengeIndex + 1) / currentFlashcards.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('questionCounter').textContent = 
        `Question ${challengeIndex + 1} of ${currentFlashcards.length}`;
    
    // Reset buttons
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
    document.getElementById('correctBtn').style.display = 'none';
    document.getElementById('incorrectBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
}

function markIncorrect() {
    challengeResults.incorrect++;
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
    
    // Mark challenge as complete
    if (currentFolder) {
        await markChallengeComplete(currentFolder.folder_id);
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

// Initialize app
async function init() {
    folders = await fetchFolders();
    renderFolders();
    setupSearch();
}

// Start the app
init();