export interface AiClientInterface {
  extractStructuredDataFromText(text: string): Promise<any[]>;
}