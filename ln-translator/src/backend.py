from transformers import AutoModelForCausalLM, AutoTokenizer
import os
from huggingface_hub import login
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager
from pydantic import BaseModel
from google.cloud import translate_v2 as gtranslate
import google.auth.api_key
from pathlib import Path


load_dotenv()
login(token=os.getenv("HF_TOKEN"))

model_name_or_path = "tencent/HY-MT1.5-1.8B"

@asynccontextmanager

async def lifespan(app: FastAPI):

    yield  # Server is running         uvicorn ln-translator.src.backend:app --reload --host 0.0.0.0 --port 8000 

    print("Shutting down...")

app = FastAPI(

    title="LN Translator API",

    description="A FastAPI backend for ln translator",

    lifespan=lifespan

)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def google_translate(text, api_key, target_language):

    credentials = google.auth.api_key.Credentials(api_key)
    client = gtranslate.Client(credentials=credentials)
        
    response = client.translate(text, target_language=target_language)

    return response["translatedText"]

class chatQuery(BaseModel):
    file: str | None = None
    model: str | None = None
    api_key: str | None = None
    target_language: str | None = None
    extra_details: str | None = ""

@app.post("/chat")
async def translate(
    file: UploadFile = File(...),
    model: str = Form(...),
    api_key: str = Form(None),
    target_language: str = Form(...),
    extra_details: str = Form("")
    ):
    
    text = await file.read()
    text = text.decode("utf-8")
    
    if model == "google":
        translated = google_translate(text, api_key, target_language)
        return {"translation": translated}

    tokenizer, model_obj = initialize_model()

    messages = [
        {
            "role": "user",
            "content":
                f"Translate the following into {target_language}.\n\n"
                f"Use these details: {extra_details}\n\n{text}"
        }
    ]

    translated = send_message(tokenizer, model_obj, messages)

    return {"translation": translated}

def initialize_model():
    HF_TOKEN = os.getenv("HF_TOKEN")
    tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
    model = AutoModelForCausalLM.from_pretrained(model_name_or_path, device_map="auto")  # You may want to use bfloat16 and/or move to GPU here
    return tokenizer, model

def send_message(tokenizer, model, messages):
    tokenized_chat = tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        add_generation_prompt=False,
        return_tensors="pt"
    )

    outputs = model.generate(**tokenized_chat.to(model.device), max_new_tokens=2048)
    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return output_text
