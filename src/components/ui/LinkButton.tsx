import { Link, type LinkProps } from "react-router-dom";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./Button";

interface Props extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** A react-router Link styled exactly like a Button. */
export function LinkButton({ variant, size, className, ...props }: Props) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
