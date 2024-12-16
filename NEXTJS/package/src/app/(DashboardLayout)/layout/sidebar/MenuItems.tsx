import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "SOAP",
  },
  {
    id: uniqueId(),
    title: "SOAP",
    icon: IconLayoutDashboard,
    href: "/SOC/SOAP",
  },
  {
    id: uniqueId(),
    title: "SOAP VIEW",
    icon: IconAperture,
    href: "/SOC/SOAPVIEW",
  },
  {
    navlabel: true,
    subheader: "REST",
  },
  {
    id: uniqueId(),
    title: "REST",
    icon: IconLayoutDashboard,
    href: "/SOC/REST",
  },
  {
    id: uniqueId(),
    title: "REST VIEW",
    icon: IconAperture,
    href: "/SOC/RESTVIEW",
  },
  {
    navlabel: true,
    subheader: "GRAPHQL",
  },
  {
    id: uniqueId(),
    title: "GRAPHQL",
    icon: IconLayoutDashboard,
    href: "/SOC/GRAPHQL",
  },
  {
    id: uniqueId(),
    title: "GRAPHQL VIEW",
    icon: IconAperture,
    href: "/SOC/GRAPHQLVIEW",
  },
];

export default Menuitems;
