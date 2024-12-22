FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create media and static directories
RUN mkdir -p media static core/static

# Create user and set permissions
RUN useradd -m myuser
COPY . .
RUN chown -R myuser:myuser /app
RUN chmod -R 755 /app  # Add write permissions
USER myuser

# Create entrypoint script
COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["bash", "entrypoint.sh"]