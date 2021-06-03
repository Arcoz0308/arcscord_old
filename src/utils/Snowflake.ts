export type Snowflake = `${bigint}`;

export function getDate(snowflake: Snowflake): number {
    return Math.floor(parseInt(snowflake, 10) / 4194304) + 1420070400000;
}
