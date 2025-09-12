import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Icon } from "@iconify/react";
import type { Option, GenericSelectProps } from "../../types/components/common";

export default function GenericSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  icon,
  disabled = false,
  className = "",
}: GenericSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click (includes both container and dropdown)
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Compute portal position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const selectedOption = options.find((o: Option) => o.value === value);
  const filteredOptions = searchable
    ? options.filter((o: Option) =>
        (o.label || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const baseControl = `
    flex items-center h-10 w-full
    rounded-xl bg-theme-dark border-[0.75px] border-theme-gray
    text-theme-light placeholder:text-gray-400
    pr-3 py-2 text-sm outline-none focus:outline-none
    ring-0 focus:ring-0 disabled:cursor-not-allowed
    disabled:opacity-50
  `;
  const plClass = icon ? "pl-10" : "pl-3";

  const dropdown = (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 9999,
      }}
      className="bg-theme-dark border-[0.75px] border-theme-gray rounded-xl max-h-60 overflow-auto shadow-lg"
    >
      {searchable && (
        <div className="px-3 py-2 border-b border-theme-gray">
          <input
            type="text"
            className="w-full bg-theme-dark border-none text-sm text-theme-light placeholder:text-gray-400 outline-none focus:outline-none"
            placeholder="Buscar…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}
      {filteredOptions.map((opt: Option) => (
        <button
          key={opt.value}
          type="button"
          className="w-full text-left px-3 py-2 text-sm truncate text-theme-light hover:bg-theme-gray cursor-pointer border-none bg-transparent"
          onClick={() => {
            onChange(opt.value);
            setIsOpen(false);
            setSearchTerm("");
          }}
        >
          {opt.label || "Sin etiqueta"}
        </button>
      ))}
      {searchable && filteredOptions.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-400">No hay opciones</div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full mb-2 overflow-visible ${className}`}
    >
      {icon && (
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon icon={icon} className="text-gray-400 w-5 h-5" />
        </span>
      )}

      {!searchable ? (
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseControl} ${plClass}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt: Option) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || "Sin etiqueta"}
            </option>
          ))}
        </select>
      ) : (
        <>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((o) => !o)}
            className={`${baseControl} ${plClass} justify-between`}
          >
            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
            <Icon
              icon={
                isOpen
                  ? "material-symbols:arrow-drop-up"
                  : "material-symbols:arrow-drop-down"
              }
              className="w-6 h-6 text-gray-400"
            />
          </button>
          {isOpen && ReactDOM.createPortal(dropdown, document.body)}
        </>
      )}
    </div>
  );
};
