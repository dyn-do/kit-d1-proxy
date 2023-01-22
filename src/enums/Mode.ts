export const Command = {
    QUERY: 0,
    EXECUTE: 1,
    DUMP: 2,
} as const;
export type Command = typeof Command[keyof typeof Command];
export const CommandName: { [key: string]: string } = {}
CommandName[Command.QUERY] = "query";
CommandName[Command.EXECUTE] = "execute";
CommandName[Command.DUMP] = "dump";
