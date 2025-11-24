import axiosInstance from './axiosInstance';

// Interface matching the Django NodeData model
export interface NodeData {
  node_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  pm25: number;
  worker_state: number;      // 0 = fine, 1 = alert
  worker_presence: number;   // 0 = not present, 1 = present
}

// Get all nodes data
export const getNodesData = async (): Promise<NodeData[]> => {
  try {
    const response = await axiosInstance.get<NodeData[]>('/nodeData/');
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes data:', error);
    throw error;
  }
};

// Get specific node data by ID
export const getNodeById = async (nodeId: string): Promise<NodeData> => {
  try {
    const response = await axiosInstance.get<NodeData>(`/nodesData/${nodeId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching node ${nodeId}:`, error);
    throw error;
  }
};

// Create new node data
export const createNodeData = async (data: Omit<NodeData, 'timestamp'>): Promise<NodeData> => {
  try {
    const response = await axiosInstance.post<NodeData>('/nodesData/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating node data:', error);
    throw error;
  }
};

// Update node data
export const updateNodeData = async (nodeId: string, data: Partial<NodeData>): Promise<NodeData> => {
  try {
    const response = await axiosInstance.put<NodeData>(`/nodesData/${nodeId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating node ${nodeId}:`, error);
    throw error;
  }
};

// Delete node data
export const deleteNodeData = async (nodeId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/nodesData/${nodeId}/`);
  } catch (error) {
    console.error(`Error deleting node ${nodeId}:`, error);
    throw error;
  }
};
