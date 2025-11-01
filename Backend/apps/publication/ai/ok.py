# Import the Gemini AI client library
import google.generativeai as genai

# 🔑 Configure your Gemini API key
# ⚠️ Replace with your actual key, and never share it publicly
genai.configure(api_key="AIzaSyAANQ0DKx831iC-UeBWw_LkbcFQQH_rsVU")

# 🧠 Initialize the Gemini 2.5 Flash model
model = genai.GenerativeModel("gemini-2.5-flash")

def summarize_text(text):
    """
    Summarizes user-provided text (like a list of comments or feedback).
    """
    prompt = f"""
    You are a helpful assistant that summarizes feedback clearly.

    Here is the text you need to summarize:
    {text}

    Please provide a short summary highlighting:
    - The main positive and negative points
    - The overall sentiment
    - Suggestions for improvement
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"❌ Error: {e}"

if __name__ == "__main__":
    print("💬 Enter your comments or feedback below (press ENTER twice when done):\n")

    # 🧩 Read multiple lines of input from the user until they press Enter twice
    lines = []
    while True:
        line = input()
        if line == "":
            break
        lines.append(line)

    # Combine lines into a single text
    user_text = "\n".join(lines)

    print("\n🔄 Summarizing your input...\n")

    # Generate and print summary
    summary = summarize_text(user_text)
    print("📝 Summary:\n", summary)
