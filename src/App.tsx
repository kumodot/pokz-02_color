import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

// Function to create the color system with RGB values
function createColorSystem() {
  // RGB definitions for each color
  const colorDefinitions = {
    RD: { name: "Red", rgb: [255, 0, 0] },
    OR: { name: "Orange", rgb: [255, 153, 102] },
    YE: { name: "Yellow", rgb: [249, 231, 96] },
    GR: { name: "Green", rgb: [136, 196, 73] },
    IB: { name: "Ice Blue", rgb: [178, 240, 229] },
    BL: { name: "Blue", rgb: [69, 204, 245] },
    PU: { name: "Purple", rgb: [135, 111, 204] },
    LG: { name: "Light Gray", rgb: [224, 224, 224] },
    DG: { name: "Dark Gray", rgb: [96, 96, 96] },
    WH: { name: "White", rgb: [255, 255, 255] },
    BK: { name: "Black", rgb: [0, 0, 0] },
  };

  // Function to get RGB value from color code
  function getRgbStyle(code) {
    if (colorDefinitions[code]) {
      const [r, g, b] = colorDefinitions[code].rgb;
      return `rgb(${r}, ${g}, ${b})`;
    }
    console.error(`Color with code ${code} not found`);
    return "rgb(128, 128, 128)"; // Default to gray if color not found
  }

  // Function to format code with underscores and slashes
  function formatOrderCode(code: string): string {
    let formattedCode = "";
    for (let i = 0; i < code.length; i += 2) {
      const colorCode = code.substring(i, i + 2);
      formattedCode += colorCode + "_";

      // Add slash after every 4 colors and remove trailing underscore
      if ((i + 2) % 8 === 0 && i + 2 < code.length) {
        formattedCode = formattedCode.slice(0, -1) + "/";
      }
    }

    // Remove trailing underscore if exists
    if (formattedCode.endsWith("_")) {
      formattedCode = formattedCode.slice(0, -1);
    }

    return formattedCode;
  }

  // Function to parse formatted code into array of color codes
  function parseFormattedCode(formattedCode: string) {
    // Remove all underscores and slashes
    const cleanCode = formattedCode.replace(/_/g, "").replace(/\//g, "");

    // Split into 2-character color codes
    const colorCodes: string[] = [];
    for (let i = 0; i < cleanCode.length; i += 2) {
      colorCodes.push(cleanCode.substring(i, i + 2));
    }

    return colorCodes;
  }

  // Function to add a new color to the system
  function addColor(code, name, r, g, b) {
    colorDefinitions[code] = { name, rgb: [r, g, b] };
  }

  return {
    colorDefinitions,
    getRgbStyle,
    formatOrderCode,
    parseFormattedCode,
    addColor,
  };
}

// Initialize color system
const colorSystem = createColorSystem();

// Templates with the new format with underscores and slashes
const colorTemplates = [
  {
    name: "ImPOstor",
    code: "RD_RD_RD_RD/RD_RD_RD_RD/GY_GY_GY_GY/GY_GY_GY_GY",
  },
  {
    name: "Linn LM-1(1980)",
    code: "BK_BK_BK_BK/OR_OR_OR_OR/RD_RD_RD_RD/DG_DG_DG_DG/",
  },
  {
    name: "Akai MPC 60 (1981)",
    code: "LG_LG_LG_LG/DG_DG_DG_DG/BL_BL_BL_BL/RD_RD_RD_RD",
  },
  {
    name: "TR-808 PATTERN (1980)",
    code: "RD_RD_RD_RD/OR_OR_OR_OR/YE_YE_YE_YE/GY_GY_GY_GY",
  },
  {
    name: "TR-909 PATTERN (1983)",
    code: "DG_DG_DG_DG/WH_WH_WH_WH/OR_OR_OR_OR/LG_LG_LG_LG",
  },
  {
    name: "MAESTRO RHYTHM&SOUND (1968) - SOON",
    code: "BK_BK_BK_BK/OR_OR_OR_OR/IB_IB_IB_IB/YE_YE_YE_YE",
  },
  {
    name: "ALL PURPLE",
    code: "PU_PU_PU_PU/PU_PU_PU_PU/PU_PU_PU_PU/PU_PU_PU_PU",
  },
  {
    name: "GameBoy",
    code: "LG_LG_LG_LG/LG_DG_RD_RD/DG_DG_DG_LG/LG_DG_LG_LG",
  },
  {
    name: "FADE",
    code: "BK_DG_LG_WH/BK_DG_LG_WH/BK_DG_LG_WH/BK_DG_LG_WH",
  },
  {
    name: "MERICA",
    code: "BL_BL_WH_WH/BL_BL_RD_RD/WH_WH_WH_WH/RD_RD_RD_RD",
  },
];

// Main component
export default function ColorGridTest() {
  // Initialize all buttons with white color
  const gridRef = useRef<HTMLDivElement>(null);
  const initialColors = Array(16).fill("WH");
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [activeButton, setActiveButton] = useState(null);
  const [formattedOrderCode, setFormattedOrderCode] = useState(
    "WH_WH_WH_WH/WH_WH_WH_WH/WH_WH_WH_WH/WH_WH_WH_WH"
  );
  const [customCode, setCustomCode] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(colorTemplates[0]);

  // Color options using the new system
  const colorOptions = Object.keys(colorSystem.colorDefinitions).map(
    (code) => ({
      name: colorSystem.colorDefinitions[code].name,
      code,
      rgb: colorSystem.colorDefinitions[code].rgb,
    })
  );

  // Apply template to grid
  const applyTemplate = (template) => {
    if (template && template.code) {
      const colorCodes = colorSystem.parseFormattedCode(template.code);

      if (colorCodes.length >= 16) {
        setSelectedColors(colorCodes.slice(0, 16));
        setFormattedOrderCode(template.code);
        setSelectedTemplate(template);
      }
    }
  };

  // Update button color
  const updateColor = (colorCode, index) => {
    const newColors = [...selectedColors];
    newColors[index] = colorCode;
    setSelectedColors(newColors);
    setActiveButton(null);

    // Create formatted code from colors
    const rawCode = newColors.join("");
    const newFormattedCode = colorSystem.formatOrderCode(rawCode);
    setFormattedOrderCode(newFormattedCode);

    // Check if it matches any template
    const matchingTemplate = colorTemplates.find(
      (t) => t.code === newFormattedCode
    );
    if (matchingTemplate) {
      setSelectedTemplate(matchingTemplate);
    } else {
      setSelectedTemplate({ name: "Custom", code: newFormattedCode });
    }
  };

  // Apply custom code from input
  const applyCustomCode = () => {
    if (customCode) {
      const colorCodes = colorSystem.parseFormattedCode(customCode);

      if (colorCodes.length >= 16) {
        setSelectedColors(colorCodes.slice(0, 16));
        setFormattedOrderCode(colorSystem.formatOrderCode(colorCodes.join("")));

        // Check if it matches any template
        const matchingTemplate = colorTemplates.find(
          (t) =>
            colorSystem.parseFormattedCode(t.code).join("") ===
            colorCodes.join("")
        );
        if (matchingTemplate) {
          setSelectedTemplate(matchingTemplate);
        } else {
          setSelectedTemplate({
            name: "Custom",
            code: colorSystem.formatOrderCode(colorCodes.join("")),
          });
        }
      } else {
        alert("Invalid code format. Please provide at least 16 color codes.");
      }
    }
  };

  // Open/close color palette
  const toggleColorPalette = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedOrderCode);
      alert("Código copiado para a área de transferência!");
    } catch (err) {
      console.error("Falha ao copiar:", err);
      alert("Erro ao copiar. Tente novamente.");
    }
  };

  const saveGridAsImage = async () => {
    if (!gridRef.current) return;

    try {
      // 1. Criar um container temporário apenas com o grid e o título
      const container = document.createElement("div");
      container.style.padding = "20px";
      container.style.background = "white";
      container.style.borderRadius = "8px";
      container.style.display = "inline-block";

      // 2. Adicionar o nome do template (opcional)
      const title = document.createElement("h3");
      title.textContent = selectedTemplate?.name || "Custom Grid";
      title.style.marginBottom = "10px";
      title.style.textAlign = "center";
      title.style.fontFamily = "sans-serif";
      container.appendChild(title);

      // 3. Clonar o grid para o container
      const gridClone = gridRef.current.cloneNode(true) as HTMLDivElement;
      container.appendChild(gridClone);

      // 4. Adicionar o container temporário ao body
      document.body.appendChild(container);

      // 5. Capturar apenas o container
      const canvas = await html2canvas(container, {
        backgroundColor: "#FFFFFF", // Fundo branco
        scale: 2,
        logging: false,
      });

      // 6. Gerar e baixar a imagem
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = image;
      link.download = `grid-${selectedTemplate?.name || "custom"}.jpg`;
      link.click();

      // 7. Remover o container temporário
      document.body.removeChild(container);
    } catch (error) {
      console.error("Errror Saving:", error);
      alert("Error generating the image. Check the console.");
    }
  };

  // Apply the default template on load
  useEffect(() => {
    if (colorTemplates.length > 0) {
      applyTemplate(colorTemplates[0]);
    }
  }, []);

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">POKZ ColorGrid Selector</h1>

      {/* Template dropdown */}
      <div className="w-full mb-4">
        <label
          htmlFor="template-selector"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select a template:
        </label>
        <div className="flex items-center gap-2 mb-3">
          <select
            id="template-selector"
            className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
            value={selectedTemplate ? selectedTemplate.name : ""}
            onChange={(e) => {
              const template = colorTemplates.find(
                (t) => t.name === e.target.value
              );
              if (template) {
                applyTemplate(template);
              }
            }}
          >
            {colorTemplates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
            {selectedTemplate &&
              !colorTemplates.find((t) => t.name === selectedTemplate.name) && (
                <option value={selectedTemplate.name}>
                  {selectedTemplate.name}
                </option>
              )}
          </select>
        </div>

        {/* Custom code input */}
        <div className="mb-4">
          <label
            htmlFor="custom-code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Or paste a code:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="custom-code"
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="BK_WH_BK_WH/WH_BK_WH_BK/..."
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              onClick={applyCustomCode}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-4 gap-2 mb-6 w-full max-w-[360px] p-4 bg-gray-100 rounded-lg"
      >
        {selectedColors.map((colorCode, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => toggleColorPalette(index)}
              style={{
                backgroundColor: colorSystem.getRgbStyle(colorCode),
                width: "64px",
                height: "64px",
              }}
              className="rounded-lg shadow-md hover:shadow-lg border border-gray-300"
            />

            {activeButton === index && (
              <div className="absolute mt-2 p-2 bg-white rounded-lg shadow-xl z-50 grid grid-cols-4 gap-1">
                {colorOptions.map((option) => (
                  <button
                    key={option.code}
                    style={{
                      backgroundColor: `rgb(${option.rgb[0]}, ${option.rgb[1]}, ${option.rgb[2]})`,
                      width: "32px",
                      height: "32px",
                    }}
                    className="rounded border border-gray-300 hover:border-blue-500"
                    onClick={() => updateColor(option.code, index)}
                    title={option.name}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Order Code:</h2>
        <div className="flex items-center">
          <span className="font-mono text-lg bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
            {formattedOrderCode}
          </span>
          <button
            className="ml-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={copyToClipboard}
          >
            Copy
          </button>

          <button
            onClick={saveGridAsImage}
            className="ml-2 bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
          >
            Save as IMAGE
          </button>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-semibold">Legend:</p>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {colorOptions.map((option) => (
              <div key={option.name} className="flex items-center">
                <div
                  style={{
                    backgroundColor: `rgb(${option.rgb[0]}, ${option.rgb[1]}, ${option.rgb[2]})`,
                    width: "16px",
                    height: "16px",
                  }}
                  className="rounded-sm border border-gray-300 mr-1"
                ></div>
                <span>
                  {option.name} ({option.code})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
