export interface Company {
  id: string;

  companyName: string;
  logo: string;
  coverImage: string;

  location: string;
  partnership: string;
  status: string;
  since: string;

  description: string;

  services: string[];

  stats: {
    label: string;
    value: string;
  }[];
}

export const companies: Company[] = [
  {
    id: "blue-world-city",

    companyName: "Blue World City",

    logo: "/companies/blue-world-city/logo.png",

    coverImage: "/companies/blue-world-city/cover.jpg",

    location: "Chakri Road, Rawalpindi",

    partnership: "Official Security Services",

    status: "Active Contract",

    since: "2021",

    description:
      "Professional security personnel and workforce support for Blue World City.",

    services: [
      "Gate Security",
      "Commercial Security",
      "Patrolling",
      "Incident Reporting",
      "Parking Security",
    ],

    stats: [
      {
        label: "Status",
        value: "Active",
      },
      {
        label: "Coverage",
        value: "24/7",
      },
      {
        label: "Service",
        value: "Security",
      },
    ],
  },
];
