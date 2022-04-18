# ehua-studies
HUA E-Studies Repository

Run web server via main to execute the tool
----------------------------------
$ uvicorn app.main:app --reload --port 8000

** Create virtual environment
```python3 -m venv venv```

** Activate the virtual environment
```source venv/bin/activate```

** install required packages
```pip3 install -r requirements.txt```

** run the project
```uvicorn app.main:app --reload --host 0.0.0.0 --port 8000```

** log into file
```uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --log-config ./app/log.ini```

#
Run web server via Docker
----------------------------------
** docker start
```docker-compose build```
```docker-compose up```

** docker end
```docker-compose down```