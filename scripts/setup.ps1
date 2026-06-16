Write-Host "Creating virtual environment..."

py -m venv .venv

.\.venv\Scripts\Activate.ps1

Write-Host "Installing backend dependencies..."

pip install -r requirements.txt

Write-Host "Installing frontend dependencies..."

cd frontend
npm install
cd ..

Write-Host "Setup complete."