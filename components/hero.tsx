"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Hero() {
  const downloadZip = async () => {
    const zip = new JSZip();

    const files = [
      { url: "/OEUN NUPHEA.pdf", name: "OEUN NUPHEA.pdf" },
      { url: "/Oeun Nuphea Cover Latter.pdf", name: "Cover Letter.pdf" },
    ];

    // Fetch files and add to zip
    for (const file of files) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    }

    // Generate zip and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "CVs.zip");
  };

  
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-pretty">
          Oeun Nuphea
        </h1>
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 drop-shadow-lg">
          Full Stack
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Passionate IT student crafting innovative digital solutions with modern technologies and clean code
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-muted transition-colors border border-border"
          >
            Get In Touch
          </a>
          <button
            onClick={downloadZip}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Download CVs
          </button>
        </div>
      </div>
    </section>
  );
}
