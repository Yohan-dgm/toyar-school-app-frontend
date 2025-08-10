export interface IntelligenceType {
  id: number;
  label: string;
}

export const INTELLIGENCE_TYPES: IntelligenceType[] = [
  { id: 1, label: "Music Intelligence" },
  { id: 2, label: "Bodily Kinesthetic Intelligence" },
  { id: 3, label: "Existential Intelligence" },
  { id: 4, label: "Spatial Intelligence" },
  { id: 5, label: "Naturalistic Intelligence" },
  { id: 6, label: "Contribution to School Community" },
  { id: 7, label: "Contribution to Society" },
  { id: 8, label: "Life Skills Development" },
];

export const getIntelligenceTypeById = (
  id: number,
): IntelligenceType | undefined => {
  return INTELLIGENCE_TYPES.find((type) => type.id === id);
};

export const getIntelligenceTypeOptions = () => {
  return INTELLIGENCE_TYPES.map((type) => ({
    label: type.label,
    value: type.id,
  }));
};
