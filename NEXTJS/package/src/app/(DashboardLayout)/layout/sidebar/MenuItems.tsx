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
    title: "SOAP View Date",
    icon: IconLayoutDashboard,
    href: "/SOC/SOAP",
  },

  {
    navlabel: true,
    subheader: "REST",
  },
  {
    id: uniqueId(),
    title: "REST Compare dates",
    icon: IconLayoutDashboard,
    href: "/SOC/REST",
  },
  {
    id: uniqueId(),
    title: "REST View Date",
    icon: IconAperture,
    href: "/SOC/RESTVIEW",
  },
  {
    navlabel: true,
    subheader: "GRAPHQL",
  },
  {
    id: uniqueId(),
    title: "GRAPHQL Compare dates",
    icon: IconLayoutDashboard,
    href: "/SOC/GRAPHQL",
  },
  {
    id: uniqueId(),
    title: "GRAPHQL View Date",
    icon: IconAperture,
    href: "/SOC/GRAPHQLVIEW",
  },
];

export default Menuitems;
