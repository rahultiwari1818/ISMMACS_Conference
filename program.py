import json
import zipfile
import os
import re

def normalize_name_for_filename(name):
    """
    Normalizes a speaker's name to make it suitable for filename matching.
    - Converts to lowercase.
    - Removes common prefixes (Prof., Dr.).
    - Removes special characters and replaces spaces with underscores.
    - Attempts to handle multiple spaces/underscores.
    """
    normalized = name.lower()
    
    # Remove common prefixes like "prof.", "dr.", "mr.", "ms."
    normalized = re.sub(r'^(prof\.|dr\.|mr\.|ms\.)\s*', '', normalized, flags=re.IGNORECASE)
    
    # Remove common suffixes like ", iit kanpur", ", iisc bangalore" etc.
    # This pattern might need adjustment based on your data's variety
    normalized = re.sub(r',\s*(iit|iisc|nit|bhu|pdeu|iiit|rec|gsv|bits|alliance|cuo|thapar|poornima).*$', '', normalized, flags=re.IGNORECASE)
    
    # Replace non-alphanumeric characters (except underscore) with underscore
    normalized = re.sub(r'[^a-z0-9]+', '_', normalized)
    
    # Remove leading/trailing underscores
    normalized = normalized.strip('_')
    
    # Replace multiple underscores with a single underscore
    normalized = re.sub(r'_+', '_', normalized)
    
    return normalized

def find_image_for_speaker_name(speaker_name, zip_file_contents_map):
    """
    Attempts to find a matching image filename in the ZIP contents map
    based on the speaker's name, trying several variations.
    
    Args:
        speaker_name (str): The full name of the speaker from JSON.
        zip_file_contents_map (dict): Map of base_filename -> full_path_in_zip.

    Returns:
        str or None: The full path of the matched image in the ZIP, or None if not found.
    """
    # Define common image extensions, now including .webp
    COMMON_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

    # 1. Normalize the speaker's name
    normalized_name = normalize_name_for_filename(speaker_name)
    
    # Generate potential filenames based on common patterns
    potential_filenames = []

    # Try exact normalized name match (e.g., "rathish_kumar")
    potential_filenames.append(normalized_name)
    
    # Try with common extensions
    for ext in COMMON_EXTENSIONS:
        potential_filenames.append(normalized_name + ext)
    
    # Try permutations of first/last names if possible
    name_parts = normalized_name.split('_')
    if len(name_parts) >= 2:
        # e.g., "rathish_kumar" -> "kumar_rathish"
        potential_filenames.append(f"{name_parts[-1]}_{'_'.join(name_parts[:-1])}")
        for ext in COMMON_EXTENSIONS:
            potential_filenames.append(f"{name_parts[-1]}_{'_'.join(name_parts[:-1])}" + ext)

        # e.g., just last name (kumar)
        potential_filenames.append(name_parts[-1])
        for ext in COMMON_EXTENSIONS:
            potential_filenames.append(name_parts[-1] + ext)

    # Try stripping middle parts (e.g., b_v_rathish_kumar -> rathish_kumar)
    if len(name_parts) > 2:
        potential_filenames.append(f"{name_parts[-2]}_{name_parts[-1]}") # e.g. rathish_kumar
        for ext in COMMON_EXTENSIONS:
            potential_filenames.append(f"{name_parts[-2]}_{name_parts[-1]}" + ext)
            
    # Try stripping middle parts (e.g., prof_b_v_rathish_kumar -> rathish_kumar)
    if len(name_parts) > 1: # For cases like 'ak_misra' or 'r_p_aggarwal'
        first_char_parts = [p[0] for p in name_parts[:-1] if len(p) > 0]
        if first_char_parts:
            initials_lastname = "_".join(first_char_parts) + "_" + name_parts[-1]
            potential_filenames.append(initials_lastname)
            for ext in COMMON_EXTENSIONS:
                potential_filenames.append(initials_lastname + ext)


    # Search for the potential filenames in the zip_file_contents_map
    for filename_candidate in potential_filenames:
        if filename_candidate in zip_file_contents_map:
            return zip_file_contents_map[filename_candidate]

    return None # No match found


def update_json_image_paths_by_name(json_file_path, zip_file_path, output_json_file_path):
    """
    Updates the 'image' field in a JSON file by trying to match the speaker's 'name'
    to the image filenames found in a ZIP file.

    Args:
        json_file_path (str): Path to your input JSON file.
        zip_file_path (str): Path to your input ZIP file containing images.
        output_json_file_path (str): Path where the updated JSON will be saved.
    """
    try:
        # 1. Read the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 2. Extract image names and their full paths from the ZIP file
        # We'll create a dictionary mapping base filenames (normalized) to their full paths inside the zip
        zip_file_contents_map = {}
        with zipfile.ZipFile(zip_file_path, 'r') as zf:
            for file_info in zf.infolist():
                if not file_info.is_dir():
                    # Normalize the filename from the ZIP for matching
                    base_filename = os.path.basename(file_info.filename)
                    # Remove extension for flexible matching, but keep original for value
                    filename_without_ext = os.path.splitext(base_filename)[0].lower() 
                    
                    # Store both base name and name without extension for more flexible lookup
                    zip_file_contents_map[base_filename.lower()] = file_info.filename # original base name, lowercased
                    zip_file_contents_map[filename_without_ext] = file_info.filename # name without ext, lowercased

        print(f"Normalized image names (keys) from ZIP: {list(zip_file_contents_map.keys())}")
        # print(f"Full paths within ZIP: {zip_file_contents_map}") # Uncomment for debugging

        # 3. Iterate through the JSON data and update image paths
        if "speakers" in data and isinstance(data["speakers"], list):
            for entry in data["speakers"]:
                speaker_name = entry.get("name") # Use .get() for safety
                if speaker_name:
                    original_image_path_in_json = entry.get("image", "N/A") # Get current image path for logging
                    
                    # Attempt to find the best matching image for the speaker's name
                    matched_zip_path = find_image_for_speaker_name(speaker_name, zip_file_contents_map)
                    
                    if matched_zip_path:
                        entry["image"] = matched_zip_path
                        print(f"Matched '{speaker_name}' to '{matched_zip_path}'. Original image was '{original_image_path_in_json}'")
                    else:
                        print(f"Warning: No specific image found in ZIP for speaker '{speaker_name}'. Keeping original path '{original_image_path_in_json}' or 'default.jpg'.")
                        # You might want to explicitly set it to 'default.jpg' here if it's not already
                        # if original_image_path_in_json == "./assets/speakers_images/default.jpg":
                        #     entry["image"] = "./assets/speakers_images/default.jpg" # Reaffirm default
                        # else:
                        #     entry["image"] = "./assets/speakers_images/default.jpg" # Or force default if no match
        else:
            print("Error: JSON data does not contain a 'speakers' list or is not in the expected format.")
            return

        # 4. Write the updated JSON file
        with open(output_json_file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4) # Use indent for pretty printing

        print(f"Successfully updated JSON and saved to: {output_json_file_path}")

    except FileNotFoundError as e:
        print(f"Error: A file was not found. Please check paths. {e}")
    except json.JSONDecodeError as e:
        print(f"Error: Could not decode JSON from {json_file_path}. Is it valid JSON? {e}")
    except zipfile.BadZipFile as e:
        print(f"Error: Could not open ZIP file {zip_file_path}. Is it a valid ZIP file? {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# --- How to use the script ---
if __name__ == "__main__":
    # Define your actual file paths here
    json_input_path = "./data/invited_speaker_data.json" # Your input JSON file path
    zip_input_path = "./Faculty photo.zip"               # Your input ZIP file path
    output_json_path = "updated_speakers_by_name.json"   # Desired name for the output JSON file

    update_json_image_paths_by_name(json_input_path, zip_input_path, output_json_path)

    print("\n--- Script finished ---")
    print(f"Please check the '{output_json_path}' file for the results.")