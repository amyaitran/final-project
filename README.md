# Oft-Topic

A full stack application for friends who want to play a virtual adaptation of the party game “Off Topic”.

## Why I Built This Project

I

## Technologies Used

- React.js
- Socket.io
- Node.js
- Webpack
- Express
- PostgreSQL
- HTML5
- CSS3
- Heroku

## Live Demo

Try the application live!
- Desktop screen: [https://oft-topic.herokuapp.com/](https://oft-topic.herokuapp.com/)
- Mobile screen: [https://oft-topic.herokuapp.com/#mobile](https://oft-topic.herokuapp.com/#mobile)

## Features

- Players can create a room
- Players can join a created room
- Players can start game
- Players can view prompts
- Players can disqualify answers

## Future Developments

- Players can vote on validity of answers
- Players can view winner of round
- Players can continue to next round
- Players can view winner of game

## Stretch Features
- Players can change game settings
- Players can have the option to restart the game

## Preview
![ot-readme1](https://user-images.githubusercontent.com/30616230/149430653-28f7f913-d75f-49d8-80fe-39c5ae202983.gif)

## Development

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/amyaitran/oft-topic-game.git
    cd oft-topic-game
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Make a copy of the .env.example file.
    ```shell
    cp .env.example .env
    ```
    
1. Start PostgreSQL
    ```shell
    sudo service postgresql start
    ```

1. Create a new databse.
    ```shell
    createdb oft-topic-game
    ```
    
1. Import the example database to PostgreSQL.
    ```shell
    npm run db:import
    ```
    
1. Start the database (optional - if pgweb is installed).
    ```shell
    pgweb --db=oft-topic-game
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.
    ```shell
    npm run dev
    ```
