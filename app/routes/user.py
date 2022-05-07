from fastapi import Depends, status
from fastapi import APIRouter
from fastapi.security import HTTPBasic
import os
from dotenv import load_dotenv
load_dotenv()

from ..auth.authentication import authenticate_admin, authenticate_webuser
security = HTTPBasic()

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# User main server route listener
user_router = APIRouter(
    prefix = os.getenv("API_URL") + '/users',
    tags=['users']
)

@user_router.get("/admin", status_code = status.HTTP_200_OK)
async def read_current_user(administrator: str = Depends(authenticate_admin)):
    """
    this function route returns the administrator db manager authenticate username
    """
    return {"administrator": administrator}

@user_router.get("/me", status_code = status.HTTP_200_OK)
async def read_current_user(username: str = Depends(authenticate_webuser)):
    """
    this function route returns the webservice API authenticate username
    """
    return {"username": username}
