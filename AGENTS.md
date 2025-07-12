# Agent Contribution Guidelines

These rules apply to all contributions by AI agents and human developers to the "Digital Canvas" project.

### **1. Document Your Code**
All new or modified code must be documented at two levels:

*   **High-Level Docs:** If an architectural change is made (like adding a major new file or library), briefly note the *why* in the project's primary `README.md`.
*   **In-Code Docs:** Use JSDoc for all new functions. Each function must have a description, and every parameter (`@param`) and return value (`@returns`) must be documented. Use standard `//` comments to explain complex or non-obvious blocks of code internally.

### **2. Maintain Modularity**
Keep rendering logic, UI setup, and user interaction logic separated into distinct files or modules. Avoid monolithic files; `main.js` should not contain all the code.

### **3. Keep Dependencies Light**
Avoid introducing new libraries unless there is a clear, discussed reason. Every dependency adds complexity and potential for conflicts. We are currently using `three` and `lil-gui`.

### **4. Follow Code Style (Using Prettier)**
This project uses **Prettier** to maintain a consistent code style. Before submitting changes, formatting tools must be run.

*   **Setup (if not already done):**
    ```bash
    # Install Prettier as a development dependency
    npm install --save-dev prettier
    ```
*   **Usage:**
    ```bash
    # Format all relevant files
    npx prettier --write .
    ```

### **5. Testing (Future Requirement)**
Unit testing is not currently implemented for this prototype. However, new features should be written with testability in mind (e.g., pure functions where possible). A testing framework will be added post-MVP.

### **6. Follow the Directory Structure**
As the project grows beyond a single `main.js` file, all new JavaScript code must be placed in an appropriate directory within `src/`.

*   `src/`: The root directory for all application source code.
    *   `core/`: Core Three.js scene setup (renderer, camera, lights, animation loop).
    *   `ui/`: UI-related logic, primarily for setting up and managing the `lil-gui` panel.
    *   `interaction/`: User interaction logic, such as raycasting and event listeners (`pointerdown`).
    *   `utils/`: Reusable helper functions (e.g., math calculations, constants).

### **7. Keep `main.js` Minimal**
The main entry point, `main.js`, should only be responsible for **initializing and connecting** the different modules. For example, it should:
1.  Import and initialize the core scene from `src/core/`.
2.  Import and initialize the UI from `src/ui/`.
3.  Import and initialize the interaction handlers from `src/interaction/`, passing them any necessary shared state (like the `scene` or `camera`).

It should **not** contain the implementation details of these systems, only orchestrate their creation.