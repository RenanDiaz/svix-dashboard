/**
 * Returns the color and text for a given status code
 * @param status - The status code to get info for
 * @returns An object with the color and text for the status
 */
export const getStatusInfo = (status: 0 | 1 | 2 | 3) => {
  switch (status) {
    case 0:
      return { color: "success", text: "Success" };
    case 1:
      return { color: "warning", text: "Pending" };
    case 2:
      return { color: "danger", text: "Failed" };
    case 3:
      return { color: "info", text: "Sending" };
  }
};

/**
 * Formats a date string into a human-readable format
 * @param dateString
 * @returns A human-readable date string
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Formats a date string into a human-readable format
 * @param datetimeString - The date and time string to format
 * @returns A human-readable date and time string
 */
export const formatDatetime = (datetimeString: string) => {
  const date = new Date(datetimeString);
  return date.toLocaleString();
};

/**
 * Represents a node in the hierarchical tree structure
 */
export type TreeNode = { name: string; children?: TreeNode[] };

/**
 * Converts a flat list of paths into a hierarchical TreeNode structure
 * with full paths as names
 * @param items - An array of strings representing paths (e.g., 'transaction.deposit.usd')
 * @returns An array of TreeNode objects representing the hierarchical structure
 */
export function createHierarchicalTree(items: string[]): TreeNode[] {
  if (!items.length) return [];

  // Infer the separator character by finding the most common non-alphanumeric character
  const separatorCounts = new Map<string, number>();
  const nonAlphanumericRegex = /[^a-zA-Z0-9]/g;

  for (const item of items) {
    const matches = item.match(nonAlphanumericRegex);
    if (matches) {
      for (const match of matches) {
        separatorCounts.set(match, (separatorCounts.get(match) || 0) + 1);
      }
    }
  }

  // Find the most common separator using Array.from instead of direct iteration
  let separator = ".";
  let maxCount = 0;

  // Convert Map entries to array to avoid iterator issues
  const entries = Array.from(separatorCounts.entries());
  for (let i = 0; i < entries.length; i++) {
    const [char, count] = entries[i];
    if (count > maxCount) {
      maxCount = count;
      separator = char;
    }
  }

  // Create the root nodes
  const rootNodes: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  // Process each item
  for (const item of items) {
    const parts = item.split(separator);
    let currentPath = "";
    let parentNode: TreeNode | null = null;

    // Build each level of the path
    for (let i = 0; i < parts.length; i++) {
      // Build the current path segment
      currentPath = i === 0 ? parts[i] : `${currentPath}${separator}${parts[i]}`;

      // Check if we've already created this node
      if (!nodeMap.has(currentPath)) {
        // Create the new node with the full path as the name
        const newNode: TreeNode = { name: currentPath };
        nodeMap.set(currentPath, newNode);

        // Add to parent node's children or to root nodes if no parent
        if (parentNode) {
          if (!parentNode.children) {
            parentNode.children = [];
          }
          parentNode.children.push(newNode);
        } else {
          rootNodes.push(newNode);
        }
      }

      // Set current node as parent for next iteration
      parentNode = nodeMap.get(currentPath) || null;
    }
  }

  return rootNodes;
}

/**
 * Checks if two string arrays are equal, regardless of order
 * @param arr1 - The first string array
 * @param arr2 - The second string array
 * @returns True if the arrays are equal, false otherwise
 */

export function stringArraysAreEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item) => arr2.includes(item));
}
