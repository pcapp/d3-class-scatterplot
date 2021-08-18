import * as d3 from "d3";

async function drawScatter() {
  const data = await d3.json("data/my_weather_data.json");

  const xAccessor = d => d.dewPoint;
  const yAccessor = d => d.humidity;

  const length = d3.min([window.innerWidth, window.innerHeight]) * 0.9;

  const dims = {
    height: length,
    width: length,
    margins: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50
    }
  };

  dims.boundedWidth = dims.width - dims.margins.left - dims.margins.right;
  dims.boundedHeight = dims.height - dims.margins.top - dims.margins.bottom;

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dims.width)
    .attr("height", dims.height)
    .style("border", "1px solid");

  const bounds = wrapper.append("g").style(
    "transform",
    `translate(
      ${dims.margins.left}px, ${dims.margins.top}px
    )`
  );

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dims.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dims.boundedHeight, 0])
    .nice();

  bounds
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 3);

   
  const xAxisGenerator = d3.axisBottom()
      .scale(xScale);

  const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(
        ${dims.boundedHeight
      }px)`);

  xAxis.append("text")
        .attr("x", dims.boundedWidth / 2)
        .attr("y", dims.margins.bottom - 10)
        .attr("fill", "#000")
        .style("font-size", "1.4em")
        .html("Dew Point (&deg;F)");
  
  const yAxisGenerator = d3.axisLeft()
        .scale(yScale);
    
  const yAxis = bounds.append("g")
        .call(yAxisGenerator);
}
drawScatter();
