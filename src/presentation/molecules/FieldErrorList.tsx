import React from "react";

export type FieldErrorListProps = {
  errors?: { name?: string; email?: string; phone?: string } | null;
  className?: string;
};

const FieldErrorList: React.FC<FieldErrorListProps> = ({ errors, className = "" }) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className={`mt-2 space-y-1 ${className}`}>
      {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
      {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
      {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
    </div>
  );
};

export default FieldErrorList;
