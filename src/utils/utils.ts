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

export function isValidInn(value: string): boolean {
  const INN_PATTERN = /^\d{10}$|^\d{12}$/;
  return INN_PATTERN.test(value) 
}