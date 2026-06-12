import styled, { css } from "styled-components";

import { colors } from "./theme";

export const Card = styled.div<{ $padding?: string }>`
  background: ${colors.surface};
  backdrop-filter: blur(8px);
  border: 1px solid ${colors.surfaceBorder};
  border-radius: 1rem;
  box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.18);
  padding: ${(p) => p.$padding ?? "1.5rem"};
`;

export const PrimaryButton = styled.button<{ $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${(p) => p.$fullWidth && css`width: 100%;`}
  border: none;
  background: linear-gradient(135deg, ${colors.brand500}, ${colors.brand600});
  color: ${colors.onAccent};
  font-weight: 600;
  font-family: inherit;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 8px 20px -8px rgba(5, 150, 105, 0.6);

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const fieldStyles = css`
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: ${colors.white};
  padding: 0.625rem 0.875rem;
  outline: none;
  font: inherit;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: ${colors.brand500};
    box-shadow: 0 0 0 3px ${colors.brand100};
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Textarea = styled.textarea`
  ${fieldStyles}
  min-height: 8rem;
  resize: vertical;
`;

export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.slate600};
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.red500};
`;

export const PageColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const NarrowColumn = styled(PageColumn)`
  margin: 0 auto;
  max-width: 36rem;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.slate500};
`;

export const MutedText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.slate400};
`;

export const StackCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 1px solid ${colors.slate200};
  background: transparent;
  padding: 0.625rem 1rem;
  font-weight: 500;
  font-family: inherit;
  font-size: 0.875rem;
  color: ${colors.slate600};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${colors.slate50};
  }
`;

export const BrandMark = styled.div<{ $size?: "sm" | "lg" }>`
  display: grid;
  place-items: center;
  background: ${colors.brand500};
  color: ${colors.onAccent};
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  ${(p) =>
    p.$size === "lg"
      ? css`
          margin: 0 auto 0.75rem;
          height: 3rem;
          width: 3rem;
          border-radius: 1rem;
          font-size: 1.5rem;
        `
      : css`
          height: 2.25rem;
          width: 2.25rem;
          border-radius: 0.75rem;
          font-size: 1.125rem;
        `}
`;
