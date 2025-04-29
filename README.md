Note: I should have to follow this steps to import a project folder to GitHub on Terminal with Git installed:

cd /path/to/your/project  # Go to your project folder
git init                  # Initialize Git in your project (only if not already a git repo)
git remote add origin https://github.com/yourusername/your-repo-name.git  # Link to GitHub
git add .                 # Add ALL files
git commit -m "Initial commit"  # Make the first commit
git branch -M main        # Rename branch to 'main' (modern Git standard)
git push -u origin main   # Push it hard to GitHub

