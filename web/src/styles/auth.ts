import { Link } from "react-router-dom";
import styled from "styled-components";

import { BrandMark as BaseBrandMark, Card } from "./ui";
import { colors } from "./theme";

export { PageTitle as AuthTitle, Subtitle as AuthSubtitle } from "./ui";

export const Screen = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;

export const AuthCard = styled(Card).attrs({ $padding: "2rem" })`
  width: 100%;
  max-width: 28rem;
`;

export const AuthHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const BrandMark = styled(BaseBrandMark).attrs({ $size: "lg" as const })``;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Footer = styled.p`
  margin: 1.5rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: ${colors.slate500};
`;

export const FooterLink = styled(Link)`
  font-weight: 600;
  color: ${colors.brand600};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
