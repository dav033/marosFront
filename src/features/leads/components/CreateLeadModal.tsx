import { useState } from "react";
import { GenericInput } from "@components/common/GenericInput";
import type { ProjectType, Contacts, Lead } from "src/types/types";
import { LeadType, FormMode, ContactMode } from "src/types/enums";
import { useLeadForm } from "src/hooks/useLeadForm";
import BaseLeadModal from "./BaseLeadModal";
import LeadFormFields from "./LeadFormFields";
import ContactModeSelector from "./ContactModeSelector";
import {
	validateNewContactLead,
	validateExistingContactLead,
	createLeadWithNewContact,
	createLeadWithExistingContact,
} from "src/utils/leadHelpers";

interface CreateLeadModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectTypes: ProjectType[];
	contacts: Contacts[];
	leadType: LeadType;
	onLeadCreated: (lead: Lead) => void;
}

export default function CreateLeadModal({
	isOpen,
	onClose,
	projectTypes,
	contacts,
	leadType,
	onLeadCreated,
}: CreateLeadModalProps) {
	const [contactMode, setContactMode] = useState<ContactMode>(ContactMode.NEW_CONTACT);

	const handleSubmit = async (formData: any) => {
		let validationError: string | null = null;

		if (contactMode === ContactMode.NEW_CONTACT) {
			validationError = validateNewContactLead({
				leadName: formData.leadName,
				customerName: formData.customerName,
				contactName: formData.contactName,
				projectTypeId: formData.projectTypeId,
				email: formData.email,
			});

			if (validationError) {
				throw new Error(validationError);
			}

			const newLead = await createLeadWithNewContact({
				leadName: formData.leadName,
				customerName: formData.customerName,
				contactName: formData.contactName,
				phone: formData.phone,
				email: formData.email,
				projectTypeId: Number(formData.projectTypeId),
				location: formData.location,
				leadType: leadType,
			});
			onLeadCreated(newLead);
		} else {
			validationError = validateExistingContactLead({
				leadName: formData.leadName,
				contactId: formData.contactId,
				projectTypeId: formData.projectTypeId,
			});

			if (validationError) {
				throw new Error(validationError);
			}

			const newLead = await createLeadWithExistingContact({
				leadName: formData.leadName,
				contactId: Number(formData.contactId),
				projectTypeId: Number(formData.projectTypeId),
				location: formData.location,
				leadType: leadType,
			});
			onLeadCreated(newLead);
		}
	};

	// ...rest of your modal logic (form, rendering, etc.)
	// This is a stub for migration. Copy the rest of your modal code as needed.
	return null;
}
