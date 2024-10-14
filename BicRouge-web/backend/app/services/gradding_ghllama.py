import json
import re
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from core.config import settings

# Azure OpenAI settings
endpoint = "https://models.inference.ai.azure.com"
model_name = "meta-llama-3-8b-instruct"
token = settings.github_api_key

# Initialize the client
client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)


# Function to get grading from LLM
async def get_grading_from_llm(
    role_prompt: str,
    grading_elements: str,
    instruction_prompt: str,
    output_structure: str,
):
    try:
        # Request completion from the LLM
        response = client.complete(
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": grading_elements},
                {"role": "user", "content": output_structure},
                {"role": "user", "content": instruction_prompt},
            ],
            model=model_name,
            temperature=0.3,
            max_tokens=4096,
            top_p=0.7,
            frequency_penalty=0,
            presence_penalty=0,
        )

        # Get the response text from LLM
        result = response["choices"][0]["message"]["content"]
        print("Response from LLAMA3-8B-Instruct:", result)

        # Escape problematic quotes inside the JSON string
        sanitized_result = result.replace("“", '"').replace("”", '"')
        print("Sanitized response:", sanitized_result)

        # Attempt to find valid JSON in the response
        result_json_match = re.search(r"\{.*\}", sanitized_result, re.DOTALL)

        if result_json_match:
            result_json = result_json_match.group(0)

            # Count opening and closing braces
            open_braces = result_json.count("{")
            close_braces = result_json.count("}")

            # Append missing closing brace(s) if necessary
            while open_braces > close_braces:
                result_json += "}"
                close_braces += 1

            try:
                # Now attempt to parse the JSON
                grading_result = json.loads(result_json)
                return grading_result
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON response: {e}")
                return {"error": "Invalid JSON response"}

        else:
            return {"error": "No valid JSON found in the response."}

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}")
        return {"error": "Invalid JSON response"}

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}
