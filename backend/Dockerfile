FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create media and static directories
RUN mkdir -p media static

# Create entrypoint script
COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

# Run as non-root user
RUN useradd -m myuser
RUN chown -R myuser:myuser /app
USER myuser

ENTRYPOINT ["bash", "entrypoint.sh"]