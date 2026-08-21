export function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (value === undefined)
    throw new Error(`Skill issue detected: missing ${key} env variable`);

  return value;
}
