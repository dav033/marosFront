import React from "react";
import RestorationVisitForm from "../molecules/RestorationVisitForm";

export default function RestorationVisit() {
  const [ProjectNumber, setProjectNumber] = React.useState("");
  const [ProjectName, setProjectName] = React.useState("");
  const [ProjectLocation, setProjectLocation] = React.useState("");
  const [ClientName, setClientName] = React.useState("");
  const [ContactName, setContactName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [StartDate, setStartDate] = React.useState("");
  const [Overview, setOverview] = React.useState("");


                                                    

  return (
    <RestorationVisitForm
      projectNumber={ProjectNumber}
      ProjectName={ProjectName}
      ProjectLocation={ProjectLocation}
      ClientName={ClientName}
      ContactName={ContactName}
      Email={Email}
      phone={phone}
      StartDate={StartDate}
      Overview={Overview}
    />
  );
}
