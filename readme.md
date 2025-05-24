# 📚 Flashcard Study Application

A modern, interactive web-based flashcard application designed to help users study and learn through spaced repetition and self-assessment. Perfect for students, professionals, and lifelong learners who want to master new subjects efficiently.

## ✨ Features

### 🏠 **Main Dashboard**
- **Organized Learning**: Browse flashcard folders by subject or topic
- **Smart Search**: Real-time search functionality to quickly find specific folders
- **Progress Tracking**: See the number of flashcards in each folder at a glance
- **Alphabetical Sorting**: Folders are automatically organized for easy navigation

### 📂 **Study Materials**
- **Expandable Flashcards**: Click any flashcard to reveal the answer
- **Clean Organization**: Each folder contains related flashcards grouped by subject
- **Easy Navigation**: Seamless movement between folders and main dashboard

### 🎯 **Interactive Challenges**
- **Study Mode**: Test your knowledge with interactive flashcard challenges
- **Progress Visualization**: Real-time progress bar and question counter
- **Self-Assessment**: Mark your answers as correct or incorrect
- **Randomized Questions**: Questions are shuffled for better learning retention
- **Detailed Results**: Get comprehensive statistics after completing challenges

### 📊 **Performance Analytics**
- **Challenge Results**: Track correct vs incorrect answers
- **Success Rate**: Monitor your learning progress over time
- **Challenge History**: System tracks completed challenges (API mode)

## 🚀 Live Demo

**[Try the Live Demo](https://your-username.github.io/flashcard-study-app/)**

The application includes sample flashcards across multiple subjects:
- **Mathematics** (15 cards) - Basic math, algebra, and geometry
- **History** (12 cards) - World history and important events  
- **Science** (20 cards) - Chemistry, biology, and physics
- **English Literature** (8 cards) - Classic authors and famous works
- **Geography** (18 cards) - World capitals, landmarks, and natural features

## 🛠️ Technical Implementation

### **Frontend Architecture**
- **Pure Vanilla JavaScript** - No frameworks required, lightweight and fast
- **Responsive CSS** - Modern design that works on desktop and mobile
- **Single Page Application** - Smooth navigation without page reloads
- **Progressive Enhancement** - Works without JavaScript for basic functionality

### **Dual Mode Operation**

#### 🎮 **Demo Mode** (Default)
- Uses built-in sample data for immediate testing
- No backend required - perfect for GitHub Pages hosting
- Includes realistic flashcard data across multiple subjects
- Ideal for demonstrating functionality and user testing

#### 🔌 **API Mode**
- Ready for backend integration
- Implements RESTful API calls according to specification
- Includes comprehensive error handling
- Easy switch between modes via configuration constant

### **API Integration Ready**

The application is designed to work with the following API endpoints:

```javascript
GET /flashcard-lists          // Fetch all flashcard folders
GET /flashcard-folder/{id}    // Get flashcards from specific folder  
POST /done-challenge/{id}     // Mark challenge as completed
GET /health                   // API health check
```

## 🚀 Quick Start

### **Option 1: GitHub Pages (Recommended)**
1. Fork this repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch" → "main branch"
4. Your app will be available at `https://your-username.github.io/flashcard-study-app/`

### **Option 2: Local Development**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flashcard-study-app.git
   cd flashcard-study-app
   ```

2. Serve the files using any local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

## ⚙️ Configuration

### **Switching Between Demo and API Mode**

Edit the configuration constant in `app.js`:

```javascript
// Configuration: 1 = Demo Mode, 0 = API Mode
const DEMO_MODE = 1; // Change to 0 for API mode
```

- **Demo Mode (1)**: Uses sample data, perfect for testing and demonstration
- **API Mode (0)**: Connects to your backend API endpoints

### **Adding Custom Demo Data**

You can easily customize the demo data by editing the arrays in `app.js`:

```javascript
const demoFolders = [
    { folder_id: "1", folder_name: "Your Subject", total_flashcards: 10 }
];

const demoFlashcards = {
    "1": [
        { 
            question_id: "1", 
            question: { text: "Your question?", image_url: null }, 
            answers: [{ text: "Your answer", image_url: null }] 
        }
    ]
};
```

## 📁 File Structure

```
flashcard-study-app/
├── index.html          # Main HTML structure and styling
├── app.js             # JavaScript application logic
├── README.md          # Project documentation
└── .gitignore         # Git ignore rules (optional)
```

## 🎨 Design Philosophy

- **User-Centric**: Intuitive interface designed for learners of all ages
- **Accessible**: Clean typography and high contrast for readability  
- **Responsive**: Optimized for both desktop and mobile devices
- **Modern**: Contemporary design with smooth animations and transitions
- **Performance**: Lightweight codebase with fast loading times

## 🔧
