# Start with a base image
FROM python:3.11-slim

# Install system dependencies including cron and kubectl
RUN apt-get update && apt-get install -y \
  cron \
  curl \
  && curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
  && chmod +x kubectl \
  && mv kubectl /usr/local/bin/ \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy your application code to the container
COPY app/ /app/
COPY models/ /models/
COPY classification_models/ /classification_models/

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the crontab file for scheduling tasks
COPY crontab /etc/cron.d/forecasting-cron

# Set the permissions for the crontab file
RUN chmod 0644 /etc/cron.d/forecasting-cron

# Apply the crontab configuration
RUN crontab /etc/cron.d/forecasting-cron

# Ensure log file exists and is writable
RUN touch /var/log/cron.log && chmod 0644 /var/log/cron.log

# Set the command to run scaling.py in the foreground and cron in the background
CMD ["bash", "-c", "python /app/scaling.py & cron -f"]
