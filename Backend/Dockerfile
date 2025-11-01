# Start with a base image that has Python and build essentials
FROM python:3.11-slim

# Install system dependencies needed for dlib, psycopg2, etc.
# libpq-dev is for psycopg2 build, cmake is often required by dlib
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    cmake \
    libjpeg-dev \
    zlib1g-dev \
    libsm-dev \
    libxext-dev \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=artGallery.settings

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt /app/
# The install step will now be much faster as dependencies are satisfied
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app

# Collect static files during the build, which is fast and doesn't need the DB
RUN python manage.py collectstatic --no-input

# Expose the port
ENV PORT 8000
EXPOSE 8000

# Set the  start command (which handles migration first)
CMD python manage.py migrate --no-input && gunicorn artGallery.wsgi:application --bind 0.0.0.0:$PORT
