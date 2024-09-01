# YouTube Share Application Backend

## Introduction
This project is a backend application built with NestJS for a YouTube share application. It provides a set of APIs for user authentication, profile management, and video interactions, including sharing, displaying, and reacting to videos. The project is designed to be scalable and maintainable, leveraging Docker for simplified deployment.

### Key Features
- User authentication and profile management
- Video sharing and retrieval
- Video reactions (like/unlike)
- Comprehensive error handling and validation
- Fully Dockerized for easy setup and deployment

## Prerequisites
To run this project locally, ensure you have the following software installed:
- [Node.js](https://nodejs.org/) (version 14.x or later)
- [Docker](https://www.docker.com/get-started) (version 19.03 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.27 or later)

## Installation & Configuration
Follow these steps to set up the project:

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/youtube-share-backend.git
   cd youtube-share-backend
2. **Install dependencies**
    ```sh
    npm install
    Configure environment variables
3. **Create a .env file in the project root:**
    ```sh
    cp .env.example .env
    Modify the .env file with your configuration settings.
4. **Retrieve your YOUTUBE API from Google Console**
    Please follow this link to get the API for YOUTUBE https://developers.google.com/youtube/registering_an_application
## Database Setup
This project uses MongoDB as its database. Follow these steps to set up the database:

1. **Start MongoDB using Docker Compose**
    ```sh
    Copy code
    docker-compose up -d
2. **Running the Application**
To start the development server, run:
    ```sh
    Copy code
    npm run start:dev
Access the application in your web browser at http://localhost:3000.
## Usage
To use the application, make HTTP requests to the API endpoints. Here are the endpoint list:

POST /auth/login - User login
POST /auth/register - User registration
GET /auth/profile - Get user profile
Videos
POST /videos - Share a new video
GET /videos - Retrieve a list of shared videos
POST /videos/:id/react - React (like) to a video
DELETE /videos/:id/react - Remove reaction (unlike) from a video

## Troubleshooting
Here are some common issues that may arise during setup and their potential solutions:

Problem: MongoDB container not starting

Solution: Ensure Docker is running and you have sufficient resources allocated.
Problem: Application cannot connect to MongoDB

Solution: Verify the DB_URL in your .env file points to the correct MongoDB instance.
Problem: Dependencies not installing

Solution: Ensure you are using a compatible version of Node.js.
For further issues, refer to the project documentation or raise an issue on GitHub.