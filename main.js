fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(data => {
        console.log(data)
                
        const width = 800;
        const height = 400;
        const padding = 40;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("text")
            .attr("id", "title")
            .attr("x", width / 2)
            .attr("y", padding)
            .attr("text-anchor", "middle")
            .text("GDP Over Time");

        const xScale = d3.scaleTime()
            .domain([new Date(d3.min(data.data, d => d[0])), new Date(d3.max(data.data, d => d[0]))])
            .range([padding, width - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.data, d => d[1])])
            .range([height - padding, padding]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.selectAll("rect")
            .data(data.data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", (width - 2 * padding) / data.data.length)
            .attr("height", d => height - padding - yScale(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .on("mouseover", (event, d) => {
                const tooltip = d3.select("#tooltip");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 9);
                tooltip.html("Date: " + d[0] + "<br>GDP: " + d[1])
                    .attr("data-date", d[0])
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                d3.select("#tooltip").transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("id", "x-axis")
            .attr("class", "tick")
            .attr("transform", "translate(0, " + (height - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ", 0)")
            .attr("class", "tick")
            .call(yAxis);

   
    })
    .catch(error => console.error(error));
