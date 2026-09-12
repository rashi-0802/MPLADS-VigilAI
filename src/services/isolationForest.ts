/**
 * Isolation Forest (iForest) Anomaly Detection Engine
 * Full authentic implementation of Liu, Ting & Zhou (2008)
 * 
 * Generates an unsupervised multivariate ML anomaly signal based on
 * path length in an ensemble of random partitioning trees.
 */

export interface MLFeatureVector {
  sanctionedCost: number;
  expenditure: number;
  financialProgress: number;
  physicalProgress: number;
  progressGap: number;
  projectDuration: number;
  delay: number;
  paymentCount: number;
  costRatio: number;
}

interface IsolationTreeNode {
  isLeaf: boolean;
  size: number;
  splitFeature?: number;
  splitValue?: number;
  left?: IsolationTreeNode;
  right?: IsolationTreeNode;
}

// Average path length of unsuccessful search in BST: c(n)
function c(n: number): number {
  if (n <= 1) return 1;
  if (n === 2) return 1;
  const euler = 0.5772156649;
  return 2 * (Math.log(n - 1) + euler) - (2 * (n - 1)) / n;
}

export class IsolationTree {
  root: IsolationTreeNode;
  maxDepth: number;

  constructor(data: number[][], currentDepth: number, maxDepth: number) {
    this.maxDepth = maxDepth;
    this.root = this.buildTree(data, currentDepth);
  }

  private buildTree(data: number[][], depth: number): IsolationTreeNode {
    const n = data.length;
    if (depth >= this.maxDepth || n <= 1) {
      return { isLeaf: true, size: n };
    }

    const numFeatures = data[0].length;
    // Choose a random feature
    const splitFeature = Math.floor(Math.random() * numFeatures);

    // Find min and max for the chosen feature
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < n; i++) {
      const val = data[i][splitFeature];
      if (val < min) min = val;
      if (val > max) max = val;
    }

    if (min === max) {
      return { isLeaf: true, size: n };
    }

    // Pick uniform random split point
    const splitValue = min + Math.random() * (max - min);

    const leftData: number[][] = [];
    const rightData: number[][] = [];

    for (let i = 0; i < n; i++) {
      if (data[i][splitFeature] < splitValue) {
        leftData.push(data[i]);
      } else {
        rightData.push(data[i]);
      }
    }

    return {
      isLeaf: false,
      size: n,
      splitFeature,
      splitValue,
      left: this.buildTree(leftData, depth + 1),
      right: this.buildTree(rightData, depth + 1),
    };
  }

  pathLength(point: number[], node: IsolationTreeNode, currentPath: number): number {
    if (node.isLeaf) {
      return currentPath + c(node.size);
    }

    const feat = node.splitFeature!;
    const val = node.splitValue!;

    if (point[feat] < val) {
      return node.left ? this.pathLength(point, node.left, currentPath + 1) : currentPath + 1;
    } else {
      return node.right ? this.pathLength(point, node.right, currentPath + 1) : currentPath + 1;
    }
  }
}

export class IsolationForestModel {
  trees: IsolationTree[] = [];
  subsampleSize: number;
  numTrees: number;
  private cN: number;

  constructor(numTrees: number = 60, subsampleSize: number = 128) {
    this.numTrees = numTrees;
    this.subsampleSize = subsampleSize;
    this.cN = c(subsampleSize);
  }

  fit(data: number[][]): void {
    this.trees = [];
    const n = data.length;
    if (n === 0) return;

    const sampleSize = Math.min(n, this.subsampleSize);
    this.cN = c(sampleSize);
    const maxDepth = Math.ceil(Math.log2(Math.max(2, sampleSize)));

    for (let t = 0; t < this.numTrees; t++) {
      // Subsample without replacement (or with random pick)
      const subsample: number[][] = [];
      const indices = new Set<number>();
      while (subsample.length < sampleSize && indices.size < n) {
        const idx = Math.floor(Math.random() * n);
        if (!indices.has(idx)) {
          indices.add(idx);
          subsample.push(data[idx]);
        }
      }
      this.trees.push(new IsolationTree(subsample, 0, maxDepth));
    }
  }

  predictScore(point: number[]): number {
    if (this.trees.length === 0) return 0.5;

    let totalPath = 0;
    for (const tree of this.trees) {
      totalPath += tree.pathLength(point, tree.root, 0);
    }

    const avgPathLength = totalPath / this.trees.length;
    // Anomaly score: s = 2 ^ (- avgPathLength / c(n))
    const score = Math.pow(2, -avgPathLength / (this.cN || 1));
    return +score.toFixed(3);
  }
}

export function extractFeatureVector(feat: MLFeatureVector): number[] {
  return [
    feat.sanctionedCost,
    feat.expenditure,
    feat.financialProgress,
    feat.physicalProgress,
    feat.progressGap,
    feat.projectDuration,
    feat.delay,
    feat.paymentCount,
    feat.costRatio * 10,
  ];
}
