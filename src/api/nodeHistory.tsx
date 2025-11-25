import axiosInstance from './axiosInstance';

// Interface matching the Django NodeHistory model
export interface NodeHistory {
  id?: number;
  timestamp: string;
  node_id: string;
  temperature: number;
  humidity: number;
  pm25: number;
  worker_state: number;      // 0 = fine, 1 = alert
  worker_presence: number;   // 0 = not present, 1 = present
}

// Get all node history data
export const getNodeHistory = async (): Promise<NodeHistory[]> => {
  try {
    const response = await axiosInstance.get<NodeHistory[]>('/nodeHistory/');
    return response.data;
  } catch (error) {
    console.error('Error fetching node history:', error);
    throw error;
  }
};

// Get history for a specific node
export const getNodeHistoryByNodeId = async (nodeId: string): Promise<NodeHistory[]> => {
  try {
    const response = await axiosInstance.get<NodeHistory[]>('/nodeHistory/');
    // Filter by node_id on the client side
    return response.data.filter(history => history.node_id === nodeId);
  } catch (error) {
    console.error(`Error fetching history for node ${nodeId}:`, error);
    throw error;
  }
};

// Create new node history entry
export const createNodeHistory = async (data: Omit<NodeHistory, 'id' | 'timestamp'>): Promise<NodeHistory> => {
  try {
    const response = await axiosInstance.post<NodeHistory>('/nodeHistory/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating node history:', error);
    throw error;
  }
};

// Get latest history entries (limit by count)
export const getLatestNodeHistory = async (limit: number = 100): Promise<NodeHistory[]> => {
  try {
    const response = await axiosInstance.get<NodeHistory[]>('/nodeHistory/');
    // Since data is ordered by -timestamp in backend, just slice the result
    return response.data.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest node history:', error);
    throw error;
  }
};

// Get history within a date range
export const getNodeHistoryByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<NodeHistory[]> => {
  try {
    const response = await axiosInstance.get<NodeHistory[]>('/nodeHistory/');
    // Filter by date range on the client side
    return response.data.filter(history => {
      const historyDate = new Date(history.timestamp);
      return historyDate >= startDate && historyDate <= endDate;
    });
  } catch (error) {
    console.error('Error fetching node history by date range:', error);
    throw error;
  }
};
