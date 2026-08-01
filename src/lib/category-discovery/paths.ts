import path from "node:path";

export interface CategoryDiscoveryPaths {
  runRoot: string;
  seedUniverse: string;
  clusterPortfolio: string;
  clusterBoundary: string;
  validation: string;
  lock: string;
}

export function getCategoryDiscoveryPaths(workspaceRoot: string, runId: string): CategoryDiscoveryPaths {
  const runRoot = path.join(workspaceRoot, "category-discovery", runId);
  return {
    runRoot,
    seedUniverse: path.join(runRoot, "seed-universe-contract.json"),
    clusterPortfolio: path.join(runRoot, "cluster-portfolio-discovery.json"),
    clusterBoundary: path.join(runRoot, "cluster-boundary-contract.json"),
    validation: path.join(runRoot, "category-discovery-validation.json"),
    lock: path.join(runRoot, "category-discovery.lock.json")
  };
}
