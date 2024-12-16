import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/" style={{ paddingTop: "20px"}}>
      <Image src="/images/logos/nvidia.png" alt="logo" height={40} width={174} priority />
    </LinkStyled>
  );
};

export default Logo;
