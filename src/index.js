import React, { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import ReactDOM from "react-dom";
import "./index.css";
import * as d3 from "d3";

const margin = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  },
  width = margin.right * 0.39,
  height = margin.bottom * 0.7;


const Project1 = () => {
	const [mapData, setMapData] = useState([]);
	const [pumpData, setPumpData] = useState([]);
	const [deathDays, setDeathDays] = useState([]);
	const [personData, setPersonData] = useState([]);
	const [activeBar, setActiveBar] = useState(undefined);
	const [activeSex, setActiveSex] = useState(undefined);
	const [activeAge, setActiveAge] = useState(undefined);

	const [xscl, setXscl] = useState();
	const [yscl, setYscl] = useState();


	const drawMap = function(data, xScl, yScl) {
		var map = [];
		data.forEach((segment) => {
			var seg = [];
			for (var p = 0; p < segment.length; p++) {
				seg.push([xScl(segment[p].x), yScl(segment[p].y)]);
			}
			map.push(seg);
		});

		// Draw the map
		var map_svg = d3
			.select("#map_svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", `0 0 ${width * 1.1} ${height}`)
			.attr("background-color", "antiquewhite");

		// Title
		map_svg.append("text")
			.attr("y", height*.975 - height)
			.attr("x", width*.22)
			.text("Map of Golden Square")
			.style("font-size", "32px")
	
		map.forEach((segment) => {
			map_svg
			.append("path")
			.style("stroke", "grey")
			.style("stroke-width", 3)
			.attr("d", d3.line()(segment))
			.attr("fill", "none");
		});
	};
	

	// Add deaths to the map
	const addDeaths = function(personData, xscl, yscl) {
		var cValue = function (x) {
			return x["gender"];
		},
			color = d3
			.scaleLinear()
			.domain([1, 2])
			.interpolate(d3.interpolateHsl)
			.range(["red", "green"]);
	
		if (personData.length > 0) {
			var map_svg = d3.select("#map_svg")
			personData.forEach((person) => {
			map_svg
				.append("circle")
				.attr("r", 3)
				.attr("cx", xscl(person.x))
				.attr("cy", yscl(person.y))
				.attr("id", "circle" + person.date)
				.attr("data-date", person.date)
				.attr("data-sex", person.gender)
				.attr("data-age", person.age)
				.attr("class", "deaths")
				.style("fill", color(cValue(person)));
			});
		};
	};
	

	const addPumps = function(data, xScl, yScl) {
		// Add pumps to the map
		if (data.length > 0) {
			var p = 0;
			var map_svg = d3.select("#map_svg")
			
			data.forEach((pump) => {
			map_svg
				.append("circle")
				.attr("fill", "black")
				.attr("r", 9)
				.attr("cx", xScl(pump.x))
				.attr("cy", yScl(pump.y))
				.attr("id", "pump" + p);
			});
		}
	};


	const drawPeopleStats = function(data) {

		var stats_svg = d3
			.select('#stats_svg')
			.attr('width', width * .91)
			.attr("height", height * .3)
			.style("outline", "solid grey 2px")
		
		// Title
		stats_svg.append("text")
			.attr("y", height*.03)
			.attr("x", width*.3)
			.text("Death Statistics")
			.style("font-size", "22px")

		// Male legend
		var male_stats_svg = stats_svg
			.select('#males')
			.on("mouseover", () => {
				showSex("0");
			})
			.on("mouseout", () => {
				showSex(null);
			});
		
		male_stats_svg
			.select('#percent_male_c')
			.attr("fill", '#7f7fff')
			.attr("r", (270/571)*70)
			.attr("cx", .07 * width)
			.attr("cy", .07 * height)
		
		male_stats_svg
			.select('#label_male_t')
			.attr("x", .15 * width)
			.attr("y", .08 * height)
			.text(" - Male")

		male_stats_svg
			.select('#percent_male_t')
			.attr("x", .03 * width)
			.attr("y", .08 * height)
			.text("49.74%")

		// Female legend
		var female_stats_svg = stats_svg
			.select('#females')
			.on("mouseover", () => {
				showSex("1");
			})
			.on("mouseout", () => {
				showSex(null);
			});

		female_stats_svg
			.select('#percent_female_c')
			.attr("fill", '#ff0000')
			.attr("r", (315/571)*70)
			.attr("cx", .07 * width)
			.attr("cy", .22 * height)
		
		female_stats_svg
			.select('#label_female_t')
			.attr("x", .15 * width)
			.attr("y", .23 * height)
			.text(" - Female")

		female_stats_svg
			.select('#percent_female_t')
			.attr("x", .03 * width)
			.attr("y", .23 * height)
			.text("50.26%")

		// Age Distribution bars
		var age_g = stats_svg
			.select("#age_g")
			.attr("x", width * .3)
			.attr("y", height * .3)

		var x__ = d3.scaleBand(["0", "1", "2", "3", "4", "5"], [0, width*.53]);
		var y__ = d3.scaleLinear([.5, 0], [250, height*.3]);

		var x_Axis = d3.axisBottom(
			d3.scaleBand(["0-10", "11-20", "21-40", "41-60", "61-80", "81+"], [0, width*.53])
		);

		// X-Axis
		age_g
			.select("#x__axis")
			.attr("class", "xaxis")
			.attr("transform", `translate(${width * 0.38} ${height * 0.2})`)
			.call(x_Axis)
			.append("text")
			.text("Age Groups by Percentage")
			.attr("x", width * 0.25)
			.attr("y", height * 0.075);

		
		// Bars
		var y = [143, 48, 58, 57, 91, 174]
		age_g
			.selectAll(".stats_bar")
			.each(function(d, i) {
				d3.select(this)
					.attr("y", height*.2 - (y[i]/571)*250)
					.attr("x", x__(String(i))+width*.4)
					.attr("width", width*.046)
					.attr("height",  (y[i]/571)*250)
					.attr("fill", "#F09D51")
					.on("mouseover", () => {
						showAge(d3.select(this).attr("data-age"));
						d3.select(this).attr("fill", "#313638");
					})
					.on("mouseout", () => {
						showAge(null);
						d3.select(this).attr("fill", "#F09D51");
					});
			});
		
	};

	const showSex = function(sex) {
		if (sex !== null) {
			setActiveSex(sex);
		};
		if (sex === null) {
			setActiveSex(undefined);
		}
	};

	const showAge = function(age) {
		if (age !== null) {
			setActiveAge(age);
		};
		if (age === null) {
			setActiveAge(undefined);
		}
	}


	const drawBar = function(data) {

		const line_width = width * 1.25;
		const line_height = height * .95;
		
		var line_svg = d3
			.select("#line_svg")
			.attr("width", line_width)
			.attr("height", line_height)
			.style("outline", "solid grey 2px");
	
		const y_list = data.map(function (d) {
			return Number(d.deaths);
		});
	
		const x_list = data.map(function (d) {
			return String(d.date);
		});
		
		const xMin = new Date(1854, 7, 19);
		const xMax = new Date(1854, 8, 30);
	
		var x_ = d3.scaleBand(x_list, [0, width]);
		var y_ = d3.scaleLinear([d3.max(y_list)+20, d3.min(y_list)], [250, line_height]);
	
		var xAxis = d3.axisBottom(
			d3.scaleTime([xMin, xMax], [0, width])
		);
		var yAxis = d3.axisLeft(y_);
		
		// Title
		line_svg
			.append("text")
			.text("Time Series of Daily Death Counts")
			.attr("x", line_width * 0.17)
			.attr("y", line_height * 0.1)
			.style("font-size", "32px");
	
		// X-Axis
		line_svg
			.append("g")
			.attr("class", "xaxis")
			.attr("transform", `translate(${line_width * 0.1} ${line_height * 0.8})`)
			.call(xAxis)
			.append("text")
			.text("Date")
			.attr("x", line_width * 0.4)
			.attr("y", line_height * 0.1);
	
		// Y-Axis
		line_svg
			.append("g")
			.attr("class", "yaxis")
			.attr("transform", `translate(${line_width * 0.09}, -${line_height * 0.2})`)
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", line_width * -0.06)
			.attr("x", -line_height * 0.6)
			.style("text-anchor", "front")
			.text("Daily Death Count");

		// Bars
		deathDays.forEach((day) => {
			line_svg
				.append("rect")
				.attr("class", "bar")
				.attr("id", "bar" + day.date)
				.attr("x", x_(day.date) + line_width * 0.1)
				.attr("width", 11)
				.attr("y", y_(day.deaths) - line_height * 0.201)
				.attr("height", 1.0001 * line_height - y_(day.deaths))
				.attr("fill", "#F06543")
				.on("mouseover", () => {
					updateBars(day.date);
				})
				.on("mouseout", () => {
					updateBars(null);
				});
		});
	};

	const updateBars = function(date) {
		if (date !== null) {
			setActiveBar(date);
			d3.selectAll("#bar" + date).attr("fill", "#313638");
		};
		if (date === null) {
			setActiveBar(undefined);
			d3.selectAll(".bar").attr("fill", "#F06543");
		}
	};


	useEffectOnce(() => {
		// Map data
		d3.json("/streets.json").then((map) => {
			setMapData(map);	
		});

		// Pump data
		d3.csv("/pumps.csv").then((pump) => {
			setPumpData(pump);
		});
		
		// Death dates and Person data
		d3.csv("/deathdays.csv").then((dates) => {
			setDeathDays(dates);

			// Person data
			d3.csv("/deaths_age_sex.csv").then((people) => {
				var currentPerson = 0;
				dates.forEach((day) => {
					for (var i = 0; i < day.deaths; i++) {
						people[currentPerson].date = day.date;
						currentPerson++;
					}
				});
				setPersonData(people);
			});
		});
	}, [mapData]);


	useEffect(() => {
		// Create map scalers
		var x = [];
		var y = [];
		mapData.forEach((segment) => {
			for (var p = 0; p < segment.length; p++) {
				x.push(segment[p].x);
				y.push(segment[p].y);
			}
		});
	
		var x_scl = d3
			.scaleLinear()
			.domain([d3.min(x), d3.max(x)])
			.range([margin.left, width + margin.left]);
		setXscl(() => x_ => x_scl(x_));

		var y_scl = d3
			.scaleLinear()
			.domain([d3.min(y), d3.max(y)])
			.range([height + margin.top, margin.top]);
		setYscl(() => y_ => y_scl(y_));
	}, [mapData]);


	useEffect(()=> {
		drawMap(mapData, xscl, yscl);
		addPumps(pumpData, xscl, yscl);
		addDeaths(personData, xscl, yscl);
		drawBar(deathDays);
		drawPeopleStats(personData);
	}, [mapData, pumpData, personData, deathDays, xscl, yscl]);
	
	useEffect(() => {
		d3.selectAll(".deaths")
		.each(function(d, i) {
			if (d3.select(this).attr("data-date") === activeBar) {
				d3.select(this).attr("r", 7);
			};
			if (d3.select(this).attr("data-date") !== activeBar) {
				d3.select(this).attr("r", 3);
			};
		});
	}, [activeBar]);

	useEffect(() => {
		d3.selectAll(".deaths")
		.each(function(d, i) {
			if (d3.select(this).attr("data-sex") === activeSex) {
				d3.select(this).attr("r", 7);
			};
			if (d3.select(this).attr("data-sex") !== activeSex) {
				d3.select(this).attr("r", 3);
			};
		});
	}, [activeSex])

	useEffect(() => {
		d3.selectAll(".deaths")
		.each(function(d, i) {
			if (d3.select(this).attr("data-age") === activeAge) {
				d3.select(this).attr("r", 7);
			};
			if (d3.select(this).attr("data-age") !== activeAge) {
				d3.select(this).attr("r", 3);
			};
		});
	}, [activeAge])

	return (
		<div>
			<h1>1854 Broad Street Cholera Outbreak</h1>
			<div className="wrapper">
				<svg id="map_svg"></svg>
				<svg id="line_svg"></svg>
				<svg id="stats_svg">
					<g id="males">
						<circle id='percent_male_c'></circle>
						<text id='percent_male_t'></text>
						<text id='label_male_t'></text>
					</g>
					<g id="females">
						<circle id='percent_female_c'></circle>
						<text id='percent_female_t'></text>
						<text id='label_female_t'></text>
					</g>
					<g id="age_g">
						<g id="x__axis"></g>
						<rect className="stats_bar" data-age="0"></rect>
						<rect className="stats_bar" data-age="1"></rect>
						<rect className="stats_bar" data-age="2"></rect>
						<rect className="stats_bar" data-age="3"></rect>
						<rect className="stats_bar" data-age="4"></rect>
						<rect className="stats_bar" data-age="5"></rect>
					</g>
				</svg>
				<a href="https://github.com/samuelhickeyIII/project-1/blob/master/src/index.js"> Source Code </a>
			</div>
		</div>
	);
};

ReactDOM.render(
  <React.Fragment>
    <Project1 />
  </React.Fragment>,
  document.getElementById("root")
);
