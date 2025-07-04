from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chunk_list(lst, chunk_size=10):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]

def summarize_chunk(feedback_chunk, role_name):
    text = "\n- ".join(feedback_chunk)
    prompt = f"""
You are an expert analyst. Summarize the following {role_name} feedback points into a concise paragraph:

- {text}
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()

def hierarchical_summarize(feedback_list, role_name):
    chunk_summaries = []
    for chunk in chunk_list(feedback_list, chunk_size=10):
        summary = summarize_chunk(chunk, role_name)
        chunk_summaries.append(summary)
    
    if len(chunk_summaries) == 1:
        return chunk_summaries[0]
    else:
        combined_text = "\n- ".join(chunk_summaries)
        prompt = f"""
You are an expert analyst. Summarize the following summarized {role_name} feedback points into a concise paragraph:

- {combined_text}
"""
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=1000
        )
        return response.choices[0].message.content.strip()

def final_combined_analysis(student_summary, trainer_summary):
    prompt = f"""
You are an expert educational analyst.

Here is the summary of student feedback about a session:
{student_summary}

Please provide:An integrated analysis highlighting the overall perfomance of trainers and the quality of sessions in less than 100 words."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()


def analyze_large_feedback(student_feedback):
    student_summary = hierarchical_summarize(student_feedback, "student")
    return student_summary


