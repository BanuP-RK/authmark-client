import React from "react";

const SignatureInput = ({ onChange }) => {
  const fonts = [
    { label: "Dancing Script", value: "font-dancing" },
    { label: "Pacifico", value: "font-pacifico" },
    { label: "Great Vibes", value: "font-great" },
  ];

  return (
    <div className="flex flex-col items-start space-y-2">
      <input
        type="text"
        placeholder="Type your name as signature"
        onChange={(e) => onChange((prev) => ({ ...prev, name: e.target.value }))}
        className="border px-3 py-2 rounded w-64"
      />

      <select
        onChange={(e) => onChange((prev) => ({ ...prev, fontClass: e.target.value }))}
        className="border px-2 py-1 rounded"
      >
        <option value="">Choose font</option>
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SignatureInput;
