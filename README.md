# 📦 My Next.js Project

Welcome to **My Next.js Project**! This repository serves as a boilerplate for building scalable and maintainable web applications using Next.js, ShadcnUI, Tailwind CSS, and more. It comes pre-configured with theming support, custom fonts, and enhanced UI components to accelerate your development process.

## 📖 Table of Contents

- [📦 My Next.js Project](#-my-nextjs-project)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Getting Started](#-getting-started)
    - [⚙️ Prerequisites](#️-prerequisites)
    - [📥 Installation](#-installation)
    - [🧑‍💻 Running the Project](#‍-running-the-project)
  - [📂 Project Structure](#-project-structure)
  - [✨ Features](#-features)
  - [🔧 Configuration](#-configuration)
    - [Tailwind CSS](#tailwind-css)
    - [Theming with `next-themes`](#theming-with-next-themes)
  - [🛠️ Available Scripts](#️-available-scripts)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)
  - [📞 Contact](#-contact)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### ⚙️ Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### 📥 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/joeBlockchain/studio-ai
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd your-repo-name
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**

   Nothing yet....


### 🧑‍💻 Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 📂 Project Structure

Here's an overview of the project's directory structure:

```
your-repo-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   └── mode-toggle.tsx
│   │   └── theme-provider.tsx
│   ├── fonts/
│   │   ├── GeistVF.woff
│   │   └── GeistMonoVF.woff
│   └── pages/
│       └── index.tsx
├── public/
│   └── assets/
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## ✨ Features

- **Next.js Framework:** Leveraging the power of server-side rendering and static site generation.
- **ShadcnUI Components:** A collection of reusable and customizable UI components.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Theming with `next-themes`:** Supports light, dark, and system themes with seamless switching.
- **Custom Fonts:** Integrated Geist Sans and Geist Mono fonts for a unique typography.
- **Lucide Icons:** A library of SVG icons to enhance your UI.
- **Tailwind Plugins:**
  - `@tailwindcss/typography` for rich text styling.
  - `tailwindcss-animate` for animation utilities.

## 🔧 Configuration

### Tailwind CSS

Tailwind CSS is configured via the `tailwind.config.ts` file. It includes custom color schemes, border radii, keyframes, and animations tailored to your project's design requirements.

**Key Highlights:**

- **Dark Mode:** Enabled via the `class` strategy.
- **Custom Colors:** Defined using CSS variables for easy theming.
- **Plugins:** Includes `tailwindcss-animate` and `@tailwindcss/typography` for enhanced styling capabilities.

### Theming with `next-themes`

The project uses `next-themes` to manage light and dark themes. The `ThemeProvider` component wraps the application to provide theme context.

**Theme Toggle:**

A `ModeToggle` component is included, allowing users to switch between light, dark, and system themes via a dropdown menu.

## 🛠️ Available Scripts

In the project directory, you can run:

- **Start Development Server**

  ```bash
  npm run dev
  ```

- **Build for Production**

  ```bash
  npm run build
  ```

- **Start Production Server**

  ```bash
  npm start
  ```

- **Lint Codebase**

  ```bash
  npm run lint
  ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

   Provide a clear description of your changes and the motivation behind them.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

If you have any questions or feedback, feel free to reach out:

- **Email:** your.email@example.com
- **GitHub:** [your-username](https://github.com/your-username)

---

## 📚 Additional Information

### 📘 Theme Provider

The `ThemeProvider` is located at `src/components/theme-provider.tsx`. It wraps your application and manages theme states using `next-themes`.

### 🎨 Mode Toggle

The `ModeToggle` component at `src/components/ui/mode-toggle.tsx` provides an interactive UI for users to switch themes. It utilizes `lucide-react` icons for visual indicators and `DropdownMenu` for accessibility.

### 🖋️ Custom Fonts

Custom fonts are integrated using Next.js's `localFont` feature. Ensure your font files are placed in the `src/fonts/` directory and correctly referenced in `layout.tsx`.

### 📐 Tailwind Configuration

The `tailwind.config.ts` file is highly customizable. Feel free to adjust color schemes, extend utility classes, or add new plugins as your project evolves.

---

Happy coding! 🚀