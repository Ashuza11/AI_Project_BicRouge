from together import Together
from core.config import settings
import logging
import json
import re

client = Together(api_key=settings.together_api_key)


async def get_grading_from_llm(
    role_prompt: str,
    grading_elements: str,
    instruction_prompt: str,
    output_strucutre: str,
):
    try:
        # Send the prompt to the LLM and wait for the response
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-70B-Instruct-Lite",
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": grading_elements},
                {"role": "user", "content": output_strucutre},
                {"role": "user", "content": instruction_prompt},
            ],
        )

        # Parse the response for the grading
        grading = response.choices[0].message.content
        print("Response from Together:", grading)

        # Attempt to find valid JSON in the response
        result_json_match = re.search(r"\{.*\}", grading, re.DOTALL)

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

    except ConnectionError:
        logging.error("Network error occurred. Unable to connect to the API.")
        return "An error occurred: Unable to connect to the server. Please try again later."

    except KeyError as e:
        logging.error(f"KeyError: Missing expected data in response - {e}")
        return "An error occurred: Invalid response from the server."

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return f"An unexpected error occurred: {e}"

    finally:
        # Optional cleanup or logging
        logging.info("Request to LLM completed.")
