import openai
import json
import re
from core.config import settings

# Access the OpenAI API key
openai.api_key = settings.openai_api_key


# Handle other potential issues by making sure JSON strings are properly quoted
def ensure_proper_json_format(json_string):
    # Replace any instances of improperly placed quotes due to sanitization
    # This will handle cases where 'L'étudiant' shouldn't be converted to 'L"étudiant'
    return re.sub(r'(\w)"(\w)', r"\1\'\2", json_string)


async def get_grading_from_llm(
    role_prompt: str,
    grading_elements: str,
    instruction_prompt: str,
    output_strucutre: str,
):
    print("Role prompt:", grading_elements)
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": grading_elements},
                {"role": "user", "content": output_strucutre},
                {"role": "user", "content": instruction_prompt},
            ],
            temperature=0.2,
            max_tokens=3500,
            top_p=0.5,
            frequency_penalty=0,
            presence_penalty=0,
        )

        # Get the response text
        result = response["choices"][0]["message"]["content"]
        print("Response from OpenAI:", result)

        # Escape problematic quotes inside the JSON string
        sanitized_result = result.replace("“", '"').replace("”", '"')

        # Handle potential issues with French apostrophes by replacing them correctly
        sanitized_result = (
            sanitized_result.replace("“", '"').replace("”", '"').replace("'", "'")
        )

        sanitized_result = ensure_proper_json_format(sanitized_result)

        print("Sanitized response:", sanitized_result)

        # Attempt to find valid JSON in the response
        result_json_match = re.search(r"\{.*\}", sanitized_result, re.DOTALL)

        if result_json_match:
            result_json = result_json_match.group(0)
            grading_result = json.loads(result_json)
            return grading_result
        else:
            return {"error": "No valid JSON found in the response."}

    except json.JSONDecodeError as e:
        print("Error decoding JSON response:", e)
        return {"error": "Invalid JSON response"}

    except Exception as e:
        print("An error occurred:", e)
        return {"error": str(e)}
