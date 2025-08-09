import React from "react";
import { GenericInput } from "@components/common/GenericInput";
import { GenericSelect } from "@components/common/GenericSelect";

import { FormMode, ContactMode } from "src/types/enums";
import {
	getStatusOptions,
	formatContactOptions,
	formatProjectTypeOptions,
} from "@utils/leadHelpers";
import type { LeadFormData, ProjectType, Contacts } from "@/types";

interface LeadFormFieldsProps {
	form: LeadFormData;
	onChange: (field: keyof LeadFormData, value: string) => void;
	projectTypes: ProjectType[];
	contacts?: Contacts[];
	mode?: FormMode;
	contactMode?: ContactMode;
}

const LeadFormFields = ({
	form,
	onChange,
	projectTypes,
	contacts = [],
	mode = FormMode.CREATE,
	contactMode,
}: LeadFormFieldsProps) => {
	const statusOptions = getStatusOptions();
	const contactOptions = formatContactOptions(contacts);
	const projectTypeOptions = formatProjectTypeOptions(projectTypes);

	const showLeadName = true;
	const showStatus = mode === FormMode.EDIT;
	const showStartDate = mode === FormMode.EDIT;

	const showContactSelect = mode === FormMode.EDIT || contactMode === ContactMode.EXISTING_CONTACT;

	return (
		<>
			{showLeadName && (
				<GenericInput
					value={form.leadName}
					onChange={(e) => onChange("leadName", e.target.value)}
					placeholder="Lead Name *"
					icon="material-symbols:assignment"
				/>
			)}

			<GenericSelect
				searchable
				options={projectTypeOptions}
				value={form.projectTypeId}
				onChange={(val) => onChange("projectTypeId", val)}
				placeholder="Select Project Type *"
				icon="material-symbols:design-services"
				className="w-full"
			/>

			{showContactSelect && (
				<GenericSelect
					searchable
					options={contactOptions}
					value={form.contactId}
					onChange={(val) => onChange("contactId", val)}
					placeholder="Select Contact *"
					icon="material-symbols:person"
					className="w-full"
				/>
			)}

			<GenericInput
				value={form.location}
				onChange={(e) => onChange("location", e.target.value)}
				placeholder="Location"
				icon="material-symbols:location-on"
			/>

			{showStatus && (
				<GenericSelect
					options={statusOptions}
					value={form.status || ""}
					onChange={(val) => onChange("status", val)}
					placeholder="Select Status"
					icon="material-symbols:flag"
				/>
			)}

			{showStartDate && (
				<GenericInput
					value={form.startDate}
					onChange={(e) => onChange("startDate", e.target.value)}
					placeholder="Start Date"
					icon="material-symbols:calendar-today"
				/>
			)}
		</>
	);
};

export default LeadFormFields;
