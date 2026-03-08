"use client";

import Box from "@mui/material/Box";
import { keyframes } from "@mui/system";

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
`;

export function TypingIndicator() {
  return (
    <Box sx={{ display: "flex", gap: "4px", alignItems: "center", height: 20, px: 1 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: "text.disabled",
            animation: `${bounce} 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </Box>
  );
}
