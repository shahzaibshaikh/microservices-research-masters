import pandas as pd
import time
import subprocess
import json
from datetime import datetime, timedelta
import os

# Mapping of CSV filenames to Kubernetes deployment names
service_files = {
    "classified_predictions_User Account.csv": "user-account-depl",
    "classified_predictions_Review Rating.csv": "review-and-rating-depl",
    "classified_predictions_Product Catalog.csv": "product-catalog-depl",
    "classified_predictions_Order Management.csv": "order-management-depl",
    "classified_predictions_Payment Processing.csv": "payment-processing-depl",
    "classified_predictions_Shipping Logistics.csv": "shipping-and-logistics-depl",
}
# Offset for early trigger
offset = timedelta(minutes=5)

# Function to get current resource requests and limits
def get_current_resources(deployment_name):
    command = f"kubectl get deployment {deployment_name} -n default -o json"
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[ERROR] Failed to fetch current resources for {deployment_name}: {result.stderr}")
        return None

    deployment_info = json.loads(result.stdout)
    resources = deployment_info['spec']['template']['spec']['containers'][0]['resources']
    return resources

# Function to adjust resource requests and limits
def adjust_resources(deployment_name, scaling_action):
    resources = get_current_resources(deployment_name)
    if resources is None:
        return

    # Extract current requests and limits
    cpu_request = resources['requests']['cpu']
    memory_request = resources['requests']['memory']
    cpu_limit = resources['limits']['cpu']
    memory_limit = resources['limits']['memory']

    # Convert to integer values for calculations
    cpu_request_value = int(cpu_request[:-1])  # Remove 'm' for milli
    memory_request_value = int(memory_request[:-2])  # Remove 'Mi' for Mebibytes
    cpu_limit_value = int(cpu_limit[:-1])
    memory_limit_value = int(memory_limit[:-2])

    if scaling_action == "Vertical Upscale":
        new_cpu_request = int(cpu_request_value * 1.5)
        new_memory_request = int(memory_request_value * 1.5)
        new_cpu_limit = int(cpu_limit_value * 1.5)
        new_memory_limit = int(memory_limit_value * 1.5)
    elif scaling_action == "Vertical Downscale":
        initial_cpu_request = cpu_request_value
        initial_memory_request = memory_request_value
        initial_cpu_limit = cpu_limit_value
        initial_memory_limit = memory_limit_value

        new_cpu_request = max(int(cpu_request_value * 0.5), initial_cpu_request)
        new_memory_request = max(int(memory_request_value * 0.5), initial_memory_request)
        new_cpu_limit = max(int(cpu_limit_value * 0.5), initial_cpu_limit)
        new_memory_limit = max(int(memory_limit_value * 0.5), initial_memory_limit)
    else:
        return  # No valid action

    # Apply the new resource limits and requests
    command = (f"kubectl set resources deployment {deployment_name} -n default "
               f"--requests=cpu={new_cpu_request}m,memory={new_memory_request}Mi "
               f"--limits=cpu={new_cpu_limit}m,memory={new_memory_limit}Mi")
    
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"[INFO] Updated resources for {deployment_name}:")
        print(f"  CPU Request: {new_cpu_request}m, Memory Request: {new_memory_request}Mi")
        print(f"  CPU Limit: {new_cpu_limit}m, Memory Limit: {new_memory_limit}Mi")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to execute {command}: {e}")

# Main loop to trigger scaling actions for each service
while True:
    current_time = datetime.now()

    # Load and process each service's data
    for csv_file, deployment_name in service_files.items():
        print(f"[INFO] Checking actions for {deployment_name} from {csv_file} at {current_time}")

        # Load the forecast data
        if os.path.exists(csv_file):
            forecast_data = pd.read_csv(csv_file)
            forecast_data['Time'] = pd.to_datetime(forecast_data['Time'])

            # Infer the service-specific pod count column
            service_name = csv_file.split("_")[2].replace(".csv", "").strip()
            pod_count_column = f"{service_name} Pod Count"

            # Check for actions that need to be executed at this time with offset
            for index, row in forecast_data.iloc[::10].iterrows():
                action_time = row['Time']
                scaling_action = row['Scaling Action']
                pod_count = int(round(row[pod_count_column]))

                # Trigger actions 3 minutes before action_time
                if current_time >= (action_time - offset):
                    print(f"[INFO] Triggering action for {deployment_name}: {scaling_action} at {action_time}")
                    
                    # Determine the kubectl command based on scaling action
                    if "Horizontal" in scaling_action:
                        command = f"kubectl scale deployment {deployment_name} -n default --replicas={pod_count}"
                        try:
                            subprocess.run(command, shell=True, check=True)
                            print(f"[INFO] Executed: {command}")
                        except subprocess.CalledProcessError as e:
                            print(f"[ERROR] Failed to execute {command}: {e}")
                    elif "Vertical" in scaling_action:
                        adjust_resources(deployment_name, scaling_action)

                    # Remove the processed action from the DataFrame
                    forecast_data.drop(index, inplace=True)
                    forecast_data.to_csv(csv_file, index=False)  # Save changes
                    break  # Exit to avoid modifying the DataFrame while iterating
        else:
            print(f"[WARNING] CSV file {csv_file} not found for {deployment_name}")

    # Sleep for 10 minutes before checking again
    print("[INFO] Sleeping for 10 minutes before next check")
    time.sleep(600)
