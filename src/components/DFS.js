// components/DFS.js
import React, { useState } from 'react';
import DFSGraphVisualizer from './DFSVisualizer'; // Import your DFS graph visualizer component

const DFS = ({ graph }) => {
  const [startNode, setStartNode] = useState('');
  const [dfsSteps, setDfsSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleRunDFS = () => {
    const startNodeId = parseInt(startNode, 10);
    if (isNaN(startNodeId) || !graph.getAdjacencyList().has(startNodeId)) {
      alert('Invalid start node');
      return;
    }

    const steps = runDFS(startNodeId, graph.getAdjacencyList());
    setDfsSteps(steps);
    setCurrentStep(0); // Start from the first step
  };

  const runDFS = (startNode, adjacencyList) => {
    const steps = [];
    const visited = new Set();
    const stack = [startNode];
    const currentStepGraph = { nodes: [], edges: [] };

    while (stack.length) {
      const node = stack.pop();

      if (!visited.has(node)) {
        visited.add(node);
        currentStepGraph.nodes.push({ id: node });
        adjacencyList.get(node).forEach((weight, neighbor) => {
          currentStepGraph.edges.push({ source: node, target: neighbor, weight });
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        });

        // Save the current state of the graph
        steps.push({ ...currentStepGraph });
        currentStepGraph.nodes = [...currentStepGraph.nodes];
        currentStepGraph.edges = [...currentStepGraph.edges];
      }
    }

    return steps;
  };

  return (
    <div>
      <h2>DFS Visualization</h2>
      <div>
        <input
          type="text"
          value={startNode}
          onChange={(e) => setStartNode(e.target.value)}
          placeholder="Start Node ID"
        />
        <button onClick={handleRunDFS}>Start DFS</button>
      </div>
      {dfsSteps.length > 0 && (
        <DFSGraphVisualizer steps={dfsSteps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
      )}
    </div>
  );
};

export default DFS;
