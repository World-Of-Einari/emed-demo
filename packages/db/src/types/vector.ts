import { customType } from "drizzle-orm/pg-core";

export const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value) {
    return `[${value.join(",")}]`;
  },
  fromDriver(value) {
    const s = String(value).trim();
    const inner = s.replace(/^\[/, "").replace(/\]$/, "");
    if (!inner) return [];
    return inner.split(",").map((n) => Number(n.trim()));
  },
});
