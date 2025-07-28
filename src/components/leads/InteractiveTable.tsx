import { LeadType } from "src/types/enums";
import LeadSection from "./LeadSection";
import { useLeadsByType } from "src/hooks/useLeadsByType";
import { leadTableColumns } from "./LeadTableColumns.tsx";

export default function InteractiveTable() {
  const leadType = LeadType.CONSTRUCTION;
  const { sections, loading, error, refetch } = useLeadsByType(leadType);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      
      <button
        onClick={refetch}
        className="px-4 py-2 bg-[#FE7743] text-[#EFEEEA] rounded hover:bg-[#FE7743]/90"
      >
        Refresh Data
      </button>

      {sections.map(({ title, data }) => (
        <LeadSection
          key={title}
          title={title}
          data={data}
          columns={leadTableColumns}
        />
      ))}
    </div>
  );
}
