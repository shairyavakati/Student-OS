import os
import glob

# Search for all python files in the api directory
api_dir = r"c:\Users\Shairya reddy\Downloads\StudentOS mobile app design\apps\api"
for root, _, files in os.walk(api_dir):
    for file in files:
        if file.endswith(".py"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "apps.api." in content:
                new_content = content.replace("apps.api.", "")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
