from fastapi import APIRouter, Request, FastAPI

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from feedback_summary import analyze_large_feedback
from material_feedback import analyze_session

app = FastAPI() 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],              # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],                # GET, POST, etc.
    allow_headers=["*"],                # Authorization, Content-Type, etc.
)

class SessionMaterialInput(BaseModel):
    topic: str
    description: str
    list_of_urls: list[str]


class FeedbackInput(BaseModel):
    comments: list[str]

@app.post("/material-feedback")
def get_material_feedback(data: SessionMaterialInput):
    print(f"Received data: {data}")
    try:
        material_feedback = analyze_session(data.list_of_urls, data.topic, data.description)

        return {"feedback": material_feedback}
    except Exception as e:
        return {"error": str(e)}

@app.post("/session-feedback")
def get_session_feedback(data: FeedbackInput):
    print(f"Received feedback data: {data}")
    try:
        session_feedback = analyze_large_feedback(data.comments)
        return {"feedback": session_feedback}
    except Exception as e:
        return {"error": str(e)}


