import * as d3 from 'd3';
import { useEffect } from 'react';
import './HeatMap.css';
import { DataValue, colors, months } from '../utils/helper';

const HeatMap = () => {
  const width = 1200;
  const height = 600;
  const padding = 60;

  useEffect(() => {
    if (d3.select('#text').empty()) {
      const tooltip = d3
        .select('#tooltip')
        .attr('opacity', 0)
        .style('display', 'none');

      const container = d3.select('.chart-container');

      const svg = d3
        .select('#chart')
        .attr('width', width)
        .attr('height', height);

      container
        .select('#title')
        .attr('x', '420')
        .attr('y', '-50')
        .style('text-anchor', 'middle')
        .text('Doping in Professional Bicycle Racing')
        .style('font-size', '30px');

      d3.json<DataValue>(
        'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
      ).then((data) => {
        const values = data?.monthlyVariance;
        const baseTemperature = data?.baseTemperature;
        const years = values?.map((d) => d.year);

        container
          .select('#description')
          .attr('x', '420')
          .attr('y', '-25')
          .style('text-anchor', 'middle')
          .html(
            d3.min(years) +
              ' - ' +
              d3.max(years) +
              ': base Temperature ' +
              baseTemperature +
              '℃'
          )
          .style('font-size', '20px');

        // X-axis
        const xScale = d3
          .scaleLinear()
          .domain([d3.min(years), d3.max(years) + 1])
          .range([padding, width - padding]);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

        svg
          .append('g')
          .call(xAxis)
          .attr('id', 'x-axis')
          .attr('transform', `translate(0,${height - padding})`);

        // Y-axis
        const firstMonth = new Date(0, 0, 0, 0, 0, 0, 0);
        const lastMonth = new Date(0, 12, 0, 0, 0, 0, 0);
        const yScale = d3
          .scaleTime()
          .domain([firstMonth, lastMonth])
          .range([padding, height - padding]);

        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

        svg
          .append('g')
          .call(yAxis)
          .attr('id', 'y-axis')
          .attr('transform', `translate(${padding},0)`);

        // Data
        svg
          .selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('class', 'cell')
          .attr('fill', (d) => {
            if (d.variance <= -1) {
              return colors[0];
            } else if (d.variance <= 0) {
              return colors[1];
            } else if (d.variance < 1) {
              return colors[2];
            } else {
              return colors[colors.length - 1];
            }
          })
          .attr('data-month', (d) => d.month - 1)
          .attr('data-year', (d) => d.year)
          .attr('data-temp', (d) => baseTemperature + d.variance)
          .attr('height', (height - 120) / 12)
          .attr('y', (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
          .attr('width', (d) => {
            const numOfYears = d3.max(years) - d3.min(years);
            return (width - 120) / numOfYears;
          })
          .attr('x', (d) => xScale(d.year))
          .on('mouseover', (e, d) => {
            tooltip.style('opacity', 0.9).style('display', 'block');

            tooltip
              .html(
                d.year +
                  ' - ' +
                  months[d.month - 1] +
                  '<br/>' +
                  (baseTemperature + d.variance).toFixed(1) +
                  '℃<br/>' +
                  d.variance.toFixed(1) +
                  '℃'
              )
              .style('left', (d) => e.pageX - 60 + 'px')
              .style('top', (d) => e.pageY - 100 + 'px')
              .attr('data-year', d.year);

            d3.select(this)
              .style('stroke', '#000')
              .style('stroke-width', '2px');
          })
          .on('mouseout', (e, d) => {
            tooltip.style('opacity', 0).style('display', 'none');
            d3.select(this).style('stroke', 'none');
          });

        // Legend
        const legend = d3.select('#legend');

        const legendLabels = [
          'Variance of -1 or less',
          'On or Below Average',
          'Above Average',
          'Variance of +1 or more',
        ];
        const legendBlocks = legend
          .selectAll('g')
          .data(colors)
          .enter()
          .append('g');

        legendBlocks
          .append('rect')
          .attr('width', 40)
          .attr('height', 40)
          .attr('fill', (d, i) => {
            return colors[i];
          })
          .attr('x', 10)
          .attr('y', (d, i) => {
            return i * 40;
          });

        legendBlocks
          .append('text')
          .text((_, i) => {
            return legendLabels[i];
          })
          .attr('x', 60)
          .attr('y', (d, i) => {
            return 20 + 40 * i;
          });
      });
    }
  });

  return (
    <div className="chart-container">
      <div className="row">
        <h1 id="title"></h1>
        <h3 id="description"></h3>
      </div>
      <div id="tooltip"></div>
      <div className="content">
        <svg id="chart"></svg>
        <svg id="legend"></svg>
      </div>
    </div>
  );
};

export default HeatMap;
