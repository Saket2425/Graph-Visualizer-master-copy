import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BFSVisualizer = ({ graph, startNode }) => {
  const svgRef = useRef(null);
  const [bfsPath, setBfsPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [links, setLinks] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());

  const performBFS = (startNodeId) => {
    const visited = new Set();
    const path = [];
    const queue = [startNodeId];

    visited.add(startNodeId);

    while (queue.length > 0) {
      const nodeId = queue.shift();
      path.push(nodeId);

      const neighbors = graph.getAdjacencyList().get(nodeId);
      if (neighbors) {
        for (const neighbor of neighbors.keys()) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    return path;
  };

  useEffect(() => {
    if (startNode !== null) {
      const path = performBFS(startNode);
      setBfsPath(path);
    }
  }, [graph, startNode]);

  useEffect(() => {
    if (bfsPath.length > 0) {
      const interval = setInterval(() => {
        if (currentStep < bfsPath.length) {
          setVisitedNodes(prev => new Set(prev).add(bfsPath[currentStep]));
          setCurrentStep(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [bfsPath, currentStep]);

  useEffect(() => {
    const { nodes: graphNodes, edges } = graph.getNodesAndEdges();

    const initializedNodes = graphNodes.map(node => ({
      ...node,
      x: node.x || Math.random() * 800,
      y: node.y || Math.random() * 600,
    }));

    setNodes(initializedNodes);
    setLinks(edges);
  }, [graph]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30).iterations(2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", d => Math.sqrt(d.weight) || 2)
      .style("opacity", 0);

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
      .style("opacity", 0);

    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text(d => d.id) // Display node ID
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .style("opacity", 0);

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

  useEffect(() => {
    if (bfsPath.length > 0) {
      const highlightNodes = new Set(bfsPath.slice(0, currentStep));
      d3.select(svgRef.current).selectAll('.nodes circle')
        .style("opacity", d => highlightNodes.has(d.id) ? 1 : 0.1);

      d3.select(svgRef.current).selectAll('.labels text')
        .style("opacity", d => highlightNodes.has(d.id) ? 1 : 0.1);

      const revealedEdges = new Set();
      bfsPath.slice(0, currentStep).forEach(nodeId => {
        const neighbors = graph.getAdjacencyList().get(nodeId);
        if (neighbors) {
          neighbors.forEach((_, neighbor) => {
            if (!revealedEdges.has([nodeId, neighbor].toString()) && !revealedEdges.has([neighbor, nodeId].toString())) {
              d3.select(svgRef.current).selectAll('.links line')
                .filter(d => (d.source.id === nodeId && d.target.id === neighbor) || (d.source.id === neighbor && d.target.id === nodeId))
                .style("opacity", 1);
              revealedEdges.add([nodeId, neighbor].toString());
            }
          });
        }
      });
    }
  }, [currentStep, bfsPath]);

  return (
    <div>
      <h2>BFS Visualization</h2>
      <svg ref={svgRef} width="800" height="600" />
    </div>
  );
};

export default BFSVisualizer;
