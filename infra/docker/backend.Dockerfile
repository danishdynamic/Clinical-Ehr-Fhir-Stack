# Use an official lightweight Python image
FROM python:3.12-slim

# Set environment variables to optimize Python execution inside Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /code

# Copy only the requirements file first to leverage Docker cache
COPY ./requirements.txt /code/requirements.txt

# Install dependencies without saving cache to keep image size small
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application code into the container
COPY ./app /code/app

# Expose port 8000 for network routing
EXPOSE 8000

# Run the FastAPI application using the built-in CLI command
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]
