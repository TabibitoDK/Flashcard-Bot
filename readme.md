# Flashcard Study Application

A modern web-based flashcard application for studying and learning through interactive challenges and self-assessment. Built with vanilla JavaScript and designed for students and lifelong learners.

## Try It Now

**[Live Demo](https://tabibitodk.github.io/Flashcard-FrontEnd/)**

Experience the application with sample mathematics flashcards. No installation required - works directly in your browser.

## Features

### Main Dashboard
- Browse flashcard folders organized by subject
- Real-time search functionality to find specific folders
- Display flashcard count for each folder
- Alphabetical sorting for easy navigation
- Responsive design for desktop and mobile

### Study Materials
- Expandable flashcards - click questions to reveal answers
- Clean folder organization by subject
- Smooth animations and visual feedback
- Easy navigation between folders and dashboard

### Interactive Challenges
- Test knowledge with timed study sessions
- Real-time progress tracking with visual progress bar
- Self-assessment system (mark correct/incorrect)
- Randomized question order for better retention
- Option to end challenges early

### Performance Tracking
- Detailed results after each challenge
- Statistics showing correct vs incorrect answers
- Visual performance metrics
- Challenge completion tracking (when using API mode)

## Demo

The application includes sample data for immediate testing:

**Mathematics** (5 flashcards)
- Basic arithmetic: "What is 2 + 2?"
- Algebra: "What is the derivative of x²?"
- Geometry: "What is the area of a circle with radius 5?"
- And more...

## Technical Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Bootstrap 5.3.0 + custom CSS
- **Icons**: Font Awesome 6.4.0
- **Architecture**: Single Page Application
- **Design**: Mobile-first responsive layout

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/flashcard-study-app.git
cd flashcard-study-app
```

2. Start a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → "main branch"
4. Access at `https://your-username.github.io/flashcard-study-app/`

## Configuration

### Demo vs API Mode

The application supports two modes controlled by a configuration constant in `app.js`:

```javascript
// Configuration: 1 = Demo Mode, 0 = API Mode
const DEMO_MODE = 1;
```

**Demo Mode (Default)**: Uses built-in sample data, perfect for testing and GitHub Pages deployment.

**API Mode**: Connects to backend API endpoints for dynamic data.

### API Integration

When using API mode, the application connects to:

```
Base URL: https://JeorgeC-FlashCardBackEnd.hf.space

GET /flashcard-lists          # Fetch all folders
GET /flashcard-folder/{id}    # Get flashcards from folder
POST /done-challenge/{id}     # Mark challenge complete
```

Expected API response format:
```javascript
// Folders
[
  {
    "folder_id": "1",
    "folder_name": "Mathematics", 
    "total_flashcards": 15
  }
]

// Flashcards
[
  {
    "question_id": "1",
    "question": { "text": "What is 2 + 2?", "image_url": null },
    "answers": [{ "text": "4", "image_url": null }]
  }
]
```

### Customizing Demo Data

Edit the demo arrays in `app.js`:

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

## Project Structure

```
flashcard-study-app/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS styles
├── app.js             # Application logic
└── README.md          # Documentation
```

## Design System

The application uses a modern design system with:

- CSS custom properties for consistent theming
- Gradient color scheme (primary: #667eea, secondary: #764ba2)
- Card-based layout with smooth animations
- Responsive breakpoints for all screen sizes
- Accessibility features including focus indicators and reduced motion support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

### Error Handling
- Comprehensive try-catch blocks for API calls
- Graceful fallback when network requests fail
- User-friendly error messages
- Proper handling of empty states

### Performance
- Lightweight vanilla JavaScript implementation
- Minimal external dependencies
- Efficient DOM manipulation
- Hardware-accelerated CSS animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

Built with Bootstrap, Font Awesome, and modern web standards.