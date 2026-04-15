from transformers import AutoModelForCausalLM, AutoTokenizer
import os
from huggingface_hub import login
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager
from pydantic import BaseModel

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

class chatQuery(BaseModel):
    file: str | None = None
    model: str | None = None
    api_key: str | None = None
    original_language: str
    target_language: str
    extra_details: str | None = ""

@app.post("/chat")
async def translate(query: chatQuery):
    input_data = query.model_dump()

    tokenizer, model = initialize_model()#will later need to take api_key

    messages = [
        {"role": "user", "content": 
            "Translate the following " + input_data["original_language"] + " segment into " + input_data["target_language"] + ", without additional explanation.\n\nUse these details: " + str(input_data["extra_details"]) + "\n\nばかやろ"}
    ]
    output_text = send_message(tokenizer, model, messages)

    return {"translation": output_text}

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
