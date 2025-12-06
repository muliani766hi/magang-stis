import { Loader } from "@mantine/core";
import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader size="xl" />
    </div>
  );
}
