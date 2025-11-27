// src/_test_/Icons.test.jsx
import React from "react";
import { render } from "@testing-library/react";
import { Icon } from "../components/Icons";

describe("Icon component", () => {
  it("renders all icons without crashing", () => {
    // Array of all Icon components to be tested
    const icons = [
      <Icon.Search />,
      <Icon.Heart filled={true} />,
      <Icon.Heart filled={false} />,
      <Icon.Star filled={true} />,
      <Icon.MapPin />,
      <Icon.Clock />,
      <Icon.User />,
      <Icon.Menu />,
      <Icon.X />,
      <Icon.Calendar />,
      <Icon.CheckCircle />,
      <Icon.CreditCard />,
      <Icon.Settings />,
      <Icon.Book />,
      <Icon.History />,
      <Icon.Edit />,
      <Icon.Trash />,
      <Icon.Download />,
      <Icon.Shield />,
      <Icon.Award />,
      <Icon.Globe />,
    ];

    // Render each icon and check if <svg> exists in the DOM
    icons.forEach((icon) => {
      const { container } = render(icon);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
