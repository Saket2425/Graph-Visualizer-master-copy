# Graph Visualizer

Graph Visualizer is an interactive web app for creating and visualizing graphs with support for algorithms like DFS, BFS, and Dijkstra's. It uses a physics-based, force-directed layout where nodes repel each other and edges pull connected nodes, offering an intuitive visualization experience.

## Features

- **Interactive Graph Creation**: Add nodes and edges dynamically with customizable weights.
- **Graph Algorithms**: Visualize DFS, BFS, and Dijkstra's algorithms with real-time, step-by-step animations.
- **Force-Directed Layout**: Nodes and edges naturally organize using attraction-repulsion physics.
- **Dynamic Updates**: Node distances and edge states update dynamically during algorithm execution.

## Visualization

The graph layout uses forces:
- **Repulsion**: Nodes push each other apart to avoid overlap.
- **Attraction**: Edges act like springs, pulling connected nodes closer together.

This creates a visually appealing, auto-organizing graph.

![Graph Visualization](./images/graph-visualization.png)

## Algorithms

### 1. **Depth-First Search (DFS)**

DFS explores as far as possible down each branch before backtracking.  
![DFS Animation](./gifs/dfs.gif)

### 2. **Breadth-First Search (BFS)**

BFS explores the graph level by level, visiting all neighbors before moving to the next level.  
![BFS Animation](./gifs/bfs.gif)

### 3. **Dijkstra's Algorithm**

Finds the shortest path from the start node, updating distances dynamically.  
![Dijkstra Animation](./gifs/dijkstra.gif)


