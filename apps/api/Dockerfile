FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./apps/api/requirements.txt
RUN pip install --no-cache-dir -r ./apps/api/requirements.txt

COPY . ./apps/api/

# Make the app importable as a package (apps.api.main) so that the
# relative imports used throughout apps/api resolve correctly when
# started with `python -m uvicorn`.
RUN mkdir -p /app/apps && touch /app/apps/__init__.py

EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn apps.api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
