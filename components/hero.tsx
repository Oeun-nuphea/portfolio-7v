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
    <section className="relative overflow-hidden pt-32 pb-24 px-6 lg:px-8">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-muted/40 to-background" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="text-center lg:text-left">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4">
            Oeun Nuphea
          </h1>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Full Stack
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Passionate IT student crafting innovative digital solutions with modern
            technologies and clean code
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a
              href="#projects"
              className="px-8 py-3 rounded-xl font-semibold bg-foreground text-background hover:opacity-90 transition"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="px-8 py-3 rounded-xl font-semibold border border-border bg-background hover:bg-muted transition"
            >
              Get In Touch
            </a>

            <button
              onClick={downloadZip}
              className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:brightness-110 transition"
            >
              Download CVs
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 blur-2xl opacity-50" />
            <div className="relative p-2 rounded-full bg-background/60 backdrop-blur border border-border shadow-2xl">
              <img
                src="/OUENNUPHEA.jpg"
                alt="Oeun Nuphea"
                className="w-72 h-72 lg:w-120 lg:h-120 rounded-full object-cover object-[50%_20%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
