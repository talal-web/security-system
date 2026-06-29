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

    since: "2024",

    description:
      "Baidar Security Services proudly provides professional security personnel and workforce management solutions for Blue World City. Our team is committed to maintaining a secure, disciplined, and professional environment through trained security guards, operational supervision, and modern security practices.",

    services: [
      "Gate Security",
      "Residential Security",
      "Commercial Security",
      "Visitor Management",
      "Access Control",
      "Patrolling",
      "Emergency Response",
      "Incident Reporting",
      "Parking Security",
      "Perimeter Monitoring",
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
      {
        label: "Partnership",
        value: "Ongoing",
      },
    ],
  },

  {
    id: "capital-smart-city",

    companyName: "Capital Smart City",

    logo: "/companies/capital-smart-city/logo.png",

    coverImage: "/companies/capital-smart-city/cover.jpg",

    location: "Rawalpindi",

    partnership: "Security Operations",

    status: "Coming Soon",

    since: "-",

    description:
      "Future security operations and workforce deployment can be managed through the same platform while maintaining centralized monitoring and operational transparency.",

    services: [
      "Gate Security",
      "Access Control",
      "Patrolling",
      "Visitor Verification",
      "Emergency Response",
    ],

    stats: [
      {
        label: "Status",
        value: "Upcoming",
      },
      {
        label: "Coverage",
        value: "-",
      },
      {
        label: "Service",
        value: "Security",
      },
      {
        label: "Partnership",
        value: "Future",
      },
    ],
  },
];
