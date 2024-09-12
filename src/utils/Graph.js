class Graph {
  constructor(isDirected = false) {
    this.isDirected = isDirected;
    this.adjacencyList = new Map(); // stores adjacency list
    this.nodes = [];
    this.edges = [];
  }

  addNode(id) {
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, new Map()); // New node with empty neighbors
      this.nodes.push({ id });
    }
  }

  addEdge(source, target, weight = null) {
    if (!this.adjacencyList.has(source) || !this.adjacencyList.has(target)) {
      throw new Error("Both nodes must exist before adding an edge");
    }

    this.adjacencyList.get(source).set(target, weight);
    if (!this.isDirected) {
      this.adjacencyList.get(target).set(source, weight); // Add reverse edge for undirected
    }

    this.edges.push({ source, target, weight });
  }

  deleteNode(id) {
    if (this.adjacencyList.has(id)) {
      this.adjacencyList.delete(id);
      this.nodes = this.nodes.filter(node => node.id !== id);

      // Remove edges associated with this node
      this.edges = this.edges.filter(edge => edge.source !== id && edge.target !== id);

      // Remove node from neighbors
      this.adjacencyList.forEach((neighbors, node) => {
        neighbors.delete(id);
      });
    }
  }

  deleteEdge(source, target) {
    if (this.adjacencyList.has(source) && this.adjacencyList.get(source).has(target)) {
      this.adjacencyList.get(source).delete(target);
      if (!this.isDirected) {
        this.adjacencyList.get(target).delete(source); // Remove reverse edge for undirected
      }

      this.edges = this.edges.filter(edge => 
        !(edge.source === source && edge.target === target)
      );
    }
  }

  getAdjacencyList() {
    return this.adjacencyList;
  }

  getNodesAndEdges() {
    // Returning in the format needed by the visualizer
    return {
      nodes: this.nodes,
      edges: this.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        weight: edge.weight
      })),
    };
  }
  clone() {
    const newGraph = new Graph(this.isDirected);
    newGraph.nodes = [...this.nodes];
    newGraph.edges = [...this.edges];
    newGraph.adjacencyList = new Map(
      Array.from(this.adjacencyList.entries()).map(([key, value]) => [
        key,
        new Map(value)
      ])
    );
    return newGraph;
  }

}

export default Graph;
