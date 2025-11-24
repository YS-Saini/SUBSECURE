import requests
import random
import time

API_URL = "http://127.0.0.1:8000/api/nodeData/"  # Make sure this matches your Django URL
HISTORY_URL = "http://127.0.0.1:8000/api/nodeHistory/"  # NodeHistory endpoint
UPDATE_INTERVAL = 15  # seconds

def get_all_nodes():
    """Fetch all nodes from the API."""
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching nodes: {e}")
        return []

def randomize_data():
    """Generate random values for the node fields."""
    return {
        "temperature": random.randint(15, 35),  # Example temperature range
        "humidity": random.randint(20, 80),     # Example humidity range
        "pm25": random.randint(0, 150),         # PM2.5 level
        "worker_state": random.randint(0, 1),   # 0 = fine, 1 = alert
        "worker_presence": random.randint(0, 1) # 0 = not present, 1 = present
    }

def update_node(node_id, data):
    """Send a PATCH request to update a node by node_id."""
    url = f"{API_URL}{node_id}/"
    try:
        response = requests.patch(url, json=data)
        if response.status_code == 200:
            print(f"Updated node {node_id}: {data}")
        else:
            print(f"Failed to update node {node_id}: {response.status_code}, {response.text}")
    except requests.RequestException as e:
        print(f"Error updating node {node_id}: {e}")

def post_to_history(node_id, data):
    """Send a POST request to create a NodeHistory entry."""
    history_data = {
        "node_id": node_id,
        **data
    }
    try:
        response = requests.post(HISTORY_URL, json=history_data)
        if response.status_code == 201:
            print(f"Posted to history for node {node_id}")
        else:
            print(f"Failed to post history for node {node_id}: {response.status_code}, {response.text}")
    except requests.RequestException as e:
        print(f"Error posting to history for node {node_id}: {e}")

def main():
    while True:
        nodes = get_all_nodes()
        if not nodes:
            print("No nodes found. Retrying...")
        for node in nodes:
            node_id = node["node_id"]
            new_data = randomize_data()
            update_node(node_id, new_data)
            post_to_history(node_id, new_data)  # Also save to history
        time.sleep(UPDATE_INTERVAL)

if __name__ == "__main__":
    main()
