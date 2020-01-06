export interface Incident {
  id: string;
  name: string;
  description: string;
  status: "open" | "closed" | "ongoing";
  createdDate: string;
  lastModifiedDate: string;
}
