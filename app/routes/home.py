from fastapi import APIRouter
from fastapi.responses import HTMLResponse
import os
from dotenv import load_dotenv
load_dotenv()


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Default main server route listener
home_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['Default']
)

@home_router.get("/", response_class=HTMLResponse)
@home_router.get("/home", response_class=HTMLResponse)
async def root():

    return """
        <html>
            <head>
                <title>eHUA</title>
            </head>
            <body>
                <h3><i>eHUA studies repository</i></h3>
            </body>
        </html>
    """