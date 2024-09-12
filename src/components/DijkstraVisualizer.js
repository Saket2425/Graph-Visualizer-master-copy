import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DijkstraVisualizer = ({ graph, startNode }) => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distances, setDistances] = useState(new Map());
  const [previousNodes, setPreviousNodes] = useState(new Map());
  const [queue, setQueue] = useState(new Map());

  const initializeDijkstra = () => {
    const { nodes: graphNodes, edges } = graph.getNodesAndEdges();
    const initialDistances = new Map();
    const initialPreviousNodes = new Map();
    const initialQueue = new Map();

    graphNodes.forEach(node => {
      initialDistances.set(node.id, Infinity);
      initialPreviousNodes.set(node.id, null);
      initialQueue.set(node.id, Infinity);
    });

    initialDistances.set(startNode, 0);
    initialQueue.set(startNode, 0);

    setDistances(initialDistances);
    setPreviousNodes(initialPreviousNodes);
    setQueue(initialQueue);
    setNodes(graphNodes);
    setLinks(edges);
  };

  const performDijkstraStep = () => {
    const distancesCopy = new Map(distances);
    const previousNodesCopy = new Map(previousNodes);
    const queueCopy = new Map(queue);

    const nodesQueue = Array.from(queue.keys());

    if (nodesQueue.length === 0) return;

    const currentNode = nodesQueue.reduce((minNode, node) => queueCopy.get(node) < queueCopy.get(minNode) ? node : minNode);
    nodesQueue.splice(nodesQueue.indexOf(currentNode), 1);

    const neighbors = graph.getAdjacencyList().get(currentNode) || new Map();

    neighbors.forEach((weight, neighbor) => {
      const newDistance = distancesCopy.get(currentNode) + weight;
      if (newDistance < distancesCopy.get(neighbor)) {
        distancesCopy.set(neighbor, newDistance);
        previousNodesCopy.set(neighbor, currentNode);
        queueCopy.set(neighbor, newDistance);
      }
    });

    queueCopy.delete(currentNode);
    setDistances(new Map(distancesCopy));
    setPreviousNodes(new Map(previousNodesCopy));
    setQueue(new Map(queueCopy));
    setCurrentStep(prevStep => prevStep + 1);
  };

  useEffect(() => {
    if (startNode !== null) {
      initializeDijkstra();
    }
  }, [startNode]);

  useEffect(() => {
    if (distances.size > 0) {
      const interval = setInterval(() => {
        performDijkstraStep();
        if (queue.size === 0) {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [distances]);

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
      .style("opacity", 0.5);

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 15)
      .attr("fill", "#1f77b4")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

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
      .attr("y", d => d.y);

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
    if (nodes.length > 0) {
      d3.select(svgRef.current).selectAll('.nodes circle')
        .style("fill", d => (queue.has(d.id) ? "#ff7f0e" : "#1f77b4"))
        .style("opacity", d => (distances.get(d.id) !== undefined ? 1 : 0.1));

      d3.select(svgRef.current).selectAll('.labels text')
        .text(d => `${d.id}: ${distances.get(d.id) === undefined ? '∞' : distances.get(d.id)}`)
        .attr("fill", d => (d.id === startNode ? "red" : "#fff"));
    }
  }, [distances, queue, currentStep]);

  return (
    <div>
      <h2>Dijkstra's Algorithm Visualization</h2>
      <svg ref={svgRef} width="800" height="600" />
    </div>
  );
};

export default DijkstraVisualizer;
