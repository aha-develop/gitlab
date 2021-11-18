declare interface ParsedMR {
  repo: string;
  mrId: string;
}

declare type Command = 'addLink' | 'removeLinks' | 'sync';
