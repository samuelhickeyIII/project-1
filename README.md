Link to the application: https://master.d1yjrgrf88tn2p.amplifyapp.com/

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

### Task #3 Add the bar graph
Awesome! There's now a static map, with a bunch of dots on it. So how can we make it interactive and fun you might ask?? By adding another graph! This time, we'll create a graph that will display the daily death count over the course of a fourty day time series. Additionally, we will link each day to the map such that when we hover our mouse over a bar, the circles representing people that died on the associated day will double in size, making it easy for us to identify when and where someone died. We will extract the dates and daily death count from the deathdays.csv file. The dates will be used as our x-axis so we'll need to create a scaler which will be responsible for scaling the entries in the x-column to fit our window and then we'll need to do the same for the y-axis. Here, we will also add x and y axis labels and a title for our graph.

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/empty_bar.png?raw=true)

Alright! We're looking good. Next step is to add the bars and the functionality. Adding the bars is a little tricky, but with some expert Googling, we can get the job done. Finding the correct x-value and width for the bars was easy, however, finding the correct y position and the correct height was difficult because these svgs see height as zero being the top left and the bottom of the screen being the largest point which means that everything is inverted. Though finding the correct placement for the height and y attributes was difficult, dealing with the mouseover and mouseout events were a bit more tideous. Before we get into that, let's take a look at where we're currently at.

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/bar.png?raw=true)

Where were we?... Ah yes the mouseon-mouseoff events. This was difficult to deal with in React due to the fact that the Component was trying to not only re-render circles to their correct for, but it was also adding MORE circles on top of those. The resulting issue was a slow rendering while elemenets piled up until eventually the application crashed. However, with some thought I was able to resolve this issue by separately rendering the map, pumps, and people, and then using React's setState capabilities as a trigger to allow d3 to come in, select all of the associated people, and change their circle size accordingly. 

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/bar_with_map.png?raw=true)

Lastly, we needed to display some statistics. Since we have already learned so much about using D3 and React, we can re-use our parts of our old code to create this portion quickly. 

First we create a couple of circles displaying the percentage of males and females that were taken by the disease. 

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/male_female_stats.png?raw=true)

As we can see, the male circle is slightly smaller than the female circle since slightly fewer men died during the outbreak. Additionally, these circles are color coded to circles on the map so that our visualization can also act as a legend. 

And finally, we will display a bar graph which shows the age distribution of the people affected by disease.

![alt text](https://github.com/samuelhickeyIII/project-1/blob/master/images/all_stats.png?raw=true)

I should also mention that everything in the final visualization is also linked to the map to dynamically increase the size of the associated circles. 

As a bit of reflection, I feel like using React was probably a bit overkill and in some cases made this more difficult. However, it did allow for rapid development, and while it was difficult to learn at first, by the end of the project I could really see the benefit of using such a tool. Likewise for D3, it the case of basic visualizations, it is a bit overly powerful. But if we want to make visualizations that can provide the best experience to help our users learn and understand the universe around them, React and D3 are a great combination.