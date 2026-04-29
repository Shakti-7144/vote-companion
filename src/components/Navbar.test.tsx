import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Navbar } from "./votesmart/Navbar";
import { RegionProvider } from "./votesmart/RegionContext";

describe("Navbar", () => {
  it("renders navbar content", () => {
    render(
      <MemoryRouter>
        <RegionProvider>
          <Navbar />
        </RegionProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/VoteSmart/i)).toBeTruthy();
  });
});
