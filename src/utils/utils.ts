export function validEnv(
  name: string | undefined,
  variableName?: string,
): string {
  if (!name) {
    throw new Error(
      variableName
        ? `Missing evironment variable:${variableName}`
        : 'Missing required environment variable',
    );
  }
  return name;
}
