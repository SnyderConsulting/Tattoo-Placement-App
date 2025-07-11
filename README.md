# Digital Canvas: Tattoo Placement Visualizer

## Table of Contents
1.  [Overview](#overview)
2.  [Live Demo](#live-demo)
3.  [Core Features](#core-features)
4.  [The Problem This Solves](#the-problem-this-solves)
5.  [Technology Stack](#technology-stack)
6.  [Project Structure](#project-structure)
7.  [Getting Started](#getting-started)
8.  [How It Works](#how-it-works)
9.  [Future Enhancements](#future-enhancements)
10. [License](#license)

---

## Overview

**Digital Canvas** is a simple, web-based 3D tool designed to help potential tattoo customers visualize and communicate their tattoo ideas. It provides an intuitive way for a client to specify the desired placement, size, and orientation of a tattoo on a generic human model, which can then be saved as an image and sent to an artist.

The goal of this tool is **not precision, but clear communication**. It aims to bridge the gap between a client's abstract idea and an artist's concrete understanding, professionalizing the initial inquiry process.

## Live Demo

[**<< LINK TO YOUR DEPLOYED PROTOTYPE HERE >>**]

## Core Features

*   **Interactive 3D Model:** A clean, gender-neutral 3D model that can be rotated, panned, and zoomed.
*   **Click-to-Place:** Simply click on any part of the model's body to place a visual placeholder for the tattoo.
*   **Real-time Configuration:** Use an intuitive side panel with sliders to adjust the placeholder's:
    *   Width
    *   Height
    *   Rotation
*   **Shape Selection:** Instantly switch between a rectangular or circular placeholder.
*   **Export to Image:** Save the final placement as a PNG image with a single click, ready to be attached to a booking form or email.

## The Problem This Solves

The initial tattoo consultation process is often fraught with friction. Market analysis shows:
*   **Artists are inundated** with vague inquiries ("I want a tattoo on my arm") that require extensive, time-consuming back-and-forth.
*   **Clients are frustrated** when their poorly communicated ideas are misunderstood or ignored, and they often don't know what information to provide upfront.

This tool solves both problems by empowering the client to create a clear, visual reference that immediately gives the artist the core information they need: **what**, **where**, and **how big**.

## Technology Stack

*   **3D Rendering:** [Three.js](https://threejs.org/) (WebGL Library)
*   **Core Logic:** Vanilla JavaScript (ES6 Modules)
*   **Structure:** HTML5
*   **Styling:** CSS3
*   **3D Model Format:** glTF (`.glb`)

No external frameworks were used for the core application to keep it lightweight and fast.

## Project Structure

```
.
├── assets/
│   └── model.glb         # The 3D human model file
├── index.html            # Main HTML file
├── style.css             # Styles for the UI panel and layout
├── script.js             # Core Three.js and application logic
└── README.md             # You are here
```

## Getting Started

To run this project on your local machine, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/digital-canvas.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd digital-canvas
    ```

3.  **Start a local server.**
    Due to browser security policies (CORS), you cannot load 3D models using the `file://` protocol. You must use a local server. The easiest way is with the VS Code "Live Server" extension or by using Python's built-in server.

    If you have Python 3 installed:
    ```bash
    python -m http.server
    ```

4.  **Open in your browser:**
    Navigate to `http://localhost:8000` (or the address provided by your local server).

## How It Works

The application operates on a few key principles:

1.  **Scene Setup:** A basic Three.js scene is initialized with a camera, lighting, and `OrbitControls` for navigation. The `.glb` 3D model is loaded into the scene.
2.  **Raycasting:** When the user clicks on the canvas, a `Raycaster` projects a ray from the camera into the scene to identify the exact point of intersection on the 3D model's surface.
3.  **Decal Placement:** At the intersection point, a `DecalGeometry` mesh is created. This special geometry from Three.js "wraps" a simple material (the colored placeholder) onto the complex surface of the body model.
4.  **UI-to-3D Linking:** The HTML sliders and inputs have event listeners. When a user changes a value (e.g., the width slider), the corresponding property (e.g., the `scale.x` value) of the decal mesh is updated in the animation loop, providing real-time feedback.
5.  **Image Export:** The "Export" button triggers a function that calls `renderer.domElement.toDataURL()`, converting the current state of the `<canvas>` element into a PNG image that can be downloaded by the user.

## Future Enhancements

This prototype lays the foundation for a more powerful tool. Potential next steps include:

*   **Direct Integration:** Embed the tool within an artist's booking form, automatically uploading the generated image with the client's submission.
*   **Multiple Body Models:** Allow users to select from a few different body types for better representation.
*   **Image Upload for Decals:** Let users upload a simple reference image to be used as the decal texture.
*   **Save & Share via URL:** Generate a unique link that saves the camera and decal configuration, allowing a client to send a live, interactive 3D view to their artist.
*   **Multi-Decal Support:** Allow for the placement of multiple placeholders to plan larger, multi-part projects like sleeves.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.