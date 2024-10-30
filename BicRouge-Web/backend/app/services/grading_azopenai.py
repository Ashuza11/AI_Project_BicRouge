import openai
import json
import re
from core.config import settings

# Set up the OpenAI client to use Azure
openai.api_key = settings.azure_openai_api_key
openai.api_base = settings.azure_openai_endpoint
openai.api_type = "azure"
openai.api_version = "2024-05-01-preview"


async def get_grading_from_llm(
    role_prompt: str,
    grading_elements: str,
    instruction_prompt: str,
    output_strucutre: str,
):
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            engine=settings.azure_openai_deployment_name,
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": grading_elements},
                {"role": "user", "content": output_strucutre},
                {"role": "user", "content": instruction_prompt},
            ],
            temperature=0,
            max_tokens=3000,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None,
        )

        # Get the response text
        result = response["choices"][0]["message"]["content"]
        print("Response from OpenAI:", result)

        # Attempt to find valid JSON in the response
        result_json_match = re.search(r"\{.*\}", result, re.DOTALL)

        # If JSON found, parse it
        if result_json_match:
            # Extract the JSON part
            result_json = result_json_match.group(0)
            # Parse JSON
            grading_result = json.loads(result_json)
            return grading_result
        else:
            # Return an error message if no valid JSON is found
            print("No valid JSON found in the response.")
            return {"error": "No valid JSON found in the response."}

    except json.JSONDecodeError as e:
        print("Error decoding JSON response:", e)
        return {"error": "Invalid JSON response"}

    except Exception as e:
        print("An error occurred:", e)
        return {"error": str(e)}
