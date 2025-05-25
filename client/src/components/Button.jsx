const base =
  "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500";

const prim = "border-gray-300 shadow-sm"; // removed text and bg color
const sec = "border-transparent shadow-sm"; // same here

export function Button({
  children,
  handleClick = null,
  className = "",
  primary = false,
  type = "button",
  autoFocus = false,
}) {
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${base} ${primary ? prim : sec} ${className}`}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
