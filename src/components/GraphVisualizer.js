import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphVisualizer = ({ graphData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const { nodes, edges } = graphData;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Create the force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30).iterations(2))  // Prevent node overlap
      .force('x', d3.forceX(width / 2).strength(0.05)) // Keep nodes within horizontal bounds
      .force('y', d3.forceY(height / 2).strength(0.05)); // Keep nodes within vertical bounds

    // Add links (edges)
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(edges)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", d => Math.sqrt(d.weight) || 2);

    // Add nodes (circles)
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 15)
      .attr("fill", "#1f77b4");

    // Add node labels (numbers)
    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("dy", 4) // Vertical alignment for text
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text(d => d.id);  // Display the node id as text

    // Add edge weight labels
    const edgeLabels = svg.append("g")
      .attr("class", "edge-labels")
      .selectAll("text")
      .data(edges)
      .enter().append("text")
      .attr("fill", "#000")
      .attr("font-size", "12px")
      .text(d => d.weight);  // Display the weight of the edge

    // Ensure nodes stay within bounds
    const clampPosition = (min, max, value) => Math.max(min, Math.min(max, value));

    // Update positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => clampPosition(0, width, d.source.x))
        .attr("y1", d => clampPosition(0, height, d.source.y))
        .attr("x2", d => clampPosition(0, width, d.target.x))
        .attr("y2", d => clampPosition(0, height, d.target.y));

      node
        .attr("cx", d => clampPosition(0, width, d.x))
        .attr("cy", d => clampPosition(0, height, d.y));

      labels
        .attr("x", d => clampPosition(0, width, d.x))
        .attr("y", d => clampPosition(0, height, d.y));

      edgeLabels
        .attr("x", d => (clampPosition(0, width, d.source.x) + clampPosition(0, width, d.target.x)) / 2)
        .attr("y", d => (clampPosition(0, height, d.source.y) + clampPosition(0, height, d.target.y)) / 2);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  return (
    <svg ref={svgRef} width="800" height="600" />
  );
};

export default GraphVisualizer;
