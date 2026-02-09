// Tab Checklist Widget for Übersicht
// Data is stored in a JSON file for persistence

import { css, run } from "uebersicht";

// Open URL using macOS open command
const openUrl = (url) => {
  if (url) {
    run(`open "${url}"`);
  }
};

// Configuration
const DATA_FILE = "~/.tab-checklist-data.json";

// Position on desktop (adjust as needed)
export const className = css`
  position: absolute;
  top: 40px;
  left: 60px;
  right: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  user-select: none;
`;

// Refresh every 2 seconds to pick up file changes
export const refreshFrequency = 2000;

// Read data from file
export const command = `cat ${DATA_FILE} 2>/dev/null || echo '{}'`;

// ============================================================
// CUSTOMIZE YOUR COLUMNS HERE
// Change the 'name' to whatever you want displayed
// Change 'color' to any hex color for the header underline
// Keep 'id' matching what you have in checklist.html
// ============================================================
const COLUMNS = [
  { id: "priority", name: "PRIORITY", color: "#00b894" },
  { id: "work", name: "WORK", color: "#ff6b6b" },
  { id: "personal", name: "PERSONAL", color: "#4ecdc4" },
  { id: "reading", name: "READING", color: "#ffe66d" },
  { id: "other", name: "OTHER", color: "#a29bfe" },
];

// Styles
const containerStyle = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
`;

const columnStyle = css`
  background: rgba(30, 30, 30, 0.46);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const headerStyle = css`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const countStyle = css`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: normal;
`;

const listStyle = css`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const itemStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const checkboxStyle = css`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const checkedStyle = css`
  background: #007aff;
  border-color: #007aff;

  &::after {
    content: "✓";
    color: #fff;
    font-size: 10px;
    font-weight: bold;
  }
`;

const textStyle = css`
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;

  a {
    color: #56a0d3;
    text-decoration: none;
    pointer-events: auto;
    cursor: pointer;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const completedTextStyle = css`
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.4);
`;

const emptyStyle = css`
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
`;

const instructionStyle = css`
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
  margin-top: 12px;
`;

// Parse the data
const parseData = (output) => {
  try {
    return JSON.parse(output);
  } catch (e) {
    return {};
  }
};

// Render a single column
const Column = ({ column, items }) => {
  const activeCount = items.filter((i) => !i.completed).length;
  const totalCount = items.length;

  return (
    <div className={columnStyle}>
      <div className={headerStyle} style={{ borderBottom: `2px solid ${column.color}` }}>
        <span>{column.name}</span>
        <span className={countStyle}>
          {activeCount}/{totalCount}
        </span>
      </div>

      {items.length === 0 ? (
        <div className={emptyStyle}>No items yet</div>
      ) : (
        <ul className={listStyle}>
          {items.map((item, index) => (
            <li key={index} className={itemStyle}>
              <div
                className={`${checkboxStyle} ${item.completed ? checkedStyle : ""}`}
              />
              <span
                className={`${textStyle} ${item.completed ? completedTextStyle : ""}`}
              >
                {item.url ? (
                  <a onClick={() => openUrl(item.url)}>{item.text}</a>
                ) : (
                  item.text
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main render
export const render = ({ output, error }) => {
  if (error) {
    return <div style={{ color: "#ff6b6b" }}>Error: {String(error)}</div>;
  }

  const data = parseData(output);

  return (
    <div>
      <div className={containerStyle}>
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            items={data[column.id] || []}
          />
        ))}
      </div>
      <div className={instructionStyle}>
        Edit via Tab Checklist app or ~/.tab-checklist-data.json
      </div>
    </div>
  );
};
