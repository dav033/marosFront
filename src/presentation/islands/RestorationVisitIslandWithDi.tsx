import { DiProvider } from "../../di/DiProvider";
import RestorationVisit from "../organisms/RestorationVisit";

export default function RestorationVisitIslandWithDi() {
  return (
    <DiProvider>
      <RestorationVisit />
    </DiProvider>
  );
}
