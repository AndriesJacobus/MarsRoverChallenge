## MarsRoverChallenge

A squad of robotic rovers are to be landed by NASA on a plateau on Mars. Lets controll them.

## Getting started
The project is built with Rails 6.1.4 and React.<br/>
To start the project, you will need to:

1. `bundle install` to install the Rails dependencies
2. `yarn` to install the React dependencies
3. Run `./bin/shakapacker-dev-server` in one terminal to start React
4. Run `rails s` in another terminal to start the Rails server

## How it works
The user enters the input for the Rover challenge using the React FE, which then gets sent through to the BE as an API request. The input is validated and the output is generated and returned by the BE. If the input is valid, it is then used by the React app to visually display the Rovers' movement using some 3D models!

## Back-end
I set up a basic Rails server with one controller (in addition to the standard `application_controller.rb` controller), one model (in addition to the standard `application_record.rb` model), and one view (in addition to the standard layout views).<br/>

* Controller: `home_controller.rb`
    * Serves the `index` view for the webapp. Renders the main React component
    * Contains `calculate_movement_output`, which is a REASTful endpoint that the React FE uses to send the user config input and calculate the end coordinates of each rover. It does this by using the helper functions coded into the `rover_movement.rb` model

* Model: `rover_movement.rb`
    * Contains the helper functions used to calculate the end coordinates of a set of rovers given the starting input
    * `calculate_output` is the main helper function called by the controller
    * Includes input validation
    * Returns a string output containing the end coordinates of the rovers
    * In the case that the rover moves out of the grid, it returns the last known position of the rover in the grid (along with a text letting the user know the rover moved out of the grid)

* View: `home/index.html.erb`
    * Serves the main React component (see below)

## Front-end
I built a few React components used to nicely capture and display the challenge.<br/>

* THREE.js<br/>
I took this oppotunity to learn about THREE.js! This is the first time I'm working with THREE.js and thought it would be a perfect fit.<br/>
The React app includes two main 3D models: `MarsTerrain` and `Rover`.<br/>

* Mechanics
    * When the app starts, the terrain gets loaded
    * The user can input rover data using the popup modal
    * As soon as the user enters valid input data, a series of Rover models get rendered on the Terrain
    * The Rovers are animated according to the input provided
    * The entire canvas can be controller by the using using their mousepad, including zooming in, zooming out, rotating, and moving the camera position itself

<br/>

---

**Created with 💚 by _<u><a href = "https://github.com/AndriesJacobus" target = "_blank" style = "color: green;">Andries Jacobus du Plooy</a></u>_**