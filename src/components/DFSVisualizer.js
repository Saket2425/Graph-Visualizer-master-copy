import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DFSVisualizer = ({ graph, startNode }) => {
  const svgRef = useRef(null);
  const [dfsPath, setDfsPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [links, setLinks] = useState([]);
  const [nodes, setNodes] = useState([]);

  // Function to perform DFS and get the path
  const performDFS = (startNodeId) => {
    const visited = new Set();
    const path = [];

    const dfsRecursive = (nodeId) => {
      visited.add(nodeId);
      path.push(nodeId);
      console.log(nodeId);
      const neighbors = graph.getAdjacencyList().get(nodeId);
      if (neighbors) {
        for (const neighbor of neighbors.keys()) {
          if (!visited.has(neighbor)) {
            dfsRecursive(neighbor);
          }
        }
      }
    };

    dfsRecursive(startNodeId);
    return path;
  };

  // Run DFS when the graph or startNode changes
  useEffect(() => {
    if (startNode !== null) {
      const path = performDFS(startNode);
      setDfsPath(path);
    }
  }, [graph, startNode]);

  // Progressively update the current step in DFS path
  useEffect(() => {
    if (dfsPath.length > 0) {
      const interval = setInterval(() => {
        if (currentStep < dfsPath.length) {
          setCurrentStep(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 2000); // Adjust interval for visualization speed
      return () => clearInterval(interval);
    }
  }, [dfsPath, currentStep]);

  // Update nodes and links on graph change
  useEffect(() => {
    const { nodes: graphNodes, edges } = graph.getNodesAndEdges();

    // Initialize node positions if not already set
    const initializedNodes = graphNodes.map(node => ({
      ...node,
      x: node.x || Math.random() * 800,
      y: node.y || Math.random() * 600,
    }));

    setNodes(initializedNodes);
    setLinks(edges);
  }, [graph]);

  // Set up D3.js simulation and graph rendering
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Force simulation for the graph
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30).iterations(2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Render edges (links) between nodes
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", d => Math.sqrt(d.weight) || 2)
      .style("opacity", 0); // Initially hide edges

    // Render nodes (circles)
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 15)
      .attr("fill", "#1f77b4")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .style("opacity", 0); // Initially hide nodes

    // Render node labels (node IDs)
    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text(d => d.id)  // Display node ID
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .style("opacity", 0); // Initially hide labels

    // Update node and link positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  // Handle updating nodes and links visibility based on DFS step
  useEffect(() => {
    if (currentStep > 0) {
      const stepNode = dfsPath[currentStep - 1];
      
      // Reveal the node corresponding to the current DFS step
      d3.select(svgRef.current).selectAll('.nodes circle')
        .filter(d => d.id === stepNode)
        .style("opacity", 1); // Make the node visible

      // Reveal node labels (IDs) at the current step
      d3.select(svgRef.current).selectAll('.labels text')
        .filter(d => d.id === stepNode)
        .style("opacity", 1); // Make the label visible

      // Reveal edges connected to the current node
      const neighbors = graph.getAdjacencyList().get(stepNode);
      if (neighbors) {
        neighbors.forEach((_, neighbor) => {
          d3.select(svgRef.current).selectAll('.links line')
            .filter(d => (d.source.id === stepNode && d.target.id === neighbor) || (d.source.id === neighbor && d.target.id === stepNode))
            .style("opacity", 1); // Make the edges visible
        });
      }
    }
  }, [currentStep, dfsPath]);

  return (
    <div>
      <h2>DFS Visualization</h2>
      <svg ref={svgRef} width="800" height="600" />
    </div>
  );
};

export default DFSVisualizer;
