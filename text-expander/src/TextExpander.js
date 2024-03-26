import { useState } from "react";

export default function TextExpander({
  children,
  collapsedNumWords = 10,
  expandButtonText = "Show more",
  collapseButtonText = "Show less",
  buttonColor = "blue",
  expanded = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(expanded);
  const childrenArray = children.split(" ");

  const showMoreStyle = {
    color: buttonColor,
    cursor: "pointer",
    fontWeight: "600",
  };

  return (
    <div className={className}>
      <p>
        {isOpen
          ? childrenArray.map((word) => `${word} `)
          : childrenArray.map((word, i) => i < collapsedNumWords && ` ${word}`)}
        {isOpen ? "" : "... "}
        <span style={showMoreStyle} onClick={() => setIsOpen((is) => !is)}>
          {isOpen ? collapseButtonText : `${expandButtonText}`}
        </span>
      </p>
    </div>
  );
}

// setShowAddFriend((show) => !show);
