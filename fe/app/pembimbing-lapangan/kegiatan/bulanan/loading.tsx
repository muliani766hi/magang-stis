"use client";
import { Loader } from "@mantine/core";

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
