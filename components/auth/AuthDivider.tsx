/**
 * Visual "or" divider between email and OAuth login options.
 */
export function AuthDivider(): React.ReactElement {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[--border]" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-[--bg-elevated] px-3 text-[--text-secondary]">or</span>
      </div>
    </div>
  )
}
