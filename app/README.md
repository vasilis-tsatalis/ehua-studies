# Backend Fastapi Application
Run web server via main to execute the tool
----------------------------------
$ uvicorn app.main:app --reload --port 8000

** Create virtual environment
```bash
python3 -m venv venv
```

** Activate the virtual environment
```bash
source venv/bin/activate
```

** install required packages
```bash
pip3 install -r requirements.txt
```

** run the project
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

** log into file
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --log-config ./app/log.ini
```