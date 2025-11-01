# Start with a base image that has Python and build essentials
FROM python:3.11-slim

# ====================================================================
# STEP 1: Install System Dependencies for Compilation (like dlib, psycopg2)
# ====================================================================
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
    # Clean up APT caches to reduce image size
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=artGallery.settings

# Set the working directory
WORKDIR /app

# ====================================================================
# STEP 2: Install Python Dependencies
# ====================================================================
# Copy the requirements file and install dependencies
COPY requirements.txt /app/
# --no-cache-dir saves space, building wheels for complex packages will now be faster
RUN pip install --no-cache-dir -r requirements.txt

# ====================================================================
# STEP 3: Fix SECRET_KEY for Build-Time Commands
# ====================================================================
# Inject a temporary dummy key to bypass Django checks during build/collectstatic.
# This key is NOT secure and will be overridden by your secure Railway environment variable.
ARG DJANGO_SECRET_KEY='a_temporary_and_non_secret_key_for_build_only'
ENV SECRET_KEY=$DJANGO_SECRET_KEY

# Copy the rest of the application code
COPY . /app

# ====================================================================
# STEP 4: Run Build-Time Commands (Collect Static Files)
# ====================================================================
# Collect static files during the build.
RUN python manage.py collectstatic --no-input

# ====================================================================
# STEP 5: Configure Runtime (Final Image Setup)
# ====================================================================
# Expose the port
ENV PORT 8000
EXPOSE 8000

# Set the start command. This command runs *after* the container is built.
# NOTE: The actual command should be defined in your Railway UI to ensure it
# overrides this CMD and correctly runs migrations.
# Your Railway UI Start Command: python manage.py migrate --no-input && gunicorn artGallery.wsgi:application --bind 0.0.0.0:$PORT
CMD gunicorn artGallery.wsgi:application --bind 0.0.0.0:$PORT
