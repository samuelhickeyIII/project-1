            
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as d3 from "d3";
           
const margin = { top: 40, right: 80, bottom: 60, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom,
    color = "OrangeRed";
    
            
    const Map = () => {
      const [activeIndex, setActiveIndex] = React.useState(null),
      [data, setData] = React.useState([]);

      React.useEffect(() => {
        d3.json("/streets.json").then((d) => {
            d.forEach((i) => {
              i.x = Number(i.x);
              i.y = Number(i.y);
              console.log(i[0].x);
              console.log(i[1].x);
            });
            setData(d);
          });
          return () => undefined;
      }, []);


      const yMinValue = d3.min(data, (d) => d.y),
      yMaxValue = d3.max(data, (d) => d.y);

      
      const getX = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.x))
        .range([0, width]);

      const getY = d3
        .scaleLinear()
        .domain([yMinValue - 1, yMaxValue + 2])
        .range([height, 0]);

      const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(getX);
        d3.select(ref).call(xAxis.tickFormat(d3.timeFormat("%b")));
      };

      const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(getY).tickSize(-width).tickPadding(7);
        d3.select(ref).call(yAxis);
      };

                  
      const linePath = d3
        .line()
        .x((d) => getX(d.x))
        .y((d) => getY(d.y))
        .curve(d3.curveMonotoneX)(data);

      const areaPath = d3
        .area()
        .x((d) => getX(d.x))
        .y0((d) => getY(d.y))
        .y1(() => getY(yMinValue - 1))
        .curve(d3.curveMonotoneX)(data);

              
      const handleMouseMove = (e) => {
        const bisect = d3.bisector((d) => d.x).left,
            x0 = getX.invert(d3.pointer(e, this)[0]),
            index = bisect(data, x0, 1);
        setActiveIndex(index);
      };

      const handleMouseLeave = () => {
        setActiveIndex(null);
      };
  

                  
      return (
        <div className="wrapper">
            <svg
                viewBox={`0 0 ${width + margin.left + margin.right} 
                                ${height + margin.top + margin.bottom}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
               {/* x- and y-axes} */}
                <g className="axis" ref={getYAxis} />
                <g
                    className="axis xAxis"
                    ref={getXAxis}
                    transform={`translate(0,${height})`}
                />
              {/* area and line paths */}
                <path fill={color} d={areaPath} opacity={0.3} />
                <path strokeWidth={3} fill="none" stroke={color} d={linePath} />
              {/* y-axis label */}
                <text
                    transform={"rotate(-90)"}
                    x={0 - height / 2} y={0 - margin.left} dy="1em">
                    {"USD"}
                </text>
              {/* map title */}
                <text
                    x={width / 2} y={0 - margin.top / 2} text-anchor="middle" >
                    {"USD to RUB Exchange Rates, 2020"}
                </text>

                {data.map((item, index) => {
                    return (
                        <g key={index}>
                        {/* hovering text  */}
                            <text
                                fill="#666"
                                x={getX(item.x)}
                                y={getY(item.y) - 20}
                                textAnchor="middle"
                            >
                                {index === activeIndex ? item.price : ""}
                            </text>
                          {/* hovering circle */}
                            <circle
                                cx={getX(item.x)}
                                cy={getY(item.y)}
                                r={index === activeIndex ? 6 : 4}
                                fill={color}
                                strokeWidth={index === activeIndex ? 2 : 0}
                                stroke="#fff"
                                style={{ transition: "ease-out .1s" }}
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
      );
    }
        
    

ReactDOM.render(
  <Map />,
  document.getElementById("root")
);
