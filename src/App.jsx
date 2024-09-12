import React, { useState } from 'react';
import GraphVisualizer from './components/GraphVisualizer';
import Graph from './utils/Graph';
import DFSVisualizer from './components/DFSVisualizer';
import BFSVisualizer from './components/BFSVisualizer';
import DijkstraVisualizer from './components/DijkstraVisualizer';
import './App.css';  // Make sure you import the updated CSS

const App = () => {
  const [graph] = useState(new Graph(false)); // Create an undirected graph by default
  const [newEdgeFrom, setNewEdgeFrom] = useState('');
  const [newEdgeTo, setNewEdgeTo] = useState('');
  const [newEdgeWeight, setNewEdgeWeight] = useState('');
  const [graphData, setGraphData] = useState(graph.getNodesAndEdges());
  const [startNode, setStartNode] = useState('');
  const [viewMode, setViewMode] = useState(''); // 'dfs', 'bfs', or 'dijkstra'

  const addNode = () => {
    graph.addNode(graph.nodes.length);
    updateGraph();
  };

  const addEdge = () => {
    const from = parseInt(newEdgeFrom, 10);
    const to = parseInt(newEdgeTo, 10);
    const weight = newEdgeWeight ? parseFloat(newEdgeWeight) : 1; // Default weight to 1 if not specified

    if (isNaN(from) || isNaN(to)) {
      alert('Invalid node IDs');
      return;
    }

    graph.addEdge(from, to, weight);
    updateGraph();
    setNewEdgeFrom('');
    setNewEdgeTo('');
    setNewEdgeWeight('');
  };

  const updateGraph = () => {
    setGraphData(graph.getNodesAndEdges());
  };

  const handleStartNodeChange = (event) => {
    setStartNode(event.target.value);
  };

  const handleVisualizationChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="container">
      <h1>Graph Visualizer</h1>

      <div className="input-group">
        <button onClick={addNode}>Add Node</button>
        <input
          type="text"
          value={newEdgeFrom}
          onChange={(e) => setNewEdgeFrom(e.target.value)}
          placeholder="From Node ID"
        />
        <input
          type="text"
          value={newEdgeTo}
          onChange={(e) => setNewEdgeTo(e.target.value)}
          placeholder="To Node ID"
        />
        <input
          type="text"
          value={newEdgeWeight}
          onChange={(e) => setNewEdgeWeight(e.target.value)}
          placeholder="Edge Weight (optional)"
        />
        <button onClick={addEdge}>Add Edge</button>
      </div>

      <div className="graph-visualizer">
        <GraphVisualizer graphData={graphData} />
      </div>

      <div className="input-group">
        <input
          type="text"
          value={startNode}
          onChange={handleStartNodeChange}
          placeholder="Start Node ID"
        />
        <button onClick={() => handleVisualizationChange('dfs')}>Run DFS</button>
        <button onClick={() => handleVisualizationChange('bfs')}>Run BFS</button>
        <button onClick={() => handleVisualizationChange('dijkstra')}>Run Dijkstra's</button>
      </div>

      {viewMode === 'dfs' && startNode && (
        <DFSVisualizer graph={graph} startNode={parseInt(startNode, 10)} />
      )}
      {viewMode === 'bfs' && startNode && (
        <BFSVisualizer graph={graph} startNode={parseInt(startNode, 10)} />
      )}
      {viewMode === 'dijkstra' && startNode && (
        <DijkstraVisualizer 
          graph={graph} 
          startNode={parseInt(startNode, 10)}
        />
      )}
    </div>
  );
};

export default App;
