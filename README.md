# Voice Recipe Search App

## Getting Started - development
- Clone the repository
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Access the application through a supported mobile browser **(Chrome/Safari)**

## User instructions
1. To demo this app, navigate to the live URL in a mobile browser where the Web Speech API is supported (such as Google Chrome or Safari) (TODO)
2. Click the 'Start listening' button to turn on the mic
3. Say your recipe key words
4. Select a recipe and start cooking!

## About the project

## Overview
A voice-enabled recipe search application built to explore modern web technologies and AI integration while solving a real-world problem. This project combines speech recognition, react best practices, and AI-assisted development to create an intuitive cooking companion to help you find a new recipe for dinner. If you're the kind of cook who loves to try new recipes in the kitchen but dislike having to type and sift though google search results then this app is for you!

### Goals
- [x] Explore and implement voice interaction in web applications using the Web Speech API
- [x] Gain hands-on experience with AI-assisted development tools like Vercel V0 and Cline
- [x] Build a production-ready React application with TypeScript
- [ ] Create an accessible application with both voice and text input options

###  Technical Stack
- Frontend Framework: React with TypeScript
- Build Tool: Vite
- Voice Integration: Web Speech API
- UI Generation: Vercel V0
- Development Approach: User story development
- Version Control: Git

### Current Features
- Voice-activated recipe search
- Text input fallback for accessibility
- Mobile-responsive design
- Basic recipe filtering system

### Devlopment journey
## The process
This app is still in progress but so far.
1. I have used Notion to write up a set of simple user stories to guide my development based on my own pain points and wants as a user.
2. Explored different UI generation tools before selecting Vercel V0 to create a simple voice search interface (with text in input fallback). 
3. Experimented using Cline and Vercel V0 to set up my app structure and foundation  - Noting that I had to do my own research to fix some config issues and bugs with MDN speech API - always read the docs!
4. I have implemented [MDN Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) to record my recipe search input by voice as well as text input. 
5. I set up some dummy recipes for the interface, test the design and to practice filtering.
6. I then used ninja-recipes (creative recipe api) to be able to search interesting recipes from the web based on my search inputs.
7. I use state instead of routes as a quick and simple way to switch between displaying a list of recipe cardsbased on search, and showing the full recipe details for a selected recipe

### Roadmap

-[x] Integrate external recipe API for comprehensive search results
-[x] Enhance UI/UX with improved visual design, including empty and error states
-[ ] Deploy to production environment
-[ ] Implement caching for improved performance
-[ ] Add user feedback system

## Technical Considerations
This application currently requires a modern mobile browser with Web Speech API support. 

### Lessons learned so far...

Reflections coming soon...



-----------------------------------------------------
