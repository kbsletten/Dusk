import React from "react";

export function Selectable({
  selected,
  antiselected,
  total,
  onChange,
}: {
  selected: number;
  antiselected?: number;
  total: number;
  onChange: (selected: number, antiselected?: number) => void;
}) {
  const boxes: {
    selected: boolean;
    disputed: boolean;
    antiselected: boolean;
  }[] = [];
  for (let i = 0; i < total; i++) {
    boxes.push({
      selected: selected > i,
      disputed: antiselected !== undefined && i + antiselected === total - 1,
      antiselected: antiselected !== undefined && i + antiselected >= total,
    });
  }
  return (
    <div>
      {boxes.map((box, index) =>
        box.disputed ? (
          <React.Fragment key={index}>
            <input
              type="radio"
              onChange={() => {}}
              onClick={() =>
                box.selected
                  ? onChange(index - 1, antiselected)
                  : onChange(index + 1, antiselected)
              }
              checked={box.selected}
            />
            {"/"}
            <input
              type="radio"
              onChange={() => {}}
              onClick={() => onChange(Math.min(selected, index), total - index)}
            />
          </React.Fragment>
        ) : (
          <input
            key={index}
            type="radio"
            checked={box.selected || box.antiselected}
            onChange={() => {}}
            onClick={() =>
              box.selected
                ? onChange(index, antiselected)
                : box.antiselected
                ? onChange(selected, total - index - 1)
                : onChange(index + 1, antiselected)
            }
          />
        )
      )}
    </div>
  );
}
