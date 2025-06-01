"use client";

import {
	FaBold, FaCode, FaHeading, FaItalic, FaLink, FaListOl, FaListUl, FaQuoteRight
} from "react-icons/fa";

export const MarkdownGuide = () => {
  const markdownExamples = [
    {
      name: "Headers",
      example: "# H1\n## H2\n### H3",
      icon: <FaHeading className="text-purple-500" />
    },
    {
      name: "Bold",
      example: "**bold text**",
      icon: <FaBold className="text-purple-500" />
    },
    {
      name: "Italic",
      example: "*italic text*",
      icon: <FaItalic className="text-purple-500" />
    },
    {
      name: "Link",
      example: "[text](https://example.com)",
      icon: <FaLink className="text-purple-500" />
    },
    {
      name: "Unordered List",
      example: "- Item 1\n- Item 2\n- Item 3",
      icon: <FaListUl className="text-purple-500" />
    },
    {
      name: "Ordered List",
      example: "1. Item 1\n2. Item 2\n3. Item 3",
      icon: <FaListOl className="text-purple-500" />
    },
    {
      name: "Blockquote",
      example: "> This is a quote",
      icon: <FaQuoteRight className="text-purple-500" />
    },
    {
      name: "Inline Code",
      example: "`code`",
      icon: <FaCode className="text-purple-500" />
    },
    {
      name: "Code Block",
      example: "```\ncode block\n```",
      icon: <FaCode className="text-purple-500" />
    }
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
        Markdown Cheat Sheet
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {markdownExamples.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-1">{item.icon}</div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.name}</p>
              <p className="text-xs font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">
                {item.example}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};