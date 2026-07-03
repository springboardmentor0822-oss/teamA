const departments = [
  {
    name: "Environmental Department",
    scope: "Air quality, pollution control, waste management, sustainability",
    contact: "1800-11-8600",
    email: "support@cpcb.gov.in",
    website: "https://cpcb.nic.in/",
    grievance: "https://pgportal.gov.in/",
  },
  {
    name: "Infrastructure Department",
    scope: "Roads, public utilities, urban works and civic infrastructure",
    contact: "1800-11-3434",
    email: "info@morth.nic.in",
    website: "https://morth.nic.in/",
    grievance: "https://pgportal.gov.in/",
  },
  {
    name: "Education Department",
    scope: "Schools, higher education, skill development and literacy",
    contact: "1800-11-6969",
    email: "feedback@education.gov.in",
    website: "https://www.education.gov.in/",
    grievance: "https://pgportal.gov.in/",
  },
  {
    name: "Public Safety Department",
    scope: "Law & order, emergency response, disaster management support",
    contact: "112",
    email: "citizen@ndma.gov.in",
    website: "https://ndma.gov.in/",
    grievance: "https://pgportal.gov.in/",
  },
  {
    name: "Transportation Department",
    scope: "Public transport planning, traffic systems, mobility services",
    contact: "1800-11-0400",
    email: "helpdesk@transport.gov.in",
    website: "https://parivahan.gov.in/",
    grievance: "https://pgportal.gov.in/",
  },
  {
    name: "Healthcare Department",
    scope: "Public health services, hospitals, disease control, health schemes",
    contact: "1075",
    email: "helpdesk-nhm@gov.in",
    website: "https://www.mohfw.gov.in/",
    grievance: "https://pgportal.gov.in/",
  },
];

const publicResources = [
  {
    title: "Centralized Public Grievance Portal",
    description: "File complaints and track resolution by ministry/department.",
    link: "https://pgportal.gov.in/",
  },
  {
    title: "MyGov India",
    description: "Participate in policy discussions and civic campaigns.",
    link: "https://www.mygov.in/",
  },
  {
    title: "Open Government Data Platform",
    description: "Access government datasets for insights and transparency.",
    link: "https://data.gov.in/",
  },
  {
    title: "National Portal of India",
    description: "Official directory of ministries, schemes, and citizen services.",
    link: "https://www.india.gov.in/",
  },
];

exports.getOfficialsDirectory = async (_req, res) => {
  try {
    res.status(200).json({
      departments,
      publicResources,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
