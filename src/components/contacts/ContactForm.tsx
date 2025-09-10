import { GenericInput } from "@components/common/GenericInput";
import type { ContactFormData, ContactFormComponentProps } from "@/types";

export default function ContactForm({
  form,
  onChange,
  error,
}: ContactFormComponentProps) {
  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <GenericInput
          id="companyName"
          type="text"
          placeholder="Company Name *"
          value={form.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          icon="material-symbols:business-center"
        />

        <GenericInput
          id="name"
          type="text"
          placeholder="Contact Name *"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          icon="material-symbols:person"
        />

        <GenericInput
          id="occupation"
          type="text"
          placeholder="Occupation"
          value={form.occupation || ""}
          onChange={(e) => onChange("occupation", e.target.value)}
          icon="material-symbols:work"
        />

        <GenericInput
          id="product"
          type="text"
          placeholder="Product"
          value={form.product || ""}
          onChange={(e) => onChange("product", e.target.value)}
          icon="material-symbols:inventory"
        />

        <GenericInput
          id="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone || ""}
          onChange={(e) => onChange("phone", e.target.value)}
          icon="material-symbols:settings-phone-sharp"
        />

        <GenericInput
          id="email"
          type="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          icon="material-symbols:attach-email-outline"
        />
      </div>

      <GenericInput
        id="address"
        type="text"
        placeholder="Address"
        value={form.address || ""}
        onChange={(e) => onChange("address", e.target.value)}
        icon="material-symbols:location-on"
      />
    </div>
  );
}
