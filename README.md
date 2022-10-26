## Project 1: Data Visualization - 1854 Broad Street Cholera Outbrek 

This project is built using HTML, JavaScript, D3, and React. 
The three former were requirements, and the latter was chosen due to the easy of hosting and deploying a React App via AWS Amplify.

### Introduction 

Before we dive into the visualization development process, we'll need to understand why we chose each of our tools.
HTML is required, however, by using React, we can cut down how much raw HTML we'll have to write. This leads us to our next tool, 
React. This framework not only allows us to reduce the amount of raw HTML in our project, but it also allows for the easy manipulation of data in our application. Additionally, by using React, we have access to npm for our package management, and we can use AWS Amplify to deploy our app in minutes!
Since we mentioned the easy package management that npm allows us to have, lets discuss one of the small, but important packages we used to build our visualizations. D3 stands for "Data-Driven Documents" and is a JavaScript library we can use to create exciting, interactive data visualizations. Throughout this project we focus primarily on blending the structure provided by React with the elegance of D3. 

### Task #1 Create a map of Golden Square in London.

The data rests in JSON format and thanks to D3, we can make quick work of reading in the file with d3.json. To store the data, we call on React to useState and hold this data under the name "mapData" for later use. A common mistake many students made was assuming that each object in the mapData
array represented a line and therefore consisted of four points, and it wasn't until I noticed that the map was upside down and missing large chunks around the edges that I realized I did not understand the format the data was resting in. Upon further inspection I realized that the objects were not lines... The objects were actually segments! Segments of the roads in Golden Square, to be specific, and each segment could have numerous points. After this discovery I was well on my way to creating a beautiful, crisp map. 

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/map_.png?raw=true)

### Task #2 Place shapes on the map to represent the infected people and pumps. 
Now that we have a map in place, it's time to add the pumps and people that were infected at and around these pumps. 
Since there are fewer pumps than people, we'll start there. The pumps are stored in a csv file with the x coordinate as the first column and the y coordinate as the second column. Since the data is stored in as state in the application, we can simply loop through each point and use D3 to create and append black circles to represent our pumps 

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/pumps.png?raw=true)

It's time to step it up a notch! We only had a handful of pumps to add AND they were all the same color, so it was all-in-all a simple task. This time, as we add the people to the map, we'll want to make sure that we can differentiate between males and female. In order to accomplish this, we'll use d3.interpolateHsl to map the person's sex to a color. Now that we have our color pallete, let's add those people to the map! We'll use the same scalers as we used for the pump so this part is quite similar, however, if we view the source file, we'll notice that adding people requires a few extra lines. We use these extra lines to store some of the data related to each person, that way it's easy to determine which groups a person belongs to later on. 

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/people.png?raw=true)