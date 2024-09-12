// utils/dfs.js

export const dfsStepByStep = (graph, startNode) => {
    const visited = new Set();
    const stack = [startNode];
    const steps = [];
    let currentStep = [];
  
    while (stack.length > 0) {
      const node = stack.pop();
      if (!visited.has(node)) {
        visited.add(node);
        currentStep = Array.from(visited); // Capture the current state
        steps.push({ node, visited: [...visited] }); // Record the current step
        
        // Add adjacent nodes to the stack
        for (const neighbor of graph.getNeighbors(node)) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
  
    return steps;
  };
  