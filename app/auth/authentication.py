import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import os
from dotenv import load_dotenv
load_dotenv()

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
security = HTTPBasic()

async def authenticate_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """
    Administrator management (officer)
    """
    ADMIN_USERNAME = os.getenv("ADMIN_USER")
    ADMIN_PASS = os.getenv("ADMIN_PASS")
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASS)
    if not (correct_username and correct_password):
        # add http response not authorized 
        # function for errors
        message = "Forbidden 403"
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message,
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

async def authenticate_webuser(credentials: HTTPBasicCredentials = Depends(security)):
    """
    Web server - frontend (FE) + ADMIN
    """
    API_USERNAME = os.getenv("API_USER")
    API_PASS = os.getenv("API_PASS")
    #
    correct_username = secrets.compare_digest(credentials.username, API_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, API_PASS)
    if not (correct_username and correct_password):
        # check if is administrator
        ADMIN_USERNAME = os.getenv("ADMIN_USER")
        ADMIN_PASS = os.getenv("ADMIN_PASS")
        #
        correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
        correct_password = secrets.compare_digest(credentials.password, ADMIN_PASS)
        if not (correct_username and correct_password):
            # add http response not authorized 
            # function for errors
            message = "Unauthorized 401"
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=message,
                headers={"WWW-Authenticate": "Basic"},
            )
    return credentials.username
