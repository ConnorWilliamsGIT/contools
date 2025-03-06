// src/app/models/boidInteraction.dict.ts

// Usage: boidInteraction["boid"]["shark"] is what a boid should do when it encounters a shark.

export const boidInteraction: {[index: string]:{[index: string]: any}} = {
 // Purpose: Dictionary of boid interactions. What should outerDictItem do when it encounters innerDictItem?
  boid: {
    boid: {
      separationFactor: 0.05,
      alignmentFactor: 0.02,
      cohesionFactor: 0.0005,
      avoidFactor: 0
    },
    shark: {
      separationFactor: 0.1,
      alignmentFactor: -0.001,
      cohesionFactor: -0.1,
      avoidFactor: 0.1
    }
  },
  shark: {
    boid: {
      separationFactor: 0.0,
      alignmentFactor: 0.0001,
      cohesionFactor: 0.001,
      avoidFactor: -0.1
    },
    shark: {
      separationFactor: 0.05,
      alignmentFactor: 0.02,
      cohesionFactor: 0.0005,
      avoidFactor: 1
    }
  }
}
