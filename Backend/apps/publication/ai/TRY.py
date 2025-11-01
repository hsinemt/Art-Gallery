import requests


def generate(description):
    url = f"https://image.pollinations.ai/prompt/{description}"
    response = requests.get(url)
    with open("image.png", 'wb') as f:
        f.write(response.content)


# Example usage (disabled in import context):
# generate("a WOMEN with blue eyes and brown hair, smiling, close-up portrait, natural light")


