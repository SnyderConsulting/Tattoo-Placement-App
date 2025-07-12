# Digital Canvas: A Tattoo Placement Visualizer

**Digital Canvas** is an intuitive, web-based 3D tool designed to revolutionize the way clients and tattoo artists communicate. It empowers users to visually map out their tattoo ideas—specifying size, placement, and rotation—on an interactive 3D model, ensuring their vision is understood from the very first conversation.

[**<< LINK TO YOUR LIVE DEMO >>**]

---

### Table of Contents

1.  [The Vision](#the-vision)
2.  [Core Features](#core-features)
3.  [Technology](#technology)
4.  [Getting Started](#getting-started)
5.  [Future Roadmap](#future-roadmap)

---

## The Vision: Clarity and Confidence in Communication

The journey to a new tattoo should be exciting, but the initial consultation is often a point of friction.

- **For Artists:** The challenge lies in deciphering vague descriptions, leading to endless emails and potential misunderstandings.
- **For Clients:** The difficulty comes from trying to articulate a visual idea with words, creating uncertainty and a fear of not being heard.

**Digital Canvas solves this.** It replaces ambiguity with a clear, shared visual reference. By allowing clients to create a simple mock-up of their idea, it fosters a more professional, efficient, and collaborative dialogue, ensuring both artist and client begin the creative process aligned and with total confidence.

## Core Features

- **Interactive 3D Canvas:** A clean, minimalist 3D model that can be easily rotated, panned, and zoomed to view any part of the body.
- **Two-Column Layout:** The viewport sits beside a persistent control panel for a more professional workflow.
- **Click-to-Place Simplicity:** Just click on the model to place a visual placeholder for your tattoo idea.
- **Real-time Design Controls:** Use a simple and clean UI to instantly adjust the placeholder's:
  - **Width & Height:** To get the scale just right.
  - **Rotation:** To match the flow of the body.
- **Export Your Vision:** With a single click, save the final placement as a high-quality PNG image, perfect for attaching to a booking form or email.

## Technology

This tool is built with modern, lightweight web technologies to ensure it is fast, accessible, and runs smoothly in any modern browser.

- **Core Rendering:** [Three.js](https://threejs.org/)
- **Application Logic:** Vanilla JavaScript (ESM)
- **Build Tooling:** [Vite](https://vitejs.dev/)

## Getting Started

To run this project locally, you will need [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/digital-canvas.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd digital-canvas
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the provided local URL** in your browser.

## Future Roadmap

This prototype is just the beginning. The vision for Digital Canvas extends to a full suite of tools designed to streamline the entire tattoo process. Future enhancements include:

- **Direct Booking Form Integration:** Embed the tool directly into artist websites.
- **Diverse Body Models:** Offer a selection of body types for better personalization.
- **Reference Image Uploads:** Allow users to project their own rough sketches onto the model.
- **Saved Sessions & Shareable Links:** Let users save their work and share a live, interactive 3D link with their artist.
