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

# Create user
RUN useradd -m myuser

# Copy project files and set permissions
COPY . .
RUN chmod +x entrypoint.sh
RUN chown -R myuser:myuser /app
RUN chmod -R 755 /app

# Switch to non-root user
USER myuser

ENTRYPOINT ["bash", "entrypoint.sh"]