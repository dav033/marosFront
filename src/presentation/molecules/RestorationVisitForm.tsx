import { Input } from "../atoms";
import RestorationVisit from "../organisms/RestorationVisit";

interface RestorationVisitFormFields {
  projectNumber: string;
  ProjectName: string;
  ProjectLocation: string;
  ClientName: string;
  ContactName: string;
  Email?: string;
  phone?: string;
  StartDate?: string; // YYYY-MM-DD
  Overview: string;
}

export default function RestorationVisitForm(
  props: RestorationVisitFormFields
) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="mb-2">
          <Input value={props.projectNumber} label="Project Number" />
        </div>
        <div className="mb-2">
          <Input value={props.ProjectName} label="Project Name" />
        </div>
        <div className="mb-2">
          <Input value={props.ProjectLocation} label="Project Location" />
        </div>
        <div className="mb-2">
          <Input value={props.ClientName} label="Client Name" />
        </div>
        <div className="mb-2">
          <Input value={props.ContactName} label="Contact Name" />
        </div>
      </div>
      <div>
        <div className="mb-2">
          <Input value={props.Email} label="Email" />
        </div>
        <div className="mb-2">
          <Input value={props.phone} label="Phone" />
        </div>
        <div className="mb-2">
          <Input value={props.StartDate} label="Start Date" />
        </div>
        <div className="mb-2">
          <Input value={props.Overview} label="Overview" />
        </div>
      </div>
    </div>
  );
}
