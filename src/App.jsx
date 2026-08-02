import React, { useState, useEffect, useRef } from 'react';

const ICONS_LIST = [
  "⌂", "⌕", "👤", "⚙", "♡", "♥", "🛒", "✉", "★", "☆", 
  "✦", "✧", "♕", "♛", "⚲", "⊞", "🔔", "📅", "✓", "✕",
  "⚠", "⊕", "⊖", "◂", "▸", "▴", "▾", "⋯", "⋮", "⚡",
  "📝", "📓", "🍽️", "⏱️", "🔲", "📱", "📷", "🧭", "🗺️", "📋", "🔍", "😊", "🔙", "←"
];

// ==========================================
// 1. คลังชิ้นส่วน (Component Registry)
// ==========================================
const ComponentRegistry = {
  Container: ({ props, children }) => (
    <div style={{ flex: 1, width: "100%", minHeight: "50px", boxSizing: "border-box", ...props.style }}>{children}</div>
  ),
  Card: ({ props, children }) => (
    <div style={{ 
      backgroundColor: props.style.backgroundColor || "#ffffff",
      borderRadius: props.style.borderRadius || "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)", display: "flex", 
      flexDirection: props.style.flexDirection || "column",
      justifyContent: props.style.justifyContent || "flex-start",
      alignItems: props.style.alignItems || "center",
      gap: "10px", minHeight: "50px", boxSizing: "border-box", ...props.style 
    }}>{children}</div>
  ),
  Row: ({ props, children }) => (
    <div style={{ 
      display: "flex", flexDirection: "row", 
      justifyContent: props.style.justifyContent || "flex-start",
      alignItems: props.style.alignItems || "center",
      gap: "10px", minHeight: "40px", boxSizing: "border-box", ...props.style 
    }}>{children}</div>
  ),
  Column: ({ props, children }) => (
    <div style={{ 
      display: "flex", flexDirection: "column", 
      justifyContent: props.style.justifyContent || "flex-start",
      alignItems: props.style.alignItems || "flex-start",
      gap: "10px", minHeight: "40px", boxSizing: "border-box", ...props.style 
    }}>{children}</div>
  ),
  Text: ({ props }) => (
    <span style={{ display: "inline-block", ...props.style }}>{props.text}</span>
  ),
  Icon: ({ props }) => (
    <span style={{ ...props.style, display: "inline-block", lineHeight: 1 }}>{props.icon}</span>
  ),
  Button: ({ props, events }) => {
    const isStretch = props.style?.alignSelf === "stretch";
    return (
      <button style={{ ...props.style, width: isStretch ? "100%" : (props.style.width || "auto"), boxSizing: "border-box", cursor: "pointer" }} {...events}>
        {props.text}
      </button>
    );
  },
  TextField: ({ props }) => {
    const isStretch = props.style?.alignSelf === "stretch";
    return (
      <input type="text" placeholder={props.placeholder} style={{ ...props.style, width: isStretch ? "100%" : (props.style.width || "auto"), boxSizing: "border-box", outline: "none" }} readOnly />
    );
  },
  Image: ({ props }) => {
    const isStretch = props.style?.alignSelf === "stretch";
    const w = props.style.width ? props.style.width : "100px";
    const h = props.style.height ? props.style.height : "100px";
    return (
      <img src={props.src} alt="รูปภาพ" style={{ ...props.style, width: isStretch ? "100%" : w, height: isStretch ? "auto" : h, objectFit: "cover", borderRadius: props.style.borderRadius }} />
    );
  },
  Header: ({ props }) => {
    const color = props.style?.color || "#ffffff";
    return (
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: props.style.backgroundColor || "#1f2937", color: color, 
        padding: "15px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "100%", boxSizing: "border-box", ...props.style
      }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", gap: "15px", overflow: "hidden" }}>
          {(props.leftIcons || []).map((item, i) => (
            <span key={`l-${i}`} style={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>{item.icon}</span>
          ))}
        </div>
        <div style={{ flex: 2, textAlign: "center", fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {props.text || "Title"}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "15px", overflow: "hidden" }}>
          {(props.rightIcons || []).map((item, i) => (
            <span key={`r-${i}`} style={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>{item.icon}</span>
          ))}
        </div>
      </div>
    );
  },
  Graph: ({ props }) => {
    const dataStr = props.dataString || "40, 70, 30, 90, 50, 80, 60";
    const data = dataStr.split(",").map(n => parseInt(n.trim()) || 0);
    const max = Math.max(...data, 100);
    const color = props.style?.primaryColor || "#3b82f6";
    const bgColor = props.style?.backgroundColor || "transparent";

    return (
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: props.style.height || "150px", width: "100%", padding: "10px", backgroundColor: bgColor, borderRadius: props.style.borderRadius || "8px", boxSizing: "border-box", ...props.style }}>
        {data.map((val, i) => (
          <div key={i} style={{ width: `${100 / data.length - 2}%`, height: `${(val / max) * 100}%`, backgroundColor: color, borderRadius: "4px 4px 0 0", minWidth: "10px" }}></div>
        ))}
      </div>
    );
  },
  Process: ({ props }) => {
    const val = props.progress || 50;
    const color = props.style?.primaryColor || "#3b82f6";
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px", ...props.style }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: props.style.color || "#6b7280" }}>
          <span>{props.text || "Progress"}</span>
          <span>{val}%</span>
        </div>
        <div style={{ width: "100%", height: props.style.height || "8px", backgroundColor: "#e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ width: `${val}%`, height: "100%", backgroundColor: color, transition: "width 0.3s" }}></div>
        </div>
      </div>
    );
  },
  Cycle: ({ props }) => {
    const val = props.progress || 75;
    const color = props.style?.primaryColor || "#3b82f6";
    const size = props.style?.fontSize ? parseInt(props.style.fontSize) : 80;
    const stroke = 8;
    const innerSize = size - stroke * 2;

    return (
      <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: `conic-gradient(${color} ${val}%, #e5e7eb 0)`, display: "flex", justifyContent: "center", alignItems: "center", ...props.style }}>
        <div style={{ width: `${innerSize}px`, height: `${innerSize}px`, borderRadius: "50%", backgroundColor: props.style.backgroundColor || "#ffffff", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ color: props.style.color || "#111827", fontWeight: "bold", fontSize: `${size / 4}px` }}>{val}%</span>
        </div>
      </div>
    );
  },
  Navbar: ({ props }) => {
    const layout = props.itemLayout || "column";
    const items = props.items || [];
    const fontSize = props.style?.fontSize || "12px";
    const color = props.style?.color || "#ffffff"; 

    return (
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        backgroundColor: props.style.backgroundColor || "#1f2937", color: color, 
        padding: "10px 0", boxShadow: "0 -4px 15px rgba(0,0,0,0.05)", width: "100%", ...props.style
      }}>
        {items.map((item, i) => {
          const icon = typeof item === 'string' ? item.split(' ')[0] : item.icon;
          const label = typeof item === 'string' ? item.replace(icon, '').trim() : item.label;
          return (
            <div key={i} style={{ display: "flex", flexDirection: layout === "column" ? "column" : "row", alignItems: "center", gap: layout === "column" ? "4px" : "8px", cursor: "pointer", fontSize: fontSize }}>
              <span style={{ fontSize: layout === "column" ? `calc(${fontSize} + 8px)` : `calc(${fontSize} + 4px)`, lineHeight: 1, color: color }}>{icon}</span>
              <span style={{ color: color }}>{label}</span>
            </div>
          );
        })}
      </div>
    );
  },
  Tabs: ({ props, children }) => {
    const [active, setActive] = useState(0);
    const tabTitles = props.tabs || ["แท็บ 1", "แท็บ 2"];
    const primaryColor = props.style?.primaryColor || "#d4af37";
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', ...props.style }}>
        <div style={{ display: 'flex', backgroundColor: 'transparent', borderBottom: '1px solid #d1d5db' }}>
          {tabTitles.map((t, i) => (
            <div key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }} style={{ flex: 1, textAlign: 'center', padding: '12px', cursor: 'pointer', borderBottom: active === i ? `3px solid ${primaryColor}` : '3px solid transparent', fontWeight: active === i ? 'bold' : 'normal', color: active === i ? primaryColor : '#9ca3af' }}>
              {t}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, backgroundColor: 'transparent', border: '1px dashed #e5e7eb', marginTop: "10px" }}>
          {children && children[active]}
        </div>
      </div>
    );
  }
};

// ==========================================
// 2. กล่องหุ้มโหมดแก้ไข (Editor Wrapper)
// ==========================================
const EditorWrapper = ({ nodeId, nodeType, isSelected, onSelect, onDropNode, nodeProps, children }) => {
  const handleClick = (e) => { e.stopPropagation(); onSelect(nodeId); };
  const handleDragStart = (e) => { e.stopPropagation(); e.dataTransfer.setData("draggedId", nodeId); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    const draggedId = e.dataTransfer.getData("draggedId");
    if (draggedId && draggedId !== nodeId) onDropNode(draggedId, nodeId);
  };

  const isNavbar = nodeType === "Navbar";
  const isHeader = nodeType === "Header"; 
  const isRoot = nodeId === "root_container";
  const isTop = (isNavbar && nodeProps?.position === "top") || isHeader;
  const isAbsTopRight = nodeProps?.style?.positionType === "absoluteTopRight";
  const topPx = nodeProps?.style?.top ?? 15;
  const rightPx = nodeProps?.style?.right ?? 15;

  return (
    <div 
      draggable={!isRoot && !isNavbar && !isHeader}
      onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}
      style={{
        outline: isSelected ? "2px solid #3b82f6" : "1px dashed transparent", outlineOffset: "-1px",
        cursor: isRoot ? "default" : (isNavbar || isHeader ? "pointer" : "grab"),
        transition: "outline 0.2s", 
        margin: isNavbar || isHeader || isAbsTopRight || isRoot ? "0" : "4px", 
        alignSelf: isNavbar || isHeader ? "stretch" : (nodeProps?.style?.alignSelf || "center"),
        flex: nodeProps?.style?.flex > 0 ? nodeProps.style.flex : "none",
        width: nodeProps?.style?.flex > 0 ? "100%" : undefined,
        position: isNavbar || isHeader ? "sticky" : (isAbsTopRight ? "absolute" : "relative"),
        ...((isNavbar || isHeader) ? { left: 0, right: 0, [isTop ? "top" : "bottom"]: 0, zIndex: 100, marginTop: isTop ? "0px" : "auto", marginBottom: isTop ? "auto" : "0px", width: "100%" } : {}),
        ...(isAbsTopRight ? { top: `${topPx}px`, right: `${rightPx}px`, zIndex: 50 } : {}),
        ...(isRoot ? { flex: 1, display: "flex", flexDirection: "column", width: "100%" } : {})
      }}
    >
      {isSelected && (
        <span style={{ position: "absolute", top: (isNavbar && isTop) || isHeader ? "100%" : -20, left: 0, background: "#3b82f6", color: "white", fontSize: "12px", padding: "2px 6px", zIndex: 110 }}>{nodeId}</span>
      )}
      {children}
    </div>
  );
};

// ==========================================
// 3. เครื่องยนต์วาดหน้าจอ (Render Engine)
// ==========================================
const RenderNode = ({ nodeId, nodes, selectedId, onSelect, onDropNode }) => {
  const node = nodes[nodeId];
  if (!node) return null;
  const Component = ComponentRegistry[node.type];
  if (!Component) return null;

  return (
    <EditorWrapper nodeId={nodeId} nodeType={node.type} isSelected={selectedId === nodeId} onSelect={onSelect} onDropNode={onDropNode} nodeProps={node.props}>
      <Component props={node.props} events={node.events}>
        {node.children && node.children.map(childId => (
          <RenderNode key={childId} nodeId={childId} nodes={nodes} selectedId={selectedId} onSelect={onSelect} onDropNode={onDropNode} />
        ))}
      </Component>
    </EditorWrapper>
  );
};

// ==========================================
// 4. แถบเครื่องมือด้านซ้าย (Sidebar)
// ==========================================
const Sidebar = ({ onAddNode, onExportFlutter, onApplyTheme, screens, activeScreen, setActiveScreen, onAddScreen, onDeleteScreen, onClearProject, onImportJson, onExportJson }) => {
  const btnStyle = { display: "block", width: "100%", padding: "10px", marginBottom: "10px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", textAlign: "left", fontWeight: "bold", color: "#374151" };
  const themeBtnStyle = { ...btnStyle, textAlign: "center", border: "none", color: "white" };
  const fileInputRef = useRef(null);

  return (
    <div style={{ width: "220px", background: "#f9fafb", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        
        <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px", color: "#111827" }}>📱 หน้าจอ (Screens)</h3>
        {Object.entries(screens).map(([sId, s]) => (
          <div 
            key={sId} onClick={() => setActiveScreen(sId)} 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: activeScreen === sId ? "#eff6ff" : "transparent", cursor: "pointer", border: activeScreen === sId ? "1px solid #3b82f6" : "1px solid transparent", borderRadius: "4px", marginBottom: "4px", fontWeight: activeScreen === sId ? "bold" : "normal", color: activeScreen === sId ? "#2563eb" : "#374151" }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
            {Object.keys(screens).length > 1 && (
              <span onClick={(e) => onDeleteScreen(sId, e)} style={{ color: "#ef4444", padding: "0 5px" }} title="ลบหน้านี้">🗑️</span>
            )}
          </div>
        ))}
        <button style={{ ...btnStyle, backgroundColor: "#f3f4f6", color: "#2563eb", border: "1px dashed #3b82f6", marginTop: "10px", textAlign: "center" }} onClick={onAddScreen}>
          + เพิ่มหน้าใหม่
        </button>

        <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

        <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px", color: "#111827" }}>🛠️ เพิ่มชิ้นส่วน</h3>
        <button style={{...btnStyle, backgroundColor: "#f8fafc"}} onClick={() => onAddNode("Header")}>🔝 แถบบน (Header)</button>
        <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
          <button style={{...btnStyle, marginBottom: 0, padding: "10px 5px", textAlign: "center", backgroundColor: "#eff6ff", borderColor: "#60a5fa", color: "#2563eb", flex: 1}} onClick={() => onAddNode("Graph")}>📊 กราฟ</button>
          <button style={{...btnStyle, marginBottom: 0, padding: "10px 5px", textAlign: "center", backgroundColor: "#fffbeb", borderColor: "#fcd34d", color: "#b45309", flex: 1}} onClick={() => onAddNode("Cycle")}>⭕ วงแหวน</button>
        </div>
        <button style={{...btnStyle, borderColor: "#3b82f6", color: "#2563eb"}} onClick={() => onAddNode("Process")}>➖ แถบสถานะ (Process)</button>
        <button style={btnStyle} onClick={() => onAddNode("Container")}>+ จัดกลุ่ม (Container)</button>
        <button style={{...btnStyle, borderColor: "#3b82f6", color: "#2563eb"}} onClick={() => onAddNode("Card")}>+ บล็อกการ์ด (Card)</button>
        <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
          <button style={{...btnStyle, marginBottom: 0, padding: "10px 5px", textAlign: "center", backgroundColor: "#fdf4ff", borderColor: "#c084fc", color: "#7e22ce"}} onClick={() => onAddNode("Row")}>แนวนอน</button>
          <button style={{...btnStyle, marginBottom: 0, padding: "10px 5px", textAlign: "center", backgroundColor: "#f0fdfa", borderColor: "#4ade80", color: "#047857"}} onClick={() => onAddNode("Column")}>แนวตั้ง</button>
        </div>
        <button style={btnStyle} onClick={() => onAddNode("Text")}>+ ข้อความ (Text)</button>
        <button style={btnStyle} onClick={() => onAddNode("TextField")}>+ ช่องกรอก (Input)</button> 
        <button style={btnStyle} onClick={() => onAddNode("Icon")}>+ ไอคอน (Icon)</button>
        <button style={btnStyle} onClick={() => onAddNode("Button")}>+ ปุ่ม (Button)</button>
        <button style={btnStyle} onClick={() => onAddNode("Image")}>+ รูปภาพ (Image)</button>
        <hr style={{ margin: "15px 0", borderColor: "#e5e7eb" }} />
        <button style={btnStyle} onClick={() => onAddNode("Table")}>+ ตาราง (Table)</button>
        <button style={btnStyle} onClick={() => onAddNode("Tabs")}>+ แท็บ (Tabs)</button>
        <button style={btnStyle} onClick={() => onAddNode("Navbar")}>+ แถบเมนู (Navs)</button>

        <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />
        <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px", color: "#111827" }}>💎 ธีมพรีเมียม</h3>
        <button style={{ ...themeBtnStyle, backgroundColor: "#121212", color: "#d4af37", border: "1px solid #d4af37" }} onClick={() => onApplyTheme("midnight_gold")}>✨ มิดไนท์โกลด์</button>
        <button style={{ ...themeBtnStyle, backgroundColor: "#fdfbf7", color: "#b76e79", border: "1px solid #b76e79" }} onClick={() => onApplyTheme("rose_quartz")}>🌸 โรสควอตซ์</button>
        <button style={{ ...themeBtnStyle, backgroundColor: "#18181b", color: "#e5e7eb", border: "1px solid #52525b" }} onClick={() => onApplyTheme("royal_platinum")}>🔘 แพลตตินัม</button>

        <hr style={{ margin: "15px 0", borderColor: "#e5e7eb" }} />
        <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px", color: "#111827" }}>🎨 โทนสีมาตรฐาน</h3>
        <button style={{ ...themeBtnStyle, backgroundColor: "#0f172a" }} onClick={() => onApplyTheme("navy")}>🔵 โทนสีนาวี</button>
        <button style={{ ...themeBtnStyle, backgroundColor: "#3b82f6", color: "#ffffff" }} onClick={() => onApplyTheme("light")}>⚪ โทนสว่าง</button>

        <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />
        <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px", color: "#111827" }}>📂 จัดการโปรเจค</h3>
        <button style={{...btnStyle, textAlign: "center", backgroundColor: "#10b981", color: "white", border: "none"}} onClick={onExportJson}>💾 บันทึกโปรเจค (JSON)</button>
        
        <input type="file" accept=".json" style={{ display: "none" }} ref={fileInputRef} onChange={onImportJson} />
        <button style={{...btnStyle, textAlign: "center", backgroundColor: "#f59e0b", color: "white", border: "none"}} onClick={() => fileInputRef.current.click()}>📂 โหลดโปรเจค</button>
        
        <button style={{...btnStyle, textAlign: "center", backgroundColor: "#ef4444", color: "white", border: "none"}} onClick={onClearProject}>🗑️ ล้างหน้าจอทั้งหมด</button>

      </div>
      
      {/* 🌟 ป้ายเครดิต (Credits Footer) */}
      <div style={{ borderTop: "1px solid #d1d5db", padding: "20px" }}>
        <button style={{...btnStyle, backgroundColor: "#0284c7", color: "white", textAlign: "center", marginBottom: "15px", border: "none"}} onClick={onExportFlutter}>💙 คัดลอกโค้ด Flutter</button>
        
        <div style={{ textAlign: "center", fontSize: "11px", color: "#6b7280", lineHeight: "1.4" }}>
          Built for Education & Community<br/>
          Powered by <b>Gemini AI</b> & Developer<br/>
          <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>Open Source Project</a>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. แผงตั้งค่าด้านขวา (Property Editor)
// ==========================================
const PropertyEditor = ({ selectedNode, onChangeProp, onChangeStyle, onDelete, screens }) => {
  if (!selectedNode || !selectedNode.type) return <div style={{ padding: "20px", color: "#666", width: "300px", borderLeft: "1px solid #ccc", background: "#f9fafb" }}>กรุณาเลือกชิ้นส่วนบนหน้าจอ</div>;

  const { id, props, type } = selectedNode;

  const handleArrayPropChange = (propKey, index, newValue) => {
    const newArray = [...props[propKey]];
    newArray[index] = newValue;
    onChangeProp(propKey, newArray);
  };

  const handleRemoveArrayItem = (propKey, index) => {
    const newArray = [...props[propKey]];
    newArray.splice(index, 1);
    onChangeProp(propKey, newArray);
  };

  const handleAddArrayItem = (propKey, defaultValue) => {
    const newArray = [...(props[propKey] || []), defaultValue];
    onChangeProp(propKey, newArray);
  };

  const handleNavbarItemChange = (index, field, value) => {
    const newArray = [...props.items];
    if (typeof newArray[index] === 'string') {
      const oldStr = newArray[index];
      const oldIcon = oldStr.split(' ')[0] || '';
      const oldLabel = oldStr.replace(oldIcon, '').trim();
      newArray[index] = { icon: oldIcon, label: oldLabel, linkTo: "" };
    }
    newArray[index] = { ...newArray[index], [field]: value };
    onChangeProp("items", newArray);
  };

  const renderHeaderIconEditor = (propKey, labelText, defaultIcon) => {
    const items = props[propKey] || [];
    return (
      <div style={{ padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "6px", marginBottom: "10px", border: "1px solid #e5e7eb" }}>
        <label style={{ fontSize: "12px", fontWeight: "bold", color: "#374151", display: "block", marginBottom: "10px" }}>{labelText}</label>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "8px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "4px", marginBottom: "5px" }}>
            <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
              <input type="text" value={item.icon || ""} placeholder="ไอคอน/ข้อความ" onChange={(e) => {
                const newArr = [...items];
                newArr[i].icon = e.target.value;
                onChangeProp(propKey, newArr);
              }} style={{ width: "85px", padding: "4px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", textAlign: "center", fontSize: "12px" }} />
              
              <select value={item.actionType || "none"} onChange={(e) => {
                const newArr = [...items];
                newArr[i].actionType = e.target.value;
                onChangeProp(propKey, newArr);
              }} style={{ flex: 1, padding: "4px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}>
                <option value="none">ไม่มีแอคชั่น</option>
                <option value="back">ย้อนกลับ (Back)</option>
                <option value="navigate">เปลี่ยนหน้าจอ</option>
                <option value="alert">แจ้งเตือน</option>
              </select>
              
              <button onClick={() => {
                const newArr = [...items];
                newArr.splice(i, 1);
                onChangeProp(propKey, newArr);
              }} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "0 8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>X</button>
            </div>

            {item.actionType === "navigate" && (
               <select value={item.actionValue || ""} onChange={(e) => {
                 const newArr = [...items];
                 newArr[i].actionValue = e.target.value;
                 onChangeProp(propKey, newArr);
               }} style={{ width: "100%", padding: "4px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}>
                <option value="">-- เลือกหน้าจอเป้าหมาย --</option>
                {Object.entries(screens).map(([sId, s]) => <option key={sId} value={sId}>{s.name}</option>)}
              </select>
            )}
            {item.actionType === "alert" && (
              <input type="text" placeholder="พิมพ์ข้อความแจ้งเตือน..." value={item.actionValue || ""} onChange={(e) => {
                 const newArr = [...items];
                 newArr[i].actionValue = e.target.value;
                 onChangeProp(propKey, newArr);
               }} style={{ width: "100%", padding: "4px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }} />
            )}
          </div>
        ))}
        <button onClick={() => {
          const newArr = [...items, { icon: defaultIcon, actionType: "none", actionValue: "" }];
          onChangeProp(propKey, newArr);
        }} style={{ width: "100%", padding: "6px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", marginTop: "5px" }}>+ เพิ่มปุ่ม</button>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", borderLeft: "1px solid #ccc", width: "300px", background: "#f9fafb", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>ตั้งค่า: {type}</h3>

        {(type === "Button") && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: "6px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold", color: "#0369a1" }}>เมื่อถูกคลิก (Action)</label>
            <select value={props.actionType || "none"} onChange={(e) => onChangeProp("actionType", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}>
              <option value="none">ไม่มี (None)</option>
              <option value="alert">แสดงแจ้งเตือน (Show Alert)</option>
              <option value="url">เปิดเว็บไซต์ (Open URL)</option>
              <option value="navigate">เปลี่ยนหน้าจอ (Navigate)</option>
            </select>

            {props.actionType === "alert" && (
              <input type="text" placeholder="พิมพ์ข้อความแจ้งเตือน..." value={props.actionValue || ""} onChange={(e) => onChangeProp("actionValue", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
            )}
            {props.actionType === "url" && (
              <input type="text" placeholder="https://..." value={props.actionValue || ""} onChange={(e) => onChangeProp("actionValue", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
            )}
            {props.actionType === "navigate" && (
              <select value={props.actionValue || ""} onChange={(e) => onChangeProp("actionValue", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }}>
                <option value="">-- เลือกหน้าจอเป้าหมาย --</option>
                {Object.entries(screens).map(([sId, s]) => (
                  <option key={sId} value={sId}>{s.name}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {(type === "Header") && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>ข้อความหัวเรื่อง (Title)</label>
            <input type="text" value={props.text || ""} onChange={(e) => onChangeProp("text", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc" }} />
            
            {renderHeaderIconEditor("leftIcons", "ฝั่งซ้าย (Left)", "🔙")}
            {renderHeaderIconEditor("rightIcons", "ฝั่งขวา (Right)", "⚙")}
          </div>
        )}

        {(type !== "Navbar" && type !== "Header" && type !== "Table" && id !== "root_container") && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#e5e7eb", borderRadius: "6px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>รูปแบบการวาง (Position)</label>
            <select value={props.style?.positionType || "relative"} onChange={(e) => onChangeStyle("positionType", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}>
              <option value="relative">เรียงตามปกติ (Relative)</option>
              <option value="absoluteTopRight">ลอยอิสระมุมขวา (Absolute)</option>
            </select>

            {props.style?.positionType === "absoluteTopRight" && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>บน (Top) px</label>
                  <input type="number" value={props.style?.top ?? 15} onChange={(e) => onChangeStyle("top", parseInt(e.target.value) || 0)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>ขวา (Right) px</label>
                  <input type="number" value={props.style?.right ?? 15} onChange={(e) => onChangeStyle("right", parseInt(e.target.value) || 0)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
              </div>
            )}

            {props.style?.positionType !== "absoluteTopRight" && (
              <>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>สัดส่วนพื้นที่ (Flex / Expanded)</label>
                <select value={props.style?.flex || 0} onChange={(e) => onChangeStyle("flex", parseInt(e.target.value))} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}>
                  <option value={0}>พอดีเนื้อหา (Auto)</option>
                  <option value={1}>ขยายเต็มพื้นที่ (Expanded)</option>
                </select>

                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>การจัดตำแหน่ง (Align Self)</label>
                <select value={props.style?.alignSelf || "center"} onChange={(e) => onChangeStyle("alignSelf", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }}>
                  <option value="flex-start">ชิดซ้าย (Left)</option>
                  <option value="center">กึ่งกลาง (Center)</option>
                  <option value="flex-end">ชิดขวา (Right)</option>
                  <option value="stretch">เต็มความกว้าง (Full Width)</option>
                </select>
              </>
            )}
          </div>
        )}

        {(type === "Graph") && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>ข้อมูลกราฟ (คั่นด้วยลูกน้ำ)</label>
            <input type="text" value={props.dataString || ""} onChange={(e) => onChangeProp("dataString", e.target.value)} placeholder="เช่น 20, 50, 80, 40" style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
            <label style={{ display: "block", marginTop: "10px", marginBottom: "5px", fontSize: "12px" }}>ความสูงกราฟ (px)</label>
            <input type="number" value={parseInt(props.style?.height) || 150} onChange={(e) => onChangeStyle("height", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box" }} />
          </div>
        )}

        {(type === "Process" || type === "Cycle") && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold", color: "#166534" }}>ความคืบหน้า (Progress: 0-100%)</label>
            <input type="range" min="0" max="100" value={props.progress || 50} onChange={(e) => onChangeProp("progress", parseInt(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
            <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "5px" }}>{props.progress || 50}%</div>
            {type === "Process" && (
              <>
                <label style={{ display: "block", marginTop: "10px", marginBottom: "5px", fontSize: "12px" }}>ข้อความระบุสถานะ</label>
                <input type="text" value={props.text || ""} onChange={(e) => onChangeProp("text", e.target.value)} style={{ width: "100%", padding: "5px", boxSizing: "border-box" }} />
              </>
            )}
            {type === "Cycle" && (
              <>
                <label style={{ display: "block", marginTop: "10px", marginBottom: "5px", fontSize: "12px" }}>ขนาดวงแหวน (px)</label>
                <input type="number" value={parseInt(props.style?.fontSize) || 80} onChange={(e) => onChangeStyle("fontSize", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box" }} />
              </>
            )}
          </div>
        )}

        {(type === "Container" || type === "Card" || type === "Row" || type === "Column") && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "6px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", fontWeight: "bold", color: "#92400e" }}>การจัดวางเนื้อหาภายใน</label>
            {(type !== "Row" && type !== "Column") && (
              <>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>ทิศทางการเรียง</label>
                <select value={props.style?.flexDirection || "column"} onChange={(e) => onChangeStyle("flexDirection", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}>
                  <option value="column">บนลงล่าง (Vertical)</option>
                  <option value="row">ซ้ายไปขวา (Horizontal)</option>
                </select>
              </>
            )}
            <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>แกนหลัก (Main Axis)</label>
            <select value={props.style?.justifyContent || "flex-start"} onChange={(e) => onChangeStyle("justifyContent", e.target.value)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}>
              <option value="flex-start">เริ่มต้น (Start)</option>
              <option value="center">กึ่งกลาง (Center)</option>
              <option value="flex-end">สิ้นสุด (End)</option>
              <option value="space-between">กระจายห่างสุด (Space Between)</option>
              <option value="space-around">กระจายรอบๆ (Space Around)</option>
            </select>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>แกนรอง (Cross Axis)</label>
            <select value={props.style?.alignItems || "center"} onChange={(e) => onChangeStyle("alignItems", e.target.value)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="flex-start">เริ่มต้น (Start)</option>
              <option value="center">กึ่งกลาง (Center)</option>
              <option value="flex-end">สิ้นสุด (End)</option>
              <option value="stretch">ยืดเต็ม (Stretch)</option>
            </select>
          </div>
        )}
        
        {(type === "Container" || type === "Card" || type === "Row" || type === "Column" || type === "Button" || type === "TextField" || type === "Image" || type === "Graph" || type === "Process" || type === "Cycle") && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", fontWeight: "bold", color: "#374151" }}>ระยะห่าง & ขอบมน</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>Padding (ใน)</label>
                <input type="number" value={parseInt(props.style?.padding) || 0} onChange={(e) => onChangeStyle("padding", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>Margin (นอก)</label>
                <input type="number" value={parseInt(props.style?.margin) || 0} onChange={(e) => onChangeStyle("margin", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
              </div>
            </div>
            {(type !== "Process" && type !== "Cycle") && (
              <>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>ความโค้งมน (Border Radius)</label>
                <input type="number" value={parseInt(props.style?.borderRadius) || 0} onChange={(e) => onChangeStyle("borderRadius", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
              </>
            )}
          </div>
        )}

        {(type === "Text" || type === "Button" || type === "TextField") && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#fcf8ff", border: "1px solid #e0e7ff", borderRadius: "6px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", fontWeight: "bold", color: "#312e81" }}>รูปแบบอักษร (Typography)</label>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>ขนาดข้อความ (px)</label>
            <input type="number" value={parseInt(props.style?.fontSize) || 16} onChange={(e) => onChangeStyle("fontSize", `${e.target.value}px`)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "10px" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>ความหนา</label>
                <select value={props.style?.fontWeight || "normal"} onChange={(e) => onChangeStyle("fontWeight", e.target.value)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px" }}>
                  <option value="normal">ปกติ</option>
                  <option value="bold">หนา (Bold)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>จัดบรรทัด</label>
                <select value={props.style?.textAlign || "left"} onChange={(e) => onChangeStyle("textAlign", e.target.value)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px" }}>
                  <option value="left">ซ้าย</option>
                  <option value="center">กลาง</option>
                  <option value="right">ขวา</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {(type === "Text" || type === "Button") && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>ข้อความ (Text)</label>
            <input type="text" value={props.text || ""} onChange={(e) => onChangeProp("text", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
          </div>
        )}

        {type === "TextField" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>ข้อความตัวอย่าง (Placeholder)</label>
            <input type="text" value={props.placeholder || ""} onChange={(e) => onChangeProp("placeholder", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
          </div>
        )}

        {type === "Tabs" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>แก้ไขชื่อแท็บ</label>
            {props.tabs?.map((t, i) => (
              <input key={i} type="text" value={t} onChange={(e) => handleArrayPropChange("tabs", i, e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "5px" }} />
            ))}
          </div>
        )}

        {type === "Navbar" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>แก้ไขเมนูนำทาง</label>
            {props.items?.map((item, i) => {
              const icon = typeof item === 'string' ? item.split(' ')[0] : item.icon;
              const label = typeof item === 'string' ? item.replace(icon, '').trim() : item.label;
              const linkTo = typeof item === 'string' ? "" : (item.linkTo || "");

              return (
                <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "5px", flexDirection: "column", padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <select value={ICONS_LIST.includes(icon) ? icon : "⌂"} onChange={(e) => handleNavbarItemChange(i, "icon", e.target.value)} style={{ width: "55px", padding: "8px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", textAlign: "center", cursor: "pointer", fontSize: "16px" }}>
                      {ICONS_LIST.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                    <input type="text" value={label || ""} placeholder="ข้อความ" onChange={(e) => handleNavbarItemChange(i, "label", e.target.value)} style={{ flex: 1, padding: "8px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px" }} />
                    <button onClick={() => handleRemoveArrayItem("items", i)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "0 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>X</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "12px", color: "#666" }}>ลิงก์ไปหน้า:</span>
                    <select value={linkTo} onChange={(e) => handleNavbarItemChange(i, "linkTo", e.target.value)} style={{ flex: 1, padding: "4px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", fontSize: "12px" }}>
                      <option value="">- ไม่ลิงก์ -</option>
                      {Object.entries(screens).map(([sId, s]) => (
                        <option key={sId} value={sId}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
            <button onClick={() => handleAddArrayItem("items", { icon: "✨", label: "เมนูใหม่" })} style={{ width: "100%", padding: "8px", marginTop: "5px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ เพิ่มเมนู</button>

            <label style={{ display: "block", marginTop: "15px", marginBottom: "5px", fontSize: "14px" }}>การจัดเรียงไอคอน</label>
            <select value={props.itemLayout || "column"} onChange={(e) => onChangeProp("itemLayout", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "10px" }}>
              <option value="column">ไอคอนอยู่บน (Vertical)</option>
              <option value="row">ไอคอนอยู่ซ้าย (Horizontal)</option>
            </select>
          </div>
        )}

        {type === "Icon" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>เลือกไอคอน (Icon)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
               {ICONS_LIST.map(ic => (
                 <button 
                   key={ic} onClick={() => onChangeProp("icon", ic)}
                   style={{ padding: "6px", fontSize: "20px", cursor: "pointer", width: "40px", height: "40px", border: props.icon === ic ? "2px solid #3b82f6" : "1px solid transparent", backgroundColor: props.icon === ic ? "#eff6ff" : "transparent", borderRadius: "6px", color: "#111827" }}
                 >
                   {ic}
                 </button>
               ))}
            </div>
            <label style={{ display: "block", marginTop: "15px", marginBottom: "5px", fontSize: "14px" }}>ขนาดไอคอน (px)</label>
            <input type="number" value={parseInt(props.style?.fontSize) || 24} onChange={(e) => onChangeStyle("fontSize", `${e.target.value}px`)} style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
          </div>
        )}

        {type === "Image" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>ลิงก์รูปภาพ (URL)</label>
            <input type="text" value={props.src || ""} onChange={(e) => onChangeProp("src", e.target.value)} style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "10px" }} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>กว้าง (Width)</label>
                <input type="number" value={parseInt(props.style?.width) || 100} onChange={(e) => onChangeStyle("width", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>สูง (Height)</label>
                <input type="number" value={parseInt(props.style?.height) || 100} onChange={(e) => onChangeStyle("height", `${e.target.value}px`)} style={{ width: "100%", padding: "5px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }} />
              </div>
            </div>
          </div>
        )}

        {(type !== "Table" && type !== "Header") && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>สีตัวอักษร / สีไอคอน</label>
            <input type="color" value={props.style?.color || "#000000"} onChange={(e) => onChangeStyle("color", e.target.value)} style={{ width: "100%", height: "40px", cursor: "pointer", border: "none", padding: 0 }} />
          </div>
        )}

        {(type !== "Image" && type !== "Icon") && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>สีพื้นหลัง</label>
            <input type="color" value={props.style?.backgroundColor || "#transparent"} onChange={(e) => onChangeStyle("backgroundColor", e.target.value)} style={{ width: "100%", height: "40px", cursor: "pointer", border: "none", padding: 0 }} />
          </div>
        )}
      </div>

      {id !== "root_container" && (
        <button onClick={onDelete} style={{ padding: "10px", marginTop: "20px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
          🗑️ ลบชิ้นส่วนนี้
        </button>
      )}
    </div>
  );
};

// ==========================================
// 6. ตัวจัดการหลัก (Main App Builder)
// ==========================================
export default function AppBuilder() {
  const getDefaultScreens = () => ({
    "screen_home": {
      name: "หน้าแรก (Home)",
      nodes: {
        "root_container": { type: "Container", props: { style: { padding: "0px", backgroundColor: "#121212", display: "flex", flexDirection: "column", gap: "0px", minHeight: "100%", position: "relative", primaryColor: "#d4af37", justifyContent: "flex-start", alignItems: "center" } }, children: ["header_1", "body_container", "navbar_1"] },
        "header_1": { type: "Header", props: { text: "Food Diary", leftIcons: [{ icon: "⌂", actionType: "none", actionValue: "" }], rightIcons: [{ icon: "🔍", actionType: "none", actionValue: "" }, { icon: "⚙", actionType: "none", actionValue: "" }], style: { backgroundColor: "#1e1e1e", color: "#ffffff" } }, children: [] },
        "body_container": { type: "Container", props: { style: { flex: 1, display: "flex", flexDirection: "column", padding: "15px", gap: "15px", width: "100%", boxSizing: "border-box", overflowY: "auto" } }, children: ["card_graph", "card_stats"] },
        "card_graph": { type: "Card", props: { style: { padding: "15px", backgroundColor: "#1e1e1e", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "10px", alignSelf: "stretch" } }, children: ["text_g", "graph_1"] },
        "text_g": { type: "Text", props: { text: "แคลอรี่สัปดาห์นี้", style: { fontSize: "16px", color: "#ffffff", fontWeight: "bold" } }, children: [] },
        "graph_1": { type: "Graph", props: { dataString: "40, 70, 30, 90, 50, 80, 60", style: { height: "120px", primaryColor: "#d4af37" } }, children: [] },
        "card_stats": { type: "Card", props: { style: { padding: "15px", backgroundColor: "#1e1e1e", borderRadius: "12px", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignSelf: "stretch" } }, children: ["process_1", "cycle_1"] },
        "process_1": { type: "Process", props: { progress: 65, text: "เป้าหมายน้ำดื่ม", style: { flex: 1, primaryColor: "#3b82f6", color: "#9ca3af" } }, children: [] },
        "cycle_1": { type: "Cycle", props: { progress: 80, style: { fontSize: "60px", primaryColor: "#10b981", backgroundColor: "#1e1e1e", color: "#ffffff" } }, children: [] },
        "navbar_1": { type: "Navbar", props: { position: "bottom", itemLayout: "column", items: [{ icon: "📝", label: "Daily", linkTo: "" }, { icon: "⏱️", label: "Fasting", linkTo: "" }, { icon: "🔲", label: "Scanner", linkTo: "" }, { icon: "🧭", label: "Explore", linkTo: "" }, { icon: "👤", label: "Me", linkTo: "" }], style: { fontSize: "12px", backgroundColor: "#18181b", color: "#ffffff" } }, children: [] }
      }
    }
  });

  const [screens, setScreens] = useState(getDefaultScreens());
  const [activeScreen, setActiveScreen] = useState("screen_home");
  const [selectedId, setSelectedId] = useState(null);
  
  const nodes = screens[activeScreen]?.nodes || {};
  const selectedNode = selectedId ? { id: selectedId, ...nodes[selectedId] } : null;

  const handleSwitchScreen = (sId) => {
    setActiveScreen(sId);
    setSelectedId(null);
  };

  const setNodes = (updater) => {
    setScreens(prev => {
      const currentNodes = prev[activeScreen].nodes;
      const newNodes = typeof updater === 'function' ? updater(currentNodes) : updater;
      return { ...prev, [activeScreen]: { ...prev[activeScreen], nodes: newNodes } };
    });
  };

  useEffect(() => {
    const savedData = localStorage.getItem("my_app_builder_vfinal_data");
    if (savedData) {
      try { 
        const parsed = JSON.parse(savedData);
        if (parsed.screen_home) setScreens(parsed); 
      } catch (e) { console.error("Failed to parse", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("my_app_builder_vfinal_data", JSON.stringify(screens));
  }, [screens]);

  // 🌟 ฟังก์ชันจัดการโปรเจค (Save, Load, Clear)
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(screens));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "my_app_design.json");
    dlAnchorElem.click();
  };

  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && Object.keys(parsed).length > 0) {
          setScreens(parsed);
          const firstScreenId = Object.keys(parsed)[0];
          handleSwitchScreen(firstScreenId);
          alert("โหลดโปรเจคสำเร็จ! 🎉");
        } else {
          alert("รูปแบบไฟล์ไม่ถูกต้อง");
        }
      } catch (err) {
        alert("ไฟล์ไม่ถูกต้อง หรือเกิดข้อผิดพลาดในการโหลด");
      }
    };
    reader.readAsText(file);
    event.target.value = null; // รีเซ็ต input
  };

  const handleClearProject = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบทุกอย่างแล้วเริ่มใหม่ทั้งหมด? (การกระทำนี้ย้อนกลับไม่ได้)")) {
      const freshScreens = getDefaultScreens();
      setScreens(freshScreens);
      handleSwitchScreen("screen_home");
    }
  };

  const handleAddScreen = () => {
    const newScreenId = `screen_${Date.now()}`;
    const screenCount = Object.keys(screens).length + 1;
    const defaultPrimary = screens[activeScreen].nodes["root_container"]?.props?.style?.primaryColor || "#3b82f6";
    const defaultBg = screens[activeScreen].nodes["root_container"]?.props?.style?.backgroundColor || "#121212";
    const defaultText = defaultBg === "#121212" || defaultBg === "#0f172a" || defaultBg === "#09090b" ? "#ffffff" : "#111827";

    setScreens(prev => ({
      ...prev,
      [newScreenId]: {
        name: `หน้าจอ ${screenCount}`,
        nodes: {
          "root_container": {
            type: "Container",
            props: { style: { padding: "0px", backgroundColor: defaultBg, display: "flex", flexDirection: "column", gap: "0px", minHeight: "100%", position: "relative", primaryColor: defaultPrimary, justifyContent: "flex-start", alignItems: "center" } },
            children: ["header_new", "body_new", "navbar_new"]
          },
          "header_new": {
            type: "Header",
            props: { text: `หน้าจอที่ ${screenCount}`, leftIcons: [{ icon: "🔙", actionType: "back", actionValue: "" }], rightIcons: [{ icon: "⚙", actionType: "none", actionValue: "" }], style: { backgroundColor: defaultBg === "#121212" ? "#1e1e1e" : "#ffffff", color: defaultText } },
            children: []
          },
          "body_new": {
            type: "Container",
            props: { style: { flex: 1, display: "flex", flexDirection: "column", padding: "15px", gap: "15px", width: "100%", boxSizing: "border-box" } },
            children: ["text_new"]
          },
          "text_new": {
            type: "Text",
            props: { text: `เนื้อหาของหน้าจอ ${screenCount}`, style: { fontSize: "20px", color: defaultText, alignSelf: "center", margin: "20px" } },
            children: []
          },
          "navbar_new": {
            type: "Navbar",
            props: { position: "bottom", itemLayout: "column", items: [{ icon: "📝", label: "Daily", linkTo: "" }, { icon: "⏱️", label: "Fasting", linkTo: "" }, { icon: "🔲", label: "Scanner", linkTo: "" }, { icon: "🧭", label: "Explore", linkTo: "" }, { icon: "👤", label: "Me", linkTo: "" }], style: { fontSize: "12px", backgroundColor: "#18181b", color: "#ffffff" } },
            children: []
          }
        }
      }
    }));
    handleSwitchScreen(newScreenId);
  };

  const handleDeleteScreen = (screenId, e) => {
    e.stopPropagation(); 
    const screenKeys = Object.keys(screens);
    if (screenKeys.length <= 1) {
      alert("ต้องมีอย่างน้อย 1 หน้าจอเสมอครับ ไม่สามารถลบได้");
      return;
    }
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${screens[screenId].name}" ?`)) {
      setScreens(prev => {
        const newScreens = { ...prev };
        delete newScreens[screenId];
        return newScreens;
      });
      if (activeScreen === screenId) {
        const remainingIds = screenKeys.filter(id => id !== screenId);
        handleSwitchScreen(remainingIds[0]);
      }
    }
  };

  const handleAddNode = (type) => {
    const newNodeId = `${type.toLowerCase()}_${Date.now()}`;
    let newNode = { type, props: { style: {} }, children: [] };
    let extraNodes = {}; 
    const defaultPrimary = nodes["root_container"]?.props?.style?.primaryColor || "#3b82f6";
    const defaultBg = nodes["root_container"]?.props?.style?.backgroundColor || "#ffffff";
    const defaultText = defaultBg === "#121212" || defaultBg === "#0f172a" || defaultBg === "#09090b" ? "#ffffff" : "#111827";
    const defaultCard = defaultBg === "#121212" || defaultBg === "#09090b" ? "#1e1e1e" : (defaultBg === "#0f172a" ? "#1e293b" : "#ffffff");
    
    if (type === "Text") {
      newNode.props = { text: "ข้อความใหม่", style: { fontSize: "16px", color: defaultText, alignSelf: "center", fontWeight: "normal", textAlign: "left" } };
    } else if (type === "TextField") {
      newNode.props = { placeholder: "กรอกข้อมูล...", style: { padding: "12px", backgroundColor: defaultCard, color: defaultText, borderRadius: "8px", border: "1px solid #ccc", alignSelf: "stretch", fontSize: "14px" } };
    } else if (type === "Icon") {
      newNode.props = { icon: "⚙", style: { fontSize: "24px", color: defaultText, positionType: "relative" } };
    } else if (type === "Button") {
      newNode.props = { text: "ปุ่มใหม่", actionType: "none", actionValue: "", style: { padding: "12px 24px", backgroundColor: defaultPrimary, color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", alignSelf: "center", fontWeight: "bold" } };
    } else if (type === "Container") {
      newNode.props = { style: { padding: "20px", backgroundColor: "transparent", border: "1px dashed #9ca3af", display: "flex", flexDirection: "column", gap: "10px", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center" } };
    } else if (type === "Row") {
      newNode.props = { style: { padding: "10px", backgroundColor: "transparent", border: "1px dashed #9ca3af", display: "flex", flexDirection: "row", gap: "10px", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center" } };
    } else if (type === "Column") {
      newNode.props = { style: { padding: "10px", backgroundColor: "transparent", border: "1px dashed #9ca3af", display: "flex", flexDirection: "column", gap: "10px", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "flex-start" } };
    } else if (type === "Card") {
      newNode.props = { style: { padding: "20px", backgroundColor: defaultCard, borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "flex-start" } };
    } else if (type === "Image") {
      newNode.props = { src: "https://via.placeholder.com/150", style: { width: "100px", height: "100px", borderRadius: "12px", alignSelf: "center" } };
    } else if (type === "Header") {
      newNode.props = { text: "หัวเรื่อง", leftIcons: [{ icon: "🔙", actionType: "back", actionValue: "" }], rightIcons: [{ icon: "⚙", actionType: "none", actionValue: "" }], style: { backgroundColor: defaultCard, color: defaultText } };
    } else if (type === "Graph") {
      newNode.props = { dataString: "30, 80, 50, 90", style: { height: "150px", primaryColor: defaultPrimary } };
    } else if (type === "Process") {
      newNode.props = { progress: 50, text: "กำลังโหลด...", style: { primaryColor: defaultPrimary, color: defaultText, alignSelf: "stretch" } };
    } else if (type === "Cycle") {
      newNode.props = { progress: 75, style: { fontSize: "80px", primaryColor: defaultPrimary, backgroundColor: defaultCard, color: defaultText, alignSelf: "center" } };
    } else if (type === "Table") {
      newNode.props = { rows: 2, cols: 2, style: { backgroundColor: defaultCard, alignSelf: "stretch" } };
    } else if (type === "Navbar") {
      newNode.props = { position: "bottom", itemLayout: "column", items: [{ icon: "📝", label: "Daily", linkTo: "" }, { icon: "⏱️", label: "Fasting", linkTo: "" }, { icon: "🔲", label: "Scanner", linkTo: "" }, { icon: "🧭", label: "Explore", linkTo: "" }, { icon: "👤", label: "Me", linkTo: "" }], style: { fontSize: "12px", backgroundColor: "#18181b", color: "#ffffff" } };
    } else if (type === "Tabs") {
      newNode.props = { tabs: ["แท็บ 1", "แท็บ 2"], style: { alignSelf: "stretch", primaryColor: defaultPrimary } };
      const tab1Id = `container_${Date.now()}_1`;
      const tab2Id = `container_${Date.now()}_2`;
      newNode.children = [tab1Id, tab2Id];
      extraNodes[tab1Id] = { type: "Container", props: { style: { padding: "10px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "150px", justifyContent: "flex-start", alignItems: "center" } }, children: [] };
      extraNodes[tab2Id] = { type: "Container", props: { style: { padding: "10px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "150px", justifyContent: "flex-start", alignItems: "center" } }, children: [] };
    }

    let targetParentId = "root_container";
    if (selectedId && (nodes[selectedId].type === "Container" || nodes[selectedId].type === "Card" || nodes[selectedId].type === "Row" || nodes[selectedId].type === "Column")) {
      targetParentId = selectedId;
    }

    setNodes(prev => ({
      ...prev,
      ...extraNodes,
      [newNodeId]: newNode,
      [targetParentId]: { ...prev[targetParentId], children: [...prev[targetParentId].children, newNodeId] }
    }));
  };

  const handleChangeProp = (key, value) => { if (!selectedId) return; setNodes(prev => ({ ...prev, [selectedId]: { ...prev[selectedId], props: { ...prev[selectedId].props, [key]: value } } })); };
  const handleChangeStyle = (styleKey, value) => { if (!selectedId) return; setNodes(prev => ({ ...prev, [selectedId]: { ...prev[selectedId], props: { ...prev[selectedId].props, style: { ...prev[selectedId].props.style, [styleKey]: value } } } })); };

  const handleApplyTheme = (themeCode) => {
    let primary, navBg, rootBg, textColor, cardBg, inputBg, inputBorder;
    if (themeCode === 'midnight_gold') { primary = "#d4af37"; navBg = "#000000"; rootBg = "#121212"; textColor = "#ffffff"; cardBg = "#1e1e1e"; inputBg = "#1e1e1e"; inputBorder = "#333333"; }
    else if (themeCode === 'rose_quartz') { primary = "#b76e79"; navBg = "#ffffff"; rootBg = "#fdfbf7"; textColor = "#333333"; cardBg = "#ffffff"; inputBg = "#ffffff"; inputBorder = "#e2d1d4"; }
    else if (themeCode === 'royal_platinum') { primary = "#9ca3af"; navBg = "#18181b"; rootBg = "#09090b"; textColor = "#f4f4f5"; cardBg = "#27272a"; inputBg = "#27272a"; inputBorder = "#3f3f46"; }
    else if (themeCode === 'navy') { primary = "#3b82f6"; navBg = "#020617"; rootBg = "#0f172a"; textColor = "#ffffff"; cardBg = "#1e293b"; inputBg = "#1e293b"; inputBorder = "#334155"; }
    else if (themeCode === 'light') { primary = "#3b82f6"; navBg = "#ffffff"; rootBg = "#f3f4f6"; textColor = "#111827"; cardBg = "#ffffff"; inputBg = "#ffffff"; inputBorder = "#d1d5db"; }

    setScreens(prevScreens => {
      const updatedScreens = { ...prevScreens };
      Object.keys(updatedScreens).forEach(sId => {
        const sNodes = { ...updatedScreens[sId].nodes };
        for (const key in sNodes) {
          const node = sNodes[key];
          const props = { ...node.props };
          const style = { ...props.style };

          if (key === "root_container") {
            style.backgroundColor = rootBg;
            style.primaryColor = primary; 
          } else if (node.type === "Button") {
            style.backgroundColor = primary;
            style.color = "#ffffff"; 
          } else if (node.type === "Navbar") {
            style.backgroundColor = navBg;
            style.color = textColor;
          } else if (node.type === "Tabs") {
            style.primaryColor = primary;
          } else if (node.type === "Card") {
            style.backgroundColor = cardBg; 
          } else if (node.type === "TextField") {
            style.backgroundColor = inputBg;
            style.border = `1px solid ${inputBorder}`;
            style.color = textColor;
          } else if (node.type === "Header") {
            style.backgroundColor = cardBg;
            style.color = textColor;
          } else if (node.type === "Text" || node.type === "Icon" || node.type === "Process" || node.type === "Cycle") {
            style.color = textColor;
            if (node.type === "Process" || node.type === "Cycle" || node.type === "Graph") {
              style.primaryColor = primary;
            }
            if (node.type === "Cycle") {
              style.backgroundColor = cardBg;
            }
          }
          sNodes[key] = { ...node, props: { ...props, style } };
        }
        updatedScreens[sId].nodes = sNodes;
      });
      return updatedScreens;
    });
  };

  const handleDropNode = (draggedId, targetId) => {
    setNodes(prev => {
      const newNodes = { ...prev };
      let actualTargetId = targetId;
      if (newNodes[targetId].type !== "Container" && newNodes[targetId].type !== "Card" && newNodes[targetId].type !== "Row" && newNodes[targetId].type !== "Column") {
        for (const key in newNodes) {
          if (newNodes[key].children && newNodes[key].children.includes(targetId)) { actualTargetId = key; break; }
        }
      }
      if (draggedId === actualTargetId) return prev;
      for (const key in newNodes) {
        if (newNodes[key].children && newNodes[key].children.includes(draggedId)) {
          newNodes[key] = { ...newNodes[key], children: newNodes[key].children.filter(id => id !== draggedId) }; break;
        }
      }
      if (newNodes[actualTargetId].children) {
        newNodes[actualTargetId] = { ...newNodes[actualTargetId], children: [...newNodes[actualTargetId].children, draggedId] };
      }
      return newNodes;
    });
  };

  const handleDeleteNode = () => {
    if (!selectedId || selectedId === "root_container") return;
    setNodes(prev => {
      const newNodes = { ...prev };
      for (const key in newNodes) {
        if (newNodes[key].children && newNodes[key].children.includes(selectedId)) {
          newNodes[key] = { ...newNodes[key], children: newNodes[key].children.filter(id => id !== selectedId) }; break;
        }
      }
      const deleteNodeRecursively = (id) => {
        const node = newNodes[id];
        if (node && node.children) node.children.forEach(childId => deleteNodeRecursively(childId));
        delete newNodes[id];
      };
      deleteNodeRecursively(selectedId);
      return newNodes;
    });
    setSelectedId(null);
  };

  const handleExportFlutter = () => {
    const getFlutterColor = (hex) => {
      if (!hex || hex === 'transparent' || hex === '#transparent') return 'Colors.transparent';
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
      return `Color(0xFF${cleanHex.toUpperCase()})`;
    };

    const wrapWithAlign = (widgetCode, alignSelf) => {
      if (alignSelf === "flex-start") return `Align(alignment: Alignment.centerLeft, child: ${widgetCode})`;
      if (alignSelf === "flex-end") return `Align(alignment: Alignment.centerRight, child: ${widgetCode})`;
      if (alignSelf === "stretch") return `SizedBox(width: double.infinity, child: ${widgetCode})`;
      return `Align(alignment: Alignment.center, child: ${widgetCode})`; 
    };

    const wrapWithSpacing = (widgetCode, style) => {
      let wrapped = widgetCode;
      const pad = parseInt(style.padding) || 0;
      const mar = parseInt(style.margin) || 0;
      if (pad > 0) wrapped = `Padding(padding: const EdgeInsets.all(${pad}.0), child: ${wrapped})`;
      if (mar > 0) wrapped = `Padding(padding: const EdgeInsets.all(${mar}.0), child: ${wrapped})`;
      return wrapped;
    };

    const getFlutterMainAlign = (val) => {
      if (val === 'center') return 'MainAxisAlignment.center';
      if (val === 'flex-end') return 'MainAxisAlignment.end';
      if (val === 'space-between') return 'MainAxisAlignment.spaceBetween';
      if (val === 'space-around') return 'MainAxisAlignment.spaceAround';
      return 'MainAxisAlignment.start';
    };

    const getFlutterCrossAlign = (val) => {
      if (val === 'flex-start') return 'CrossAxisAlignment.start';
      if (val === 'flex-end') return 'CrossAxisAlignment.end';
      if (val === 'stretch') return 'CrossAxisAlignment.stretch';
      return 'CrossAxisAlignment.center';
    };

    const generateFlutterWidget = (nodeId, screenNodes, parentType = "Container") => {
      const node = screenNodes[nodeId];
      if (!node) return "";
      if (node.type === "Navbar" || node.type === "Header") return ""; 

      const style = node.props.style || {};
      const fw = style.fontWeight === 'bold' ? 'FontWeight.bold' : 'FontWeight.normal';
      const align = style.textAlign === 'center' ? 'TextAlign.center' : (style.textAlign === 'right' ? 'TextAlign.right' : 'TextAlign.left');
      
      let widgetCode = "";

      if (node.type === "Container" || node.type === "Card" || node.type === "Row" || node.type === "Column") {
        const bgColor = style.backgroundColor ? `color: ${getFlutterColor(style.backgroundColor)},` : "";
        const direction = node.type === "Row" ? "Row" : (node.type === "Column" ? "Column" : (style.flexDirection === 'row' ? 'Row' : 'Column'));
        const rad = parseInt(style.borderRadius) || 0;
        
        const mainAlign = getFlutterMainAlign(style.justifyContent);
        const crossAlign = getFlutterCrossAlign(style.alignItems);
        
        const normalChildren = [];
        const absChildren = [];
        
        (node.children || []).forEach(childId => {
          const cNode = screenNodes[childId];
          if (!cNode) return;
          if (cNode.props.style?.positionType === "absoluteTopRight") {
            const tPx = cNode.props.style?.top ?? 15;
            const rPx = cNode.props.style?.right ?? 15;
            absChildren.push(`Positioned(top: ${tPx}.0, right: ${rPx}.0, child: ${generateFlutterWidget(childId, screenNodes, node.type)})`);
          } else {
            normalChildren.push(generateFlutterWidget(childId, screenNodes, node.type));
          }
        });

        const columnCode = `${direction}(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: ${mainAlign},
          crossAxisAlignment: ${crossAlign},
          children: [\n${normalChildren.filter(c => c !== "").join(",\n")}\n],
        )`;

        let innerContent = columnCode;
        if (absChildren.length > 0) {
          innerContent = `Stack(
            children: [
              SizedBox(width: double.infinity, child: ${columnCode}),
              ${absChildren.join(",\n")}
            ],
          )`;
        }

        if (node.type === "Card") {
           widgetCode = `Card(
            elevation: 4.0,
            color: ${style.backgroundColor ? getFlutterColor(style.backgroundColor) : 'Colors.white'},
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(${rad || 12}.0)),
            child: ${innerContent},
          )`;
        } else {
          if (rad > 0 || bgColor) {
             widgetCode = `Container(
              decoration: BoxDecoration(
                ${bgColor}
                ${rad > 0 ? `borderRadius: BorderRadius.circular(${rad}.0),` : ''}
              ),
              ${(node.type === "Row" || node.type === "Column") ? '' : 'width: double.infinity,'}
              child: ${innerContent},
            )`;
          } else {
            widgetCode = (node.type === "Row" || node.type === "Column") ? innerContent : `Container(width: double.infinity, child: ${innerContent})`;
          }
        }
        
        widgetCode = wrapWithSpacing(widgetCode, style);
        if ((node.type === "Card" || node.type === "Row" || node.type === "Column") && style.positionType !== "absoluteTopRight" && style.flex !== 1) {
          widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
        }
      } 
      else if (node.type === "TextField") {
        const colorStr = style.color ? getFlutterColor(style.color) : 'Colors.black';
        const fillStr = style.backgroundColor ? getFlutterColor(style.backgroundColor) : 'Colors.white';
        const rad = parseInt(style.borderRadius) || 8;
        widgetCode = `TextField(
          style: TextStyle(color: ${colorStr}, fontSize: ${parseInt(style.fontSize) || 14}.0, fontWeight: ${fw}),
          textAlign: ${align},
          decoration: InputDecoration(
            hintText: "${node.props.placeholder}",
            hintStyle: TextStyle(color: Colors.grey),
            filled: true,
            fillColor: ${fillStr},
            contentPadding: const EdgeInsets.all(${parseInt(style.padding) || 12}.0),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(${rad}.0),
              borderSide: BorderSide.none,
            ),
          ),
        )`;
        widgetCode = wrapWithSpacing(widgetCode, style);
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      }
      else if (node.type === "Icon") {
        const colorStr = style.color ? `color: ${getFlutterColor(style.color)}` : "";
        widgetCode = `Text(
          "${node.props.icon}",
          style: TextStyle(fontSize: ${parseInt(style.fontSize) || 24}.0, ${colorStr}),
        )`;
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      }
      else if (node.type === "Text") {
        const colorStr = style.color ? `color: ${getFlutterColor(style.color)}` : "";
        widgetCode = `Text(
          "${node.props.text}",
          textAlign: ${align},
          style: TextStyle(fontSize: ${parseInt(style.fontSize) || 16}.0, ${colorStr}, fontWeight: ${fw}),
        )`;
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      } 
      else if (node.type === "Button") {
        const bgColor = style.backgroundColor ? getFlutterColor(style.backgroundColor) : getFlutterColor('#10b981');
        const colorStr = style.color ? getFlutterColor(style.color) : getFlutterColor('#ffffff');
        const rad = parseInt(style.borderRadius) || 6;
        
        let onPressedCode = "() {}";
        if (node.props.actionType === "alert") {
          onPressedCode = `() { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("${node.props.actionValue || ''}"))); }`;
        } else if (node.props.actionType === "url") {
          onPressedCode = `() { print("Launch URL: ${node.props.actionValue || ''}"); }`;
        } else if (node.props.actionType === "navigate" && node.props.actionValue) {
          onPressedCode = `() { Navigator.pushNamed(context, '/${node.props.actionValue}'); }`;
        }

        widgetCode = `ElevatedButton(
          onPressed: ${onPressedCode},
          style: ElevatedButton.styleFrom(
            backgroundColor: ${bgColor},
            foregroundColor: ${colorStr},
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(${rad}.0)),
          ),
          child: Text("${node.props.text}", style: TextStyle(fontSize: ${parseInt(style.fontSize) || 16}.0, fontWeight: ${fw})),
        )`;
        widgetCode = wrapWithSpacing(widgetCode, style);
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      } 
      else if (node.type === "Image") {
        const rad = parseInt(style.borderRadius) || 0;
        const w = parseInt(style.width) || 100;
        const h = parseInt(style.height) || 100;
        widgetCode = `Image.network("${node.props.src}", width: ${w}.0, height: ${h}.0, fit: BoxFit.cover)`;
        if (rad > 0) {
          widgetCode = `ClipRRect(borderRadius: BorderRadius.circular(${rad}.0), child: ${widgetCode})`;
        }
        widgetCode = wrapWithSpacing(widgetCode, style);
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      }
      else if (node.type === "Process") {
        const colorStr = style.primaryColor ? getFlutterColor(style.primaryColor) : 'Colors.blue';
        const textColor = style.color ? getFlutterColor(style.color) : 'Colors.grey';
        const val = node.props.progress || 50;
        widgetCode = `Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("${node.props.text || 'Progress'}", style: TextStyle(fontSize: 12.0, color: ${textColor})),
                Text("${val}%", style: TextStyle(fontSize: 12.0, color: ${textColor})),
              ],
            ),
            const SizedBox(height: 5.0),
            ClipRRect(
              borderRadius: BorderRadius.circular(5.0),
              child: LinearProgressIndicator(
                value: ${val} / 100,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(${colorStr}),
                minHeight: 8.0,
              ),
            )
          ],
        )`;
        widgetCode = wrapWithSpacing(widgetCode, style);
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      }
      else if (node.type === "Cycle") {
        const colorStr = style.primaryColor ? getFlutterColor(style.primaryColor) : 'Colors.blue';
        const textColor = style.color ? getFlutterColor(style.color) : 'Colors.black';
        const val = node.props.progress || 50;
        const size = parseInt(style.fontSize) || 80;
        widgetCode = `SizedBox(
          width: ${size}.0,
          height: ${size}.0,
          child: Stack(
            fit: StackFit.expand,
            children: [
              CircularProgressIndicator(
                value: ${val} / 100,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(${colorStr}),
                strokeWidth: 8.0,
              ),
              Center(child: Text("${val}%", style: TextStyle(color: ${textColor}, fontWeight: FontWeight.bold, fontSize: ${size/4}.0))),
            ],
          ),
        )`;
        widgetCode = wrapWithSpacing(widgetCode, style);
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      }
      else if (node.type === "Graph") {
        const dataStr = node.props.dataString || "40, 70, 30, 90, 50, 80, 60";
        const data = dataStr.split(",").map(n => parseInt(n.trim()) || 0);
        const max = Math.max(...data, 100);
        const colorStr = style.primaryColor ? getFlutterColor(style.primaryColor) : 'Colors.blue';
        const bgStr = style.backgroundColor ? getFlutterColor(style.backgroundColor) : 'Colors.transparent';
        const h = parseInt(style.height) || 150;
        
        let barsCode = data.map(v => {
          return `Container(
            width: 15.0,
            height: ${(v / max) * h},
            decoration: BoxDecoration(
              color: ${colorStr},
              borderRadius: const BorderRadius.vertical(top: Radius.circular(4.0))
            ),
          )`;
        }).join(',\n              ');

        widgetCode = `Container(
          height: ${h}.0,
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: ${bgStr},
            borderRadius: BorderRadius.circular(8.0)
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              ${barsCode}
            ]
          )
        )`;
        widgetCode = wrapWithSpacing(widgetCode, style);
        if (style.positionType !== "absoluteTopRight" && style.flex !== 1) widgetCode = wrapWithAlign(widgetCode, style.alignSelf);
      }
      
      if ((parentType === "Row" || parentType === "Column") && style.flex > 0 && style.positionType !== "absoluteTopRight") {
        widgetCode = `Expanded(flex: ${style.flex}, child: ${widgetCode})`;
      }

      return widgetCode;
    };

    let screenClassesCode = "";
    let routesMapCode = "";

    Object.entries(screens).forEach(([sId, screenData]) => {
      const sNodes = screenData.nodes;
      const widgetTree = generateFlutterWidget("root_container", sNodes, "Scaffold");

      let bottomNavStr = "null";
      let appBarStr = "null";
      let rootBgStr = sNodes["root_container"]?.props?.style?.backgroundColor ? getFlutterColor(sNodes["root_container"].props.style.backgroundColor) : 'Colors.white';

      let navbarNode = null;
      let headerNode = null;
      for (const key in sNodes) {
        if (sNodes[key].type === "Navbar") navbarNode = sNodes[key];
        if (sNodes[key].type === "Header") headerNode = sNodes[key];
      }

      if (headerNode) {
        const hProps = headerNode.props;
        const hStyle = hProps.style || {};
        const hBgColor = hStyle.backgroundColor ? getFlutterColor(hStyle.backgroundColor) : getFlutterColor('#1f2937');
        const hTextColor = hStyle.color ? getFlutterColor(hStyle.color) : 'Colors.white';

        const getActionCode = (type, val) => {
          if (type === 'back') return `() { Navigator.pop(context); }`;
          if (type === 'navigate' && val) return `() { Navigator.pushNamed(context, '/${val}'); }`;
          if (type === 'alert') return `() { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("${val || ''}"))); }`;
          return `() {}`;
        };

        let leadingStr = 'null';
        if (hProps.leftIcons && hProps.leftIcons.length > 0) {
           const actionWidgets = hProps.leftIcons.map(li => {
              const code = getActionCode(li.actionType, li.actionValue);
              const text = li.icon || "⌂";
              return `TextButton(child: Text("${text}", style: TextStyle(fontSize: 16.0, color: ${hTextColor}, fontWeight: FontWeight.bold)), onPressed: ${code})`;
           });
           if (actionWidgets.length === 1) {
               leadingStr = actionWidgets[0];
           } else {
               leadingStr = `Row(mainAxisSize: MainAxisSize.min, children: [${actionWidgets.join(', ')}])`;
           }
        }

        let actionsStr = '[]';
        if (hProps.rightIcons && hProps.rightIcons.length > 0) {
           const actionWidgets = hProps.rightIcons.map(ri => {
              const code = getActionCode(ri.actionType, ri.actionValue);
              const text = ri.icon || "⚙";
              return `TextButton(child: Text("${text}", style: TextStyle(fontSize: 16.0, color: ${hTextColor}, fontWeight: FontWeight.bold)), onPressed: ${code})`;
           });
           actionsStr = `[${actionWidgets.join(', ')}]`;
        }

        const leadingWidthStr = hProps.leftIcons && hProps.leftIcons.length > 1 ? 'leadingWidth: 100.0,' : '';

        appBarStr = `AppBar(
          backgroundColor: ${hBgColor},
          title: Text("${hProps.text || 'Title'}", style: TextStyle(color: ${hTextColor}, fontWeight: FontWeight.bold, fontSize: 16.0)),
          centerTitle: true,
          leading: ${leadingStr},
          ${leadingWidthStr}
          actions: ${actionsStr},
          elevation: 0,
        )`;
      }

      if (navbarNode) {
        const bgColor = navbarNode.props.style?.backgroundColor ? getFlutterColor(navbarNode.props.style.backgroundColor) : getFlutterColor('#1f2937');
        const colorStr = navbarNode.props.style?.color ? getFlutterColor(navbarNode.props.style.color) : 'Colors.white';
        const items = navbarNode.props.items || [];
        const layout = navbarNode.props.itemLayout || "column";
        const fontSizeStr = navbarNode.props.style?.fontSize ? parseInt(navbarNode.props.style.fontSize) : 14;
        
        const rowItems = items.map(item => {
          const icon = typeof item === 'string' ? item.split(' ')[0] : item.icon;
          const label = typeof item === 'string' ? item.replace(icon, '').trim() : item.label;
          const linkTo = typeof item === 'string' ? "" : (item.linkTo || "");

          let onTapCode = linkTo ? `onTap: () { Navigator.pushNamed(context, '/${linkTo}'); },` : '';

          let colOrRow = '';
          if (layout === "column") {
            colOrRow = `Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("${icon}", style: TextStyle(fontSize: ${fontSizeStr + 8}.0, color: ${colorStr})),
                const SizedBox(height: 2),
                Text("${label}", style: TextStyle(color: ${colorStr}, fontSize: ${fontSizeStr}.0)),
              ],
            )`;
          } else {
            colOrRow = `Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("${icon}", style: TextStyle(fontSize: ${fontSizeStr + 4}.0, color: ${colorStr})),
                const SizedBox(width: 6),
                Text("${label}", style: TextStyle(color: ${colorStr}, fontSize: ${fontSizeStr}.0)),
              ],
            )`;
          }

          return `GestureDetector(
            ${onTapCode}
            child: ${colOrRow},
          )`;

        }).join(',\n              ');

        const navWidget = `Container(
          color: ${bgColor},
          padding: const EdgeInsets.symmetric(vertical: 10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              ${rowItems}
            ],
          ),
        )`;

        if (navbarNode.props.position === "top" && !headerNode) {
          appBarStr = `PreferredSize(
            preferredSize: const Size.fromHeight(80.0),
            child: SafeArea(child: ${navWidget}),
          )`;
        } else {
          bottomNavStr = navWidget;
        }
      }

      screenClassesCode += `
class Screen_${sId} extends StatelessWidget {
  const Screen_${sId}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ${rootBgStr},
      appBar: ${appBarStr},
      body: SafeArea(
        child: SizedBox.expand(
          child: Stack(
            children: [
              SingleChildScrollView(
                child: ${widgetTree},
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: ${bottomNavStr},
    );
  }
}
`;
      routesMapCode += `        '/${sId}': (context) => const Screen_${sId}(),\n`;
    });

    const finalFlutterCode = `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Premium App Builder',
      initialRoute: '/${activeScreen}',
      routes: {
${routesMapCode}
      },
    );
  }
}
${screenClassesCode}
`;
    navigator.clipboard.writeText(finalFlutterCode);
    alert("คัดลอกโค้ด Flutter สำเร็จ! นำไปรันได้เลย 💙");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", margin: 0 }}>
      <Sidebar 
        onAddNode={handleAddNode} onExportFlutter={handleExportFlutter} onApplyTheme={handleApplyTheme} 
        screens={screens} activeScreen={activeScreen} setActiveScreen={handleSwitchScreen} 
        onAddScreen={handleAddScreen} onDeleteScreen={handleDeleteScreen}
        onClearProject={handleClearProject} onExportJson={handleExportJson} onImportJson={handleImportJson} // 🌟 Props ใหม่สำหรับการจัดการไฟล์
      />
      
      <div style={{ flex: 1, padding: "40px", background: "#e5e7eb", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ 
          background: "white", width: "100%", maxWidth: "390px", height: "800px", maxHeight: "85vh", 
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)", 
          overflowY: "auto", overflowX: "hidden", position: "relative", 
          borderRadius: "36px", border: "12px solid #1f2937",
          display: "flex", flexDirection: "column"
        }}>
          <RenderNode nodeId="root_container" nodes={nodes} selectedId={selectedId} onSelect={setSelectedId} onDropNode={handleDropNode} />
        </div>
      </div>
      
      <PropertyEditor selectedNode={selectedNode} onChangeProp={handleChangeProp} onChangeStyle={handleChangeStyle} onDelete={handleDeleteNode} screens={screens} />
    </div>
  );
}