# TetriPlan
This is an app that helps users productively manage their time serving as the backend to the Tetriplan frontend which can be [found here](https://github.com/ladantork/teriplan-front-app).

#### Functionality

##### Task Scheduling:
Intuitive interface for easily scheduling tasks.
Ability to allocate specific time blocks for each activity.
Option to set reminders and notifications for upcoming tasks.

##### Detailed Reports and Analysis:
Comprehensive reports providing insights into time usage.
Analysis of productivity patterns and trends.
Visual representation of data through charts and graphs.

##### AI-Powered Insights:
AI-driven analysis of productivity habits.
recommendations based on past tasks and behaviour.
Suggestions for optimising time management and increasing efficiency.

##### Google Login Authentication:
Seamless authentication via Google login.
Enhanced convenience and security for users.
Integration with existing Google accounts for easy access.


### Getting Started
#### Prerequisites
It is assumed that VS code (or another appropriate alternative) runs on your machine.

You also need node (at least v22.2.0) installed on your machine.

#### Installing
**Getting the code**
Fork the project from git. Then copy the git url and in the appropriate folder on your machine:
<sub>  git clone <url from git> </sub>
This will create the project on your local machine.
Open the project in VS code (or alternative app).

**Installing dependencies**

### Dependencies
Run the following to install dotenv, express, jest-sorted, mongodb and mongoose.
### DevDependencies
Run the following to install jest and supertest.
<sub> npm i </sub>
Once all required dependencies are installed, you can check the node_modules folder (which should be created now) to see if the folders for each of these libraries exists.

**Running the app**
<sub> npm run dev </sub>

### Tech Used

#### Front end
**Frameworks**
The front-end was developed using Angular and most of the styling was done via CSS. We considered other frameworks and libraries but we preferred vanilla css.

Authentication we used firebase authentication due to the compability with Google.

#### Back end
The database holding the data is MongoDB and Express was used to build the server connecting through Mongoose. Supertest was used for testing.

**Testing**
Testing was done with Jest.

#### Sprint management
Excalidraw was used by me to map a plan and wireframes whilst Trello was used to track our progress.


### Application

This is a link to the deployed website, it has been deployed with netlify: [click here]()

When using this app, you can login if you have an account otherwise default to Google signin.

