import * as React from "react";

type ListEditorProps = {
  title: string;
  items: string[];
  onAdd: () => void;
  onEdit: (index: number, value: string) => void;
  onDelete: (index: number) => void;
};

export default function ListEditor({ title, items, onAdd, onEdit, onDelete }: ListEditorProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            className="border border-gray-700 bg-gray-800 text-white rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={item ?? ""}
            onChange={(e) => onEdit(index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  );
}
