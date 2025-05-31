import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getJsonTypes(obj: any): string[] {
  const types = new Set<string>();
  function walk(val: any) {
    if (Array.isArray(val)) {
      types.add("array");
      val.forEach(walk);
    } else if (val === null) {
      types.add("null");
    } else if (typeof val === "object") {
      types.add("object");
      Object.values(val).forEach(walk);
    } else {
      types.add(typeof val);
    }
  }
  walk(obj);
  return Array.from(types);
}

export   function jsonToCsv(arr: any[]): string {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    const keys = Object.keys(arr[0]);
    const escape = (v: any) =>
      typeof v === "string" &&
      (v.includes(",") || v.includes('"') || v.includes("\n"))
        ? `"${v.replace(/"/g, '""')}"`
        : v ?? "";
    const rows = [
      keys.join(","),
      ...arr.map((row) => keys.map((k) => escape(row[k])).join(",")),
    ];
    return rows.join("\n");
  }

export function csvToJson(csv: string): any[] {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",");
    return lines.slice(1).map((line) => {
      const values: string[] = [];
      let val = "";
      let inQuotes = false;
      for (let i = 0, c = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(val.replace(/^"|"$/g, "").replace(/""/g, '"'));
          val = "";
          c++;
        } else {
          val += char;
        }
      }
      values.push(val.replace(/^"|"$/g, "").replace(/""/g, '"'));
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => (obj[h] = values[i]));
      return obj;
    });
  }