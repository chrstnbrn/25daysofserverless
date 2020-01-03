export interface NaughtyOrNiceResult {
  name: string;
  sentiments: number[];
  averageSentiment: number;
  result: "nice" | "naughty";
}
